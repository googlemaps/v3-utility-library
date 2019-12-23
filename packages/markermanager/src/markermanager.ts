/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference types="@types/googlemaps" />

import { latLngToPixel } from "./utils";
import { GridBounds } from "./gridbounds";

interface Options {
  maxZoom?: number;
  shown?: boolean;
  trackMarkers?: boolean;
  borderPadding?: number;
}

/**
 * Creates a new MarkerManager that will show/hide markers on a map.
 */
class MarkerManager {
  public shown: boolean;
  public shownMarkers: number;

  private _map: google.maps.Map;
  private _mapZoom: number;
  private _maxZoom: number;
  private _tileSize = 1024;
  private _trackMarkers: boolean;
  private _swPadding: google.maps.Size;
  private _nePadding: google.maps.Size;
  private _gridWidth: { [k: string]: number };
  private _grid: google.maps.Marker[][][][];
  private _numMarkers: { [k: string]: number };
  private _shownBounds: GridBounds;

  /**
   * @constructor
   * @param map The map to manage.
   * @param {Options} options
   */
  constructor(
    map: google.maps.Map,
    { maxZoom = 19, trackMarkers, shown = true, borderPadding = 100 }: Options
  ) {
    this._map = map;
    this._mapZoom = map.getZoom();
    this._maxZoom = maxZoom;
    this._trackMarkers = trackMarkers;

    // The padding in pixels beyond the viewport, where we will pre-load markers.
    this._swPadding = new google.maps.Size(-borderPadding, borderPadding);
    this._nePadding = new google.maps.Size(borderPadding, -borderPadding);

    this._gridWidth = {};
    this._grid = [];
    this._grid[this._maxZoom] = [];
    this._numMarkers = {};
    this._numMarkers[this._maxZoom] = 0;

    this.shownMarkers = 0;
    this.shown = shown;

    google.maps.event.addListenerOnce(map, "idle", () => {
      this._initialize();
    });
  }

  private _initialize(): void {
    const mapTypes = this._map.mapTypes;

    // Find max zoom level
    let mapMaxZoom = 1;
    for (const sType in mapTypes) {
      if (
        sType in mapTypes &&
        mapTypes.get(sType) &&
        mapTypes.get(sType).maxZoom === "number"
      ) {
        const mapTypeMaxZoom = this._map.mapTypes.get(sType).maxZoom;
        if (mapTypeMaxZoom > mapMaxZoom) {
          mapMaxZoom = mapTypeMaxZoom;
        }
      }
    }

    google.maps.event.addListener(
      this._map,
      "dragend",
      this._onMapMoveEnd.bind(this)
    );

    google.maps.event.addListener(
      this._map,
      "idle",
      this._onMapMoveEnd.bind(this)
    );

    google.maps.event.addListener(
      this._map,
      "zoom_changed",
      this._onMapMoveEnd.bind(this)
    );

    this.resetManager();

    this._shownBounds = this._getMapGridBounds();

    google.maps.event.trigger(this, "loaded");
  }
  /**
   * This closure provide easy access to the map.
   * They are used as callbacks, not as methods.
   * @param marker Marker to be removed from the map
   */
  private _removeOverlay(marker: google.maps.Marker): void {
    marker.setMap(null);
    this.shownMarkers--;
  }

  /**
   * This closure provide easy access to the map.
   * They are used as callbacks, not as methods.
   * @param marker Marker to be added to the map
   */
  private _addOverlay(marker: google.maps.Marker): void {
    if (this.shown) {
      marker.setMap(this._map);
      this.shownMarkers++;
    }
  }

  /**
   * Initializes MarkerManager arrays for all zoom levels
   * Called by constructor and by clearAllMarkers
   */
  public resetManager(): void {
    let mapWidth = 256;
    for (let zoom = 0; zoom <= this._maxZoom; ++zoom) {
      this._grid[zoom] = [];
      this._numMarkers[zoom] = 0;
      this._gridWidth[zoom] = Math.ceil(mapWidth / this._tileSize);
      mapWidth <<= 1;
    }
  }

  /**
   * Removes all markers in the manager, and
   * removes any visible markers from the map.
   */
  public clearMarkers(): void {
    this._processAll(this._shownBounds, this._removeOverlay.bind(this));
    this.resetManager();
  }

  /**
   * Gets the tile coordinate for a given latlng point.
   *
   * @param {LatLng} latlng The geographical point.
   * @param {Number} zoom The zoom level.
   * @param {google.maps.Size} padding The padding used to shift the pixel coordinate.
   *               Used for expanding a bounds to include an extra padding
   *               of pixels surrounding the bounds.
   * @return {GPoint} The point in tile coordinates.
   *
   */
  private _getTilePoint(
    latlng: google.maps.LatLng,
    zoom: number,
    padding: google.maps.Size
  ): google.maps.Point {
    const pixelPoint = latLngToPixel(latlng, zoom);

    const point = new google.maps.Point(
      Math.floor((pixelPoint.x + padding.width) / this._tileSize),
      Math.floor((pixelPoint.y + padding.height) / this._tileSize)
    );

    return point;
  }

  /**
   * Finds the appropriate place to add the marker to the grid.
   * Optimized for speed; does not actually add the marker to the map.
   * Designed for batch-_processing thousands of markers.
   *
   * @param {Marker} marker The marker to add.
   * @param {Number} minZoom The minimum zoom for displaying the marker.
   * @param {Number} maxZoom The maximum zoom for displaying the marker.
   */
  private _addMarkerBatch(
    marker: google.maps.Marker,
    minZoom: number,
    maxZoom: number
  ): void {
    const mPoint = marker.getPosition();
    marker.set("__minZoom", minZoom);

    // Tracking markers is expensive, so we do this only if the
    // user explicitly requested it when creating marker manager.
    if (this._trackMarkers) {
      google.maps.event.addListener(marker, "changed", function(a, b, c) {
        this._onMarkerMoved(a, b, c);
      });
    }

    const gridPoint = this._getTilePoint(
      mPoint,
      maxZoom,
      new google.maps.Size(0, 0)
    );

    for (let zoom = maxZoom; zoom >= minZoom; zoom--) {
      const cell = this._getGridCellCreate(gridPoint.x, gridPoint.y, zoom);
      cell.push(marker);

      gridPoint.x = gridPoint.x >> 1;
      gridPoint.y = gridPoint.y >> 1;
    }
  }

  /**
   * Returns whether or not the given point is visible in the shown bounds. This
   * is a helper method that takes care of the corner case, when shownBounds have
   * negative minX value.
   *
   * @param {Point} point a point on a grid.
   * @return {Boolean} Whether or not the given point is visible in the currently
   * shown bounds.
   */
  private _isGridPointVisible(point: google.maps.Point): boolean {
    const vertical =
      this._shownBounds.minY <= point.y && point.y <= this._shownBounds.maxY;
    const minX = this._shownBounds.minX;
    let horizontal = minX <= point.x && point.x <= this._shownBounds.maxX;
    if (!horizontal && minX < 0) {
      // Shifts the negative part of the rectangle. As point.x is always less
      // than grid width, only test shifted minX .. 0 part of the shown bounds.
      const width = this._gridWidth[this._shownBounds.z];
      horizontal = minX + width <= point.x && point.x <= width - 1;
    }
    return vertical && horizontal;
  }

  /**
   * Reacts to a notification from a marker that it has moved to a new location.
   * It scans the grid all all zoom levels and moves the marker from the old grid
   * location to a new grid location.
   *
   * @param {Marker} marker The marker that moved.
   * @param {LatLng} oldPoint The old position of the marker.
   * @param {LatLng} newPoint The new position of the marker.
   */
  private _onMarkerMoved(
    marker: google.maps.Marker,
    oldPoint: google.maps.LatLng,
    newPoint: google.maps.LatLng
  ): void {
    // NOTE: We do not know the minimum or maximum zoom the marker was
    // added at, so we start at the absolute maximum. Whenever we successfully
    // remove a marker at a given zoom, we add it at the new grid coordinates.
    let zoom = this._maxZoom;
    let changed = false;
    const oldGrid = this._getTilePoint(
      oldPoint,
      zoom,
      new google.maps.Size(0, 0)
    );
    const newGrid = this._getTilePoint(
      newPoint,
      zoom,
      new google.maps.Size(0, 0)
    );
    while (zoom >= 0 && (oldGrid.x !== newGrid.x || oldGrid.y !== newGrid.y)) {
      const cell = this._getGridCellNoCreate(oldGrid.x, oldGrid.y, zoom);
      if (cell) {
        if (this._removeMarkerFromCell(cell, marker)) {
          this._getGridCellCreate(newGrid.x, newGrid.y, zoom).push(marker);
        }
      }
      // For the current zoom we also need to update the map. Markers that no
      // longer are visible are removed from the map. Markers that moved into
      // the shown bounds are added to the map. This also lets us keep the count
      // of visible markers up to date.
      if (zoom === this._mapZoom) {
        if (this._isGridPointVisible(oldGrid)) {
          if (!this._isGridPointVisible(newGrid)) {
            this._removeOverlay(marker);
            changed = true;
          }
        } else {
          if (this._isGridPointVisible(newGrid)) {
            this._addOverlay(marker);
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
      this._notifyListeners();
    }
  }

  /**
   * Removes marker from the manager and from the map
   * (if it's currently visible).
   * @param {GMarker} marker The marker to delete.
   */
  public removeMarker(marker: google.maps.Marker): void {
    let zoom = this._maxZoom;
    let changed = false;
    const point = marker.getPosition();
    const grid = this._getTilePoint(point, zoom, new google.maps.Size(0, 0));
    while (zoom >= 0) {
      const cell = this._getGridCellNoCreate(grid.x, grid.y, zoom);

      if (cell) {
        this._removeMarkerFromCell(cell, marker);
      }
      // For the current zoom we also need to update the map. Markers that no
      // longer are visible are removed from the map. This also lets us keep the count
      // of visible markers up to date.
      if (zoom === this._mapZoom) {
        if (this._isGridPointVisible(grid)) {
          this._removeOverlay(marker);
          changed = true;
        }
      }
      grid.x = grid.x >> 1;
      grid.y = grid.y >> 1;
      --zoom;
    }
    if (changed) {
      this._notifyListeners();
    }
    this._numMarkers[marker.get("__minZoom")]--;
  }

  /**
   * Add many markers at once.
   * Does not actually update the map, just the internal grid.
   *
   * @param {Array of Marker} markers The markers to add.
   * @param {Number} minZoom The minimum zoom level to display the markers.
   * @param {Number} maxZoom The maximum zoom level to display the markers.
   */
  public addMarkers(
    markers: google.maps.Marker[],
    minZoom: number,
    maxZoom: number
  ): void {
    maxZoom = this._getOptmaxZoom(maxZoom);
    for (let i = markers.length - 1; i >= 0; i--) {
      this._addMarkerBatch(markers[i], minZoom, maxZoom);
    }

    this._numMarkers[minZoom] += markers.length;
  }

  /**
   * Returns the value of the optional maximum zoom. This method is defined so
   * that we have just one place where optional maximum zoom is calculated.
   *
   * @param {Number} maxZoom The optinal maximum zoom.
   * @return The maximum zoom.
   */
  private _getOptmaxZoom(maxZoom: number): number {
    return maxZoom || this._maxZoom;
  }

  /**
   * Calculates the total number of markers potentially visible at a given
   * zoom level.
   *
   * @param {Number} zoom The zoom level to check.
   */
  public getMarkerCount(zoom: number): number {
    let total = 0;
    for (let z = 0; z <= zoom; z++) {
      total += this._numMarkers[z];
    }
    return total;
  }

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
  public getMarker(lat: number, lng: number, zoom: number): google.maps.Marker {
    const mPoint = new google.maps.LatLng(lat, lng);
    const gridPoint = this._getTilePoint(
      mPoint,
      zoom,
      new google.maps.Size(0, 0)
    );

    let marker = new google.maps.Marker({ position: mPoint });

    const cell = this._getGridCellNoCreate(gridPoint.x, gridPoint.y, zoom);
    if (cell !== undefined) {
      for (let i = 0; i < cell.length; i++) {
        if (
          lat === cell[i].getPosition().lat() &&
          lng === cell[i].getPosition().lng()
        ) {
          marker = cell[i];
        }
      }
    }
    return marker;
  }

  /**
   * Add a single marker to the map.
   *
   * @param {Marker} marker The marker to add.
   * @param {Number} minZoom The minimum zoom level to display the marker.
   * @param {Number} maxZoom The maximum zoom level to display the marker.
   */
  public addMarker(
    marker: google.maps.Marker,
    minZoom: number,
    maxZoom: number
  ): void {
    maxZoom = this._getOptmaxZoom(maxZoom);
    this._addMarkerBatch(marker, minZoom, maxZoom);
    const gridPoint = this._getTilePoint(
      marker.getPosition(),
      this._mapZoom,
      new google.maps.Size(0, 0)
    );
    if (
      this._isGridPointVisible(gridPoint) &&
      minZoom <= this._shownBounds.z &&
      this._shownBounds.z <= maxZoom
    ) {
      this._addOverlay(marker);
      this._notifyListeners();
    }
    this._numMarkers[minZoom]++;
  }

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
  private _getGridCellCreate(
    x: number,
    y: number,
    z: number
  ): google.maps.Marker[] {
    // TODO(jpoehnelt) document this
    if (x < 0) {
      x += this._gridWidth[z];
    }

    if (!this._grid[z]) {
      this._grid[z] = [];
    }
    if (!this._grid[z][x]) {
      this._grid[z][x] = [];
    }
    if (!this._grid[z][x][y]) {
      this._grid[z][x][y] = [];
    }
    return this._grid[z][x][y];
  }

  /**
   * Get a cell in the grid, returning undefined if it does not exist.
   *
   * NOTE: Optimized for speed -- otherwise could combine with _getGridCellCreate.
   *
   * @param {Number} x The x coordinate of the cell.
   * @param {Number} y The y coordinate of the cell.
   * @param {Number} z The z coordinate of the cell.
   * @return {Array} The cell in the array.
   */
  private _getGridCellNoCreate(
    x: number,
    y: number,
    z: number
  ): google.maps.Marker[] | null {
    if (x < 0) {
      x += this._gridWidth[z];
    }

    if (!this._grid[z]) {
      return null;
    }
    if (!this._grid[z][x]) {
      return null;
    }
    if (!this._grid[z][x][y]) {
      return null;
    }
    return this._grid[z][x][y];
  }

  /**
   * Turns at geographical bounds into a grid-space bounds.
   *
   * @param {LatLngBounds} bounds The geographical bounds.
   * @param {Number} zoom The zoom level of the bounds.
   * @param {google.maps.Size} swPadding The padding in pixels to extend beyond the
   * given bounds.
   * @param {google.maps.Size} nePadding The padding in pixels to extend beyond the
   * given bounds.
   * @return {GridBounds} The bounds in grid space.
   */
  private _getGridBounds(
    bounds: google.maps.LatLngBounds,
    zoom: number,
    swPadding: google.maps.Size,
    nePadding: google.maps.Size
  ): GridBounds {
    zoom = Math.min(zoom, this._maxZoom);

    const bl = bounds.getSouthWest();
    const tr = bounds.getNorthEast();
    const sw = this._getTilePoint(bl, zoom, swPadding);

    const ne = this._getTilePoint(tr, zoom, nePadding);
    const gw = this._gridWidth[zoom];

    // Crossing the prime meridian requires correction of bounds.
    if (tr.lng() < bl.lng() || ne.x < sw.x) {
      sw.x -= gw;
    }
    if (ne.x - sw.x + 1 >= gw) {
      // Computed grid bounds are larger than the world; truncate.
      sw.x = 0;
      ne.x = gw - 1;
    }

    const gridBounds = new GridBounds([sw, ne], zoom);
    gridBounds.z = zoom;

    return gridBounds;
  }

  /**
   * Gets the grid-space bounds for the current map viewport.
   *
   * @return {Bounds} The bounds in grid space.
   */
  private _getMapGridBounds(): GridBounds {
    return this._getGridBounds(
      this._map.getBounds(),
      this._mapZoom,
      this._swPadding,
      this._nePadding
    );
  }

  /**
   * Event listener for map:movend.
   * NOTE: Use a timeout so that the user is not blocked
   * from moving the map.
   *
   * Removed this because a a lack of a scopy override/callback function on events.
   */
  private _onMapMoveEnd(): void {
    window.setTimeout(this._updateMarkers.bind(this), 0);
  }

  /**
   * Is this layer visible?
   *
   * Returns visibility setting
   *
   * @return {Boolean} Visible
   */
  public visible(): boolean {
    return this.shown ? true : false;
  }

  /**
   * Returns true if the manager is hidden.
   * Otherwise returns false.
   * @return {Boolean} Hidden
   */
  public isHidden(): boolean {
    return !this.shown;
  }

  /**
   * Shows the manager if it's currently hidden.
   */
  public show(): void {
    this.shown = true;
    this.refresh();
  }

  /**
   * Hides the manager if it's currently visible
   */
  public hide(): void {
    this.shown = false;
    this.refresh();
  }

  /**
   * Toggles the visibility of the manager.
   */
  public toggle(): void {
    this.shown = !this.shown;
    this.refresh();
  }

  /**
   * Refresh forces the marker-manager into a good state.
   * <ol>
   *   <li>If never before initialized, shows all the markers.</li>
   *   <li>If previously initialized, removes and re-adds all markers.</li>
   * </ol>
   */
  public refresh(): void {
    if (this.shownMarkers > 0) {
      this._processAll(this._shownBounds, this._removeOverlay.bind(this));
    }
    // An extra check on this.show to increase performance (no need to _processAll_)
    if (this.show) {
      this._processAll(this._shownBounds, this._addOverlay.bind(this));
    }
    this._notifyListeners();
  }

  /**
   * After the viewport may have changed, add or remove markers as needed.
   */
  private _updateMarkers(): void {
    this._mapZoom = this._map.getZoom();
    const newBounds = this._getMapGridBounds();

    // If the move does not include new grid sections,
    // we have no work to do:
    if (
      newBounds.equals(this._shownBounds) &&
      newBounds.z === this._shownBounds.z
    ) {
      return;
    }

    if (newBounds.z !== this._shownBounds.z) {
      this._processAll(this._shownBounds, this._removeOverlay.bind(this));
      if (this.show) {
        // performance
        this._processAll(newBounds, this._addOverlay.bind(this));
      }
    } else {
      // Remove markers:
      this._rectangleDiff(
        this._shownBounds,
        newBounds,
        this._removeCellMarkers.bind(this)
      );

      // Add markers:
      if (this.show) {
        // performance
        this._rectangleDiff(
          newBounds,
          this._shownBounds,
          this._addCellMarkers.bind(this)
        );
      }
    }
    this._shownBounds = newBounds;

    this._notifyListeners();
  }

  /**
   * Notify listeners when the state of what is displayed changes.
   */
  private _notifyListeners(): void {
    google.maps.event.trigger(
      this,
      "changed",
      this._shownBounds,
      this.shownMarkers
    );
  }

  /**
   * Process all markers in the bounds provided, using a callback.
   *
   * @param {Bounds} bounds The bounds in grid space.
   * @param {Function} callback The function to call for each marker.
   */
  private _processAll(
    bounds: GridBounds,
    callback: (marker: google.maps.Marker) => void
  ): void {
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      for (let y = bounds.minY; y <= bounds.maxY; y++) {
        this._processCellMarkers(x, y, bounds.z, callback);
      }
    }
  }

  /**
   * Process all markers in the grid cell, using a callback.
   *
   * @param {Number} x The x coordinate of the cell.
   * @param {Number} y The y coordinate of the cell.
   * @param {Number} z The z coordinate of the cell.
   * @param {Function} callback The function to call for each marker.
   */
  private _processCellMarkers(
    x: number,
    y: number,
    z: number,
    callback: (marker: google.maps.Marker) => void
  ): void {
    const cell = this._getGridCellNoCreate(x, y, z);
    if (cell) {
      for (let i = cell.length - 1; i >= 0; i--) {
        callback(cell[i]);
      }
    }
  }

  /**
   * Remove all markers in a grid cell.
   *
   * @param {Number} x The x coordinate of the cell.
   * @param {Number} y The y coordinate of the cell.
   * @param {Number} z The z coordinate of the cell.
   */
  private _removeCellMarkers(x: number, y: number, z: number): void {
    this._processCellMarkers(x, y, z, this._removeOverlay.bind(this));
  }

  /**
   * Add all markers in a grid cell.
   *
   * @param {Number} x The x coordinate of the cell.
   * @param {Number} y The y coordinate of the cell.
   * @param {Number} z The z coordinate of the cell.
   */
  private _addCellMarkers(x: number, y: number, z: number): void {
    this._processCellMarkers(x, y, z, this._addOverlay.bind(this));
  }

  /**
   * Use the _rectangleDiffCoords function to process all grid cells
   * that are in bounds1 but not bounds2, using a callback, and using
   * the current MarkerManager object as the instance.
   *
   * Pass the z parameter to the callback in addition to x and y.
   *
   * @param {Bounds} bounds1 The bounds of all points we may _process.
   * @param {Bounds} bounds2 The bounds of points to exclude.
   * @param {Function} callback The callback function to call
   *                   for each grid coordinate (x, y, z).
   */
  private _rectangleDiff(
    bounds1: GridBounds,
    bounds2: GridBounds,
    callback: (x: number, y: number, z: number) => void
  ): void {
    this._rectangleDiffCoords(bounds1, bounds2, function(x, y) {
      callback(x, y, bounds1.z);
    });
  }

  /**
   * Calls the function for all points in bounds1, not in bounds2
   *
   * @param {Bounds} bounds1 The bounds of all points we may process.
   * @param {Bounds} bounds2 The bounds of points to exclude.
   * @param {Function} callback The callback function to call
   *                   for each grid coordinate.
   */
  private _rectangleDiffCoords(
    bounds1: GridBounds,
    bounds2: GridBounds,
    callback: (x: number, y: number) => void
  ): void {
    const minX1 = bounds1.minX;
    const minY1 = bounds1.minY;
    const maxX1 = bounds1.maxX;
    const maxY1 = bounds1.maxY;
    const minX2 = bounds2.minX;
    const minY2 = bounds2.minY;
    const maxX2 = bounds2.maxX;
    const maxY2 = bounds2.maxY;

    let x, y;
    for (x = minX1; x <= maxX1; x++) {
      // All x in R1
      // All above:
      for (y = minY1; y <= maxY1 && y < minY2; y++) {
        // y in R1 above R2
        callback(x, y);
      }
      // All below:
      for (
        y = Math.max(maxY2 + 1, minY1); // y in R1 below R2
        y <= maxY1;
        y++
      ) {
        callback(x, y);
      }
    }

    for (y = Math.max(minY1, minY2); y <= Math.min(maxY1, maxY2); y++) {
      // All y in R2 and in R1
      // Strictly left:
      for (x = Math.min(maxX1 + 1, minX2) - 1; x >= minX1; x--) {
        // x in R1 left of R2
        callback(x, y);
      }
      // Strictly right:
      for (
        x = Math.max(minX1, maxX2 + 1); // x in R1 right of R2
        x <= maxX1;
        x++
      ) {
        callback(x, y);
      }
    }
  }

  /**
   * Removes marker from cell. O(N).
   */
  private _removeMarkerFromCell(
    cell: google.maps.Marker[],
    marker: google.maps.Marker
  ): number {
    let shift = 0;
    for (let i = 0; i < cell.length; ++i) {
      if (cell[i] === marker) {
        cell.splice(i--, 1);
        shift++;
      }
    }
    return shift;
  }
}

export { MarkerManager };
