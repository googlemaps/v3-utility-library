/**
 * @name MarkerManager
 * @version 1.0
 * @copyright (c) 2007 Google Inc.
 * @author Doug Ricket, others
 *
 * @fileoverview Marker manager is an interface between the map and the user,
 * designed to manage adding and removing many points when the viewport changes.
 * <br /><br />
 * <b>How it Works</b>:<br/>
 * The MarkerManager places its markers onto a grid, similar to the map tiles.
 * When the user moves the viewport, it computes which grid cells have
 * entered or left the viewport, and shows or hides all the markers in those
 * cells.
 * (If the users scrolls the viewport beyond the markers that are loaded,
 * no markers will be visible until the <code>EVENT_moveend</code>
 * triggers an update.)
 * In practical consequences, this allows 10,000 markers to be distributed over
 * a large area, and as long as only 100-200 are visible in any given viewport,
 * the user will see good performance corresponding to the 100 visible markers,
 * rather than poor performance corresponding to the total 10,000 markers.
 * Note that some code is optimized for speed over space,
 * with the goal of accommodating thousands of markers.
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @name MarkerManagerOptions
 * @class This class represents optional arguments to the {@link MarkerManager}
 *     constructor.
 * @property {Number} [maxZoom] Sets the maximum zoom level monitored by a
 *     marker manager. If not given, the manager assumes the maximum map zoom
 *     level. This value is also used when markers are added to the manager
 *     without the optional {@link maxZoom} parameter.
 * @property {Number} [borderPadding] Specifies, in pixels, the extra padding
 *     outside the map's current viewport monitored by a manager. Markers that
 *     fall within this padding are added to the map, even if they are not fully
 *     visible.
 * @property {Boolean} [trackMarkers=false] Indicates whether or not a marker
 *     manager should track markers' movements. If you wish to move managed
 *     markers using the {@link setPoint}/{@link setLatLng} methods,
 *     this option should be set to {@link true}.
 */

/**
 * Creates a new MarkerManager that will show/hide markers on a map.
 *
 * @constructor
 * @param {Map} map The map to manage.
 * @param {Object} opt_opts A container for optional arguments:
 *   {Number} maxZoom The maximum zoom level for which to create tiles.
 *   {Number} borderPadding The width in pixels beyond the map border,
 *                   where markers should be display.
 *   {Boolean} trackMarkers Whether or not this manager should track marker
 *                   movements.
 */
function MarkerManager(map, opt_opts) {
  var me = this;
  me.map_ = map;
  me.mapZoom_ = map.getZoom();
  me.projection_ = map.getCurrentMapType().getProjection();

  opt_opts = opt_opts || {};
  me.tileSize_ = MarkerManager.DEFAULT_TILE_SIZE_;

  var mapTypes = map.getMapTypes();
  var mapMaxZoom = mapTypes[0].getMaximumResolution();
  for (var i = 0; i < mapTypes.length; i++) {
    var mapTypeMaxZoom = mapTypes[i].getMaximumResolution();
    if (mapTypeMaxZoom > mapMaxZoom) {
      mapMaxZoom = mapTypeMaxZoom;
    }
  }
  me.maxZoom_  = opt_opts.maxZoom || mapMaxZoom;

  me.trackMarkers_ = opt_opts.trackMarkers;
  me.show_ = opt_opts.show || true;

  var padding;
  if (typeof opt_opts.borderPadding === "number") {
    padding = opt_opts.borderPadding;
  } else {
    padding = MarkerManager.DEFAULT_BORDER_PADDING_;
  }
  // The padding in pixels beyond the viewport, where we will pre-load markers.
  me.swPadding_ = new GSize(-padding, padding);
  me.nePadding_ = new GSize(padding, -padding);
  me.borderPadding_ = padding;

  me.gridWidth_ = [];

  me.grid_ = [];
  me.grid_[me.maxZoom_] = [];
  me.numMarkers_ = [];
  me.numMarkers_[me.maxZoom_] = 0;

  GEvent.bind(map, "moveend", me, me.onMapMoveEnd_);

  // NOTE: These two closures provide easy access to the map.
  // They are used as callbacks, not as methods.
  me.removeOverlay_ = function (marker) {
    map.removeOverlay(marker);
    me.shownMarkers_--;
  };
  me.addOverlay_ = function (marker) {
    if (me.show_) {
	  map.addOverlay(marker);
      me.shownMarkers_++;
    }
  };

  me.resetManager_();
  me.shownMarkers_ = 0;

  me.shownBounds_ = me.getMapGridBounds_();
}

// Static constants:
MarkerManager.DEFAULT_TILE_SIZE_ = 1024;
MarkerManager.DEFAULT_BORDER_PADDING_ = 100;
MarkerManager.MERCATOR_ZOOM_LEVEL_ZERO_RANGE = 256;


/**
 * Initializes MarkerManager arrays for all zoom levels
 * Called by constructor and by clearAllMarkers
 */
MarkerManager.prototype.resetManager_ = function () {
  var me = this;
  var mapWidth = MarkerManager.MERCATOR_ZOOM_LEVEL_ZERO_RANGE;
  for (var zoom = 0; zoom <= me.maxZoom_; ++zoom) {
    me.grid_[zoom] = [];
    me.numMarkers_[zoom] = 0;
    me.gridWidth_[zoom] = Math.ceil(mapWidth / me.tileSize_);
    mapWidth <<= 1;
  }
};

/**
 * Removes all markers in the manager, and
 * removes any visible markers from the map.
 */
MarkerManager.prototype.clearMarkers = function () {
  var me = this;
  me.processAll_(me.shownBounds_, me.removeOverlay_);
  me.resetManager_();
};


/**
 * Gets the tile coordinate for a given latlng point.
 *
 * @param {LatLng} latlng The geographical point.
 * @param {Number} zoom The zoom level.
 * @param {GSize} padding The padding used to shift the pixel coordinate.
 *               Used for expanding a bounds to include an extra padding
 *               of pixels surrounding the bounds.
 * @return {GPoint} The point in tile coordinates.
 *
 */
var tmpPixelPoint;
MarkerManager.prototype.getTilePoint_ = function (latlng, zoom, padding) {
  var pixelPoint = this.projection_.fromLatLngToPixel(latlng, zoom);
  tmpPixelPoint = pixelPoint;

  return new GPoint(
      Math.floor((pixelPoint.x + padding.width) / this.tileSize_),
      Math.floor((pixelPoint.y + padding.height) / this.tileSize_));
};


/**
 * Finds the appropriate place to add the marker to the grid.
 * Optimized for speed; does not actually add the marker to the map.
 * Designed for batch-processing thousands of markers.
 *
 * @param {Marker} marker The marker to add.
 * @param {Number} minZoom The minimum zoom for displaying the marker.
 * @param {Number} maxZoom The maximum zoom for displaying the marker.
 */
MarkerManager.prototype.addMarkerBatch_ = function (marker, minZoom, maxZoom) {
  var mPoint = marker.getPoint();
  marker.MarkerManager_minZoom = minZoom;
  // Tracking markers is expensive, so we do this only if the
  // user explicitly requested it when creating marker manager.
  if (this.trackMarkers_) {
    GEvent.bind(marker, "changed", this, this.onMarkerMoved_);
  }

  var gridPoint = this.getTilePoint_(mPoint, maxZoom, GSize.ZERO);

  for (var zoom = maxZoom; zoom >= minZoom; zoom--) {
    var cell = this.getGridCellCreate_(gridPoint.x, gridPoint.y, zoom);
    cell.push(marker);

    gridPoint.x = gridPoint.x >> 1;
    gridPoint.y = gridPoint.y >> 1;
  }
};


/**
 * Returns whether or not the given point is visible in the shown bounds. This
 * is a helper method that takes care of the corner case, when shownBounds have
 * negative minX value.
 *
 * @param {Point} point a point on a grid.
 * @return {Boolean} Whether or not the given point is visible in the currently
 * shown bounds.
 */
MarkerManager.prototype.isGridPointVisible_ = function (point) {
  var me = this;
  var vertical = me.shownBounds_.minY <= point.y &&
      point.y <= me.shownBounds_.maxY;
  var minX = me.shownBounds_.minX;
  var horizontal = minX <= point.x && point.x <= me.shownBounds_.maxX;
  if (!horizontal && minX < 0) {
    // Shifts the negative part of the rectangle. As point.x is always less
    // than grid width, only test shifted minX .. 0 part of the shown bounds.
    var width = me.gridWidth_[me.shownBounds_.z];
    horizontal = minX + width <= point.x && point.x <= width - 1;
  }
  return vertical && horizontal;
};


/**
 * Reacts to a notification from a marker that it has moved to a new location.
 * It scans the grid all all zoom levels and moves the marker from the old grid
 * location to a new grid location.
 *
 * @param {Marker} marker The marker that moved.
 * @param {LatLng} oldPoint The old position of the marker.
 * @param {LatLng} newPoint The new position of the marker.
 */
MarkerManager.prototype.onMarkerMoved_ = function (marker, oldPoint, newPoint) {
  // NOTE: We do not know the minimum or maximum zoom the marker was
  // added at, so we start at the absolute maximum. Whenever we successfully
  // remove a marker at a given zoom, we add it at the new grid coordinates.
  var me = this;
  var zoom = me.maxZoom_;
  var changed = false;
  var oldGrid = me.getTilePoint_(oldPoint, zoom, GSize.ZERO);
  var newGrid = me.getTilePoint_(newPoint, zoom, GSize.ZERO);
  while (zoom >= 0 && (oldGrid.x !== newGrid.x || oldGrid.y !== newGrid.y)) {
    var cell = me.getGridCellNoCreate_(oldGrid.x, oldGrid.y, zoom);
    if (cell) {
      if (me.removeFromArray_(cell, marker)) {
        me.getGridCellCreate_(newGrid.x, newGrid.y, zoom).push(marker);
      }
    }
    // For the current zoom we also need to update the map. Markers that no
    // longer are visible are removed from the map. Markers that moved into
    // the shown bounds are added to the map. This also lets us keep the count
    // of visible markers up to date.
    if (zoom === me.mapZoom_) {
      if (me.isGridPointVisible_(oldGrid)) {
        if (!me.isGridPointVisible_(newGrid)) {
          me.removeOverlay_(marker);
          changed = true;
        }
      } else {
        if (me.isGridPointVisible_(newGrid)) {
          me.addOverlay_(marker);
          changed = true;
        }
      }
    }
    oldGrid.x = oldGrid.x >> 1;
    oldGrid.y = oldGrid.y >> 1;
    newGrid.x = newGrid.x >> 1;
    newGrid.y = newGrid.y >> 1;
    --zoom;
  }
  if (changed) {
    me.notifyListeners_();
  }
};


/**
 * Removes marker from the manager and from the map
 * (if it's currently visible).
 * @param {GMarker} marker The marker to delete.
 */
MarkerManager.prototype.removeMarker = function (marker) {
  var me = this;
  var zoom = me.maxZoom_;
  var changed = false;
  var point = marker.getPoint();
  var grid = me.getTilePoint_(point, zoom, GSize.ZERO);
  while (zoom >= 0) {
    var cell = me.getGridCellNoCreate_(grid.x, grid.y, zoom);

    if (cell) {
      me.removeFromArray_(cell, marker);
    }
    // For the current zoom we also need to update the map. Markers that no
    // longer are visible are removed from the map. This also lets us keep the count
    // of visible markers up to date.
    if (zoom === me.mapZoom_) {
      if (me.isGridPointVisible_(grid)) {
        me.removeOverlay_(marker);
        changed = true;
      }
    }
    grid.x = grid.x >> 1;
    grid.y = grid.y >> 1;
    --zoom;
  }
  if (changed) {
    me.notifyListeners_();
  }
  me.numMarkers_[marker.MarkerManager_minZoom]--;
};


/**
 * Add many markers at once.
 * Does not actually update the map, just the internal grid.
 *
 * @param {Array of Marker} markers The markers to add.
 * @param {Number} minZoom The minimum zoom level to display the markers.
 * @param {Number} opt_maxZoom The maximum zoom level to display the markers.
 */
MarkerManager.prototype.addMarkers = function (markers, minZoom, opt_maxZoom) {
  var maxZoom = this.getOptMaxZoom_(opt_maxZoom);
  for (var i = markers.length - 1; i >= 0; i--) {
    this.addMarkerBatch_(markers[i], minZoom, maxZoom);
  }

  this.numMarkers_[minZoom] += markers.length;
};


/**
 * Returns the value of the optional maximum zoom. This method is defined so
 * that we have just one place where optional maximum zoom is calculated.
 *
 * @param {Number} opt_maxZoom The optinal maximum zoom.
 * @return The maximum zoom.
 */
MarkerManager.prototype.getOptMaxZoom_ = function (opt_maxZoom) {
  return opt_maxZoom || this.maxZoom_;
};


/**
 * Calculates the total number of markers potentially visible at a given
 * zoom level.
 *
 * @param {Number} zoom The zoom level to check.
 */
MarkerManager.prototype.getMarkerCount = function (zoom) {
  var total = 0;
  for (var z = 0; z <= zoom; z++) {
    total += this.numMarkers_[z];
  }
  return total;
};

/**
 * Returns a marker given latitude, longitude and zoom. If the marker does not
 * exist, the method will return a new marker. If a new marker is created,
 * it will NOT be added to the manager.
 *
 * @param {Number} lat - the latitude of a marker.
 * @param {Number} lng - the longitude of a marker.
 * @param {Number} zoom - the zoom level
 * @return {GMarker} marker - the marker found at lat and lng
 */
MarkerManager.prototype.getMarker = function(lat, lng, zoom) {
  var me = this;
  var mPoint = new GLatLng(lat, lng);
  var gridPoint = me.getTilePoint_(mPoint, zoom, GSize.ZERO);

  var marker = new GMarker(mPoint);
  var cellArray = me.getGridCellNoCreate_(gridPoint.x, gridPoint.y, zoom);
  if(cellArray != undefined){
    for (var i = 0; i < cellArray.length; i++)
    {
      if(lat == cellArray[i].getLatLng().lat() &&
         lng == cellArray[i].getLatLng().lng())
      {
        marker = cellArray[i];
      }
    }
  }
  return marker;
};

/**
 * Add a single marker to the map.
 *
 * @param {Marker} marker The marker to add.
 * @param {Number} minZoom The minimum zoom level to display the marker.
 * @param {Number} opt_maxZoom The maximum zoom level to display the marker.
 */
MarkerManager.prototype.addMarker = function (marker, minZoom, opt_maxZoom) {
  var me = this;
  var maxZoom = this.getOptMaxZoom_(opt_maxZoom);
  me.addMarkerBatch_(marker, minZoom, maxZoom);
  var gridPoint = me.getTilePoint_(marker.getPoint(), me.mapZoom_, GSize.ZERO);
  if (me.isGridPointVisible_(gridPoint) &&
      minZoom <= me.shownBounds_.z &&
      me.shownBounds_.z <= maxZoom) {
    me.addOverlay_(marker);
    me.notifyListeners_();
  }
  this.numMarkers_[minZoom]++;
};

/**
 * Returns true if this bounds (inclusively) contains the given point.
 * @param {Point} point  The point to test.
 * @return {Boolean} This Bounds contains the given Point.
 */
GBounds.prototype.containsPoint = function (point) {
  var outer = this;
  return (outer.minX <= point.x &&
          outer.maxX >= point.x &&
          outer.minY <= point.y &&
          outer.maxY >= point.y);
};

/**
 * Get a cell in the grid, creating it first if necessary.
 *
 * Optimization candidate
 *
 * @param {Number} x The x coordinate of the cell.
 * @param {Number} y The y coordinate of the cell.
 * @param {Number} z The z coordinate of the cell.
 * @return {Array} The cell in the array.
 */
MarkerManager.prototype.getGridCellCreate_ = function (x, y, z) {
  var grid = this.grid_[z];
  if (x < 0) {
    x += this.gridWidth_[z];
  }
  var gridCol = grid[x];
  if (!gridCol) {
    gridCol = grid[x] = [];
    return (gridCol[y] = []);
  }
  var gridCell = gridCol[y];
  if (!gridCell) {
    return (gridCol[y] = []);
  }
  return gridCell;
};


/**
 * Get a cell in the grid, returning undefined if it does not exist.
 *
 * NOTE: Optimized for speed -- otherwise could combine with getGridCellCreate_.
 *
 * @param {Number} x The x coordinate of the cell.
 * @param {Number} y The y coordinate of the cell.
 * @param {Number} z The z coordinate of the cell.
 * @return {Array} The cell in the array.
 */
MarkerManager.prototype.getGridCellNoCreate_ = function (x, y, z) {
  var grid = this.grid_[z];
  if (x < 0) {
    x += this.gridWidth_[z];
  }
  var gridCol = grid[x];
  return gridCol ? gridCol[y] : undefined;
};


/**
 * Turns at geographical bounds into a grid-space bounds.
 *
 * @param {LatLngBounds} bounds The geographical bounds.
 * @param {Number} zoom The zoom level of the bounds.
 * @param {GSize} swPadding The padding in pixels to extend beyond the
 * given bounds.
 * @param {GSize} nePadding The padding in pixels to extend beyond the
 * given bounds.
 * @return {GBounds} The bounds in grid space.
 */
MarkerManager.prototype.getGridBounds_ = function (bounds, zoom, swPadding, nePadding) {
  zoom = Math.min(zoom, this.maxZoom_);

  var bl = bounds.getSouthWest();
  var tr = bounds.getNorthEast();
  var sw = this.getTilePoint_(bl, zoom, swPadding);

  console.log(sw);
  console.log(bl);
  console.log(tmpPixelPoint)



  var ne = this.getTilePoint_(tr, zoom, nePadding);
  var gw = this.gridWidth_[zoom];


  
  console.log(ne);
  console.log(tr);
  console.log(tmpPixelPoint)
  console.log(gw);

  // Crossing the prime meridian requires correction of bounds.
  if (tr.lng() < bl.lng() || ne.x < sw.x) {
    sw.x -= gw;
  }
  if (ne.x - sw.x  + 1 >= gw) {
    // Computed grid bounds are larger than the world; truncate.
    sw.x = 0;
    ne.x = gw - 1;
  }
  var gridBounds = new GBounds([sw, ne]);
  gridBounds.z = zoom;

  console.log('GridBounds')
  console.log(gridBounds)
  return gridBounds;
};


/**
 * Gets the grid-space bounds for the current map viewport.
 *
 * @return {Bounds} The bounds in grid space.
 */
MarkerManager.prototype.getMapGridBounds_ = function () {
  var me = this;
  return me.getGridBounds_(me.map_.getBounds(), me.mapZoom_, me.swPadding_, me.nePadding_);
};


/**
 * Event listener for map:movend.
 * NOTE: Use a timeout so that the user is not blocked
 * from moving the map.
 *
 */
MarkerManager.prototype.onMapMoveEnd_ = function () {
  var me = this;
  me.objectSetTimeout_(this, this.updateMarkers_, 0);
};


/**
 * Call a function or evaluate an expression after a specified number of
 * milliseconds.
 *
 * Equivalent to the standard window.setTimeout function, but the given
 * function executes as a method of this instance. So the function passed to
 * objectSetTimeout can contain references to this.
 *    objectSetTimeout(this, function () { alert(this.x) }, 1000);
 *
 * @param {Object} object  The target object.
 * @param {Function} command  The command to run.
 * @param {Number} milliseconds  The delay.
 * @return {Boolean}  Success.
 */
MarkerManager.prototype.objectSetTimeout_ = function (object, command, milliseconds) {
  return window.setTimeout(function () {
    command.call(object);
  }, milliseconds);
};


/**
 * Is this layer visible?
 *
 * Returns visibility setting
 *
 * @return {Boolean} Visible
 */
MarkerManager.prototype.visible = function () {
  return this.show_ ? true : false;
};


/**
 * Returns true if the manager is hidden.
 * Otherwise returns false.
 * @return {Boolean} Hidden
 */
MarkerManager.prototype.isHidden = function () {
  return !this.show_;
};


/**
 * Shows the manager if it's currently hidden.
 */
MarkerManager.prototype.show = function () {
  this.show_ = true;
  this.refresh();
};


/**
 * Hides the manager if it's currently visible
 */
MarkerManager.prototype.hide = function () {
  this.show_ = false;
  this.refresh();
};


/**
 * Toggles the visibility of the manager.
 */
MarkerManager.prototype.toggle = function () {
  this.show_ = !this.show_;
  this.refresh();
};


/**
 * Refresh forces the marker-manager into a good state.
 * <ol>
 *   <li>If never before initialized, shows all the markers.</li>
 *   <li>If previously initialized, removes and re-adds all markers.</li>
 * </ol>
 */
MarkerManager.prototype.refresh = function () {
  var me = this;
  if (me.shownMarkers_ > 0) {
    me.processAll_(me.shownBounds_, me.removeOverlay_);
  }
  // An extra check on me.show_ to increase performance (no need to processAll_)
  if (me.show_) {
    me.processAll_(me.shownBounds_, me.addOverlay_);
  }
  me.notifyListeners_();
};


/**
 * After the viewport may have changed, add or remove markers as needed.
 */
MarkerManager.prototype.updateMarkers_ = function () {
  var me = this;
  me.mapZoom_ = this.map_.getZoom();
  var newBounds = me.getMapGridBounds_();

  console.log(newBounds)

  // If the move does not include new grid sections,
  // we have no work to do:
  if (newBounds.equals(me.shownBounds_) && newBounds.z === me.shownBounds_.z) {
    return;
  }

  if (newBounds.z !== me.shownBounds_.z) {
    me.processAll_(me.shownBounds_, me.removeOverlay_);
    if (me.show_) { // performance
      me.processAll_(newBounds, me.addOverlay_);
    }
  } else {
    // Remove markers:
    me.rectangleDiff_(me.shownBounds_, newBounds, me.removeCellMarkers_);

    // Add markers:
    if (me.show_) { // performance
      me.rectangleDiff_(newBounds, me.shownBounds_, me.addCellMarkers_);
    }
  }
  me.shownBounds_ = newBounds;

  me.notifyListeners_();
};


/**
 * Notify listeners when the state of what is displayed changes.
 */
MarkerManager.prototype.notifyListeners_ = function () {
  GEvent.trigger(this, "changed", this.shownBounds_, this.shownMarkers_);
};


/**
 * Process all markers in the bounds provided, using a callback.
 *
 * @param {Bounds} bounds The bounds in grid space.
 * @param {Function} callback The function to call for each marker.
 */
MarkerManager.prototype.processAll_ = function (bounds, callback) {
  for (var x = bounds.minX; x <= bounds.maxX; x++) {
    for (var y = bounds.minY; y <= bounds.maxY; y++) {
      this.processCellMarkers_(x, y,  bounds.z, callback);
    }
  }
};


/**
 * Process all markers in the grid cell, using a callback.
 *
 * @param {Number} x The x coordinate of the cell.
 * @param {Number} y The y coordinate of the cell.
 * @param {Number} z The z coordinate of the cell.
 * @param {Function} callback The function to call for each marker.
 */
MarkerManager.prototype.processCellMarkers_ = function (x, y, z, callback) {
  var cell = this.getGridCellNoCreate_(x, y, z);
  if (cell) {
    for (var i = cell.length - 1; i >= 0; i--) {
      callback(cell[i]);
    }
  }
};


/**
 * Remove all markers in a grid cell.
 *
 * @param {Number} x The x coordinate of the cell.
 * @param {Number} y The y coordinate of the cell.
 * @param {Number} z The z coordinate of the cell.
 */
MarkerManager.prototype.removeCellMarkers_ = function (x, y, z) {
  this.processCellMarkers_(x, y, z, this.removeOverlay_);
};


/**
 * Add all markers in a grid cell.
 *
 * @param {Number} x The x coordinate of the cell.
 * @param {Number} y The y coordinate of the cell.
 * @param {Number} z The z coordinate of the cell.
 */
MarkerManager.prototype.addCellMarkers_ = function (x, y, z) {
  this.processCellMarkers_(x, y, z, this.addOverlay_);
};


/**
 * Use the rectangleDiffCoords_ function to process all grid cells
 * that are in bounds1 but not bounds2, using a callback, and using
 * the current MarkerManager object as the instance.
 *
 * Pass the z parameter to the callback in addition to x and y.
 *
 * @param {Bounds} bounds1 The bounds of all points we may process.
 * @param {Bounds} bounds2 The bounds of points to exclude.
 * @param {Function} callback The callback function to call
 *                   for each grid coordinate (x, y, z).
 */
MarkerManager.prototype.rectangleDiff_ = function (bounds1, bounds2, callback) {
  var me = this;
  me.rectangleDiffCoords_(bounds1, bounds2, function (x, y) {
    callback.apply(me, [x, y, bounds1.z]);
  });
};


/**
 * Calls the function for all points in bounds1, not in bounds2
 *
 * @param {Bounds} bounds1 The bounds of all points we may process.
 * @param {Bounds} bounds2 The bounds of points to exclude.
 * @param {Function} callback The callback function to call
 *                   for each grid coordinate.
 */
MarkerManager.prototype.rectangleDiffCoords_ = function (bounds1, bounds2, callback) {
  var minX1 = bounds1.minX;
  var minY1 = bounds1.minY;
  var maxX1 = bounds1.maxX;
  var maxY1 = bounds1.maxY;
  var minX2 = bounds2.minX;
  var minY2 = bounds2.minY;
  var maxX2 = bounds2.maxX;
  var maxY2 = bounds2.maxY;

  var x, y;
  for (x = minX1; x <= maxX1; x++) {  // All x in R1
    // All above:
    for (y = minY1; y <= maxY1 && y < minY2; y++) {  // y in R1 above R2
      callback(x, y);
    }
    // All below:
    for (y = Math.max(maxY2 + 1, minY1);  // y in R1 below R2
         y <= maxY1; y++) {
      callback(x, y);
    }
  }

  for (y = Math.max(minY1, minY2);
       y <= Math.min(maxY1, maxY2); y++) {  // All y in R2 and in R1
    // Strictly left:
    for (x = Math.min(maxX1 + 1, minX2) - 1;
         x >= minX1; x--) {  // x in R1 left of R2
      callback(x, y);
    }
    // Strictly right:
    for (x = Math.max(minX1, maxX2 + 1);  // x in R1 right of R2
         x <= maxX1; x++) {
      callback(x, y);
    }
  }
};


/**
 * Removes value from array. O(N).
 *
 * @param {Array} array  The array to modify.
 * @param {any} value  The value to remove.
 * @param {Boolean} opt_notype  Flag to disable type checking in equality.
 * @return {Number}  The number of instances of value that were removed.
 */
MarkerManager.prototype.removeFromArray_ = function (array, value, opt_notype) {
  var shift = 0;
  for (var i = 0; i < array.length; ++i) {
    if (array[i] === value || (opt_notype && array[i] === value)) {
      array.splice(i--, 1);
      shift++;
    }
  }
  return shift;
};
