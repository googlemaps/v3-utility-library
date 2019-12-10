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

/**
 * @name MarkerClusterer for Google Maps v3
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 */

/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'imagePath': (string) The base URL where the images representing
 *                  clusters will be found. The full URL will be:
 *                  {imagePath}[1-5].{imageExtension}
 *                  Default: '../images/m'.
 *     'imageExtension': (string) The suffix for images URL representing
 *                       clusters will be found. See _imagePath_ for details.
 *                       Default: 'png'.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'zIndex': (number) the z-index of a cluster.
 *               Default: google.maps.Marker.MAX_ZINDEX + 1
 *     'styles': (Array.<Object>) An Array of single object that has style properties for all cluster:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */

class MarkerClusterer {
  constructor(map, opt_markers, opt_options) {
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = map;

    /**
     * The marker cluster image path.
     *
     * @type {string}
     * @private
     */
    this.MARKER_CLUSTER_IMAGE_PATH_ = "../images/m";

    /**
     * The marker cluster image path.
     *
     * @type {string}
     * @private
     */
    this.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png";
    /**
     * @type {Array.<google.maps.Marker>}
     * @private
     */
    this.markers_ = [];

    /**
     *  @type {Array.<Cluster>}
     */
    this.clusters_ = [];

    this.sizes = [53, 56, 66, 78, 90];

    /**
     * @type {Array.<Object>}
     * @private
     */
    this.styles_ = [];

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    var options = opt_options || {};

    /**
     * @type {number}
     */
    this.zIndex_ = options["zIndex"] || google.maps.Marker.MAX_ZINDEX + 1;

    /**
     * @type {number}
     * @private
     */
    this.gridSize_ = options["gridSize"] || 60;

    /**
     * @private
     */
    this.minClusterSize_ = options["minimumClusterSize"] || 2;

    /**
     * @type {?number}
     * @private
     */
    this.maxZoom_ = options["maxZoom"] || null;

    this.styles_ = options["styles"] || [];

    /**
     * @type {string}
     * @private
     */
    this.imagePath_ = options["imagePath"] || this.MARKER_CLUSTER_IMAGE_PATH_;

    /**
     * @type {string}
     * @private
     */
    this.imageExtension_ =
      options["imageExtension"] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;

    /**
     * @type {boolean}
     * @private
     */
    this.zoomOnClick_ = true;

    if (options["zoomOnClick"] != undefined) {
      this.zoomOnClick_ = options["zoomOnClick"];
    }

    /**
     * @type {boolean}
     * @private
     */
    this.averageCenter_ = false;

    if (options["averageCenter"] != undefined) {
      this.averageCenter_ = options["averageCenter"];
    }

    this.setupStyles_();

    this.setMap(map);

    /**
     * @type {number}
     * @private
     */
    this.prevZoom_ = this.map_.getZoom();

    // Add the map event listeners
    var that = this;
    google.maps.event.addListener(this.map_, "zoom_changed", function() {
      // Determines map type and prevent illegal zoom levels
      var zoom = that.map_.getZoom();
      var minZoom = that.map_.minZoom || 0;
      var maxZoom = Math.min(
        that.map_.maxZoom || 100,
        that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom
      );
      zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

      if (that.prevZoom_ != zoom) {
        that.prevZoom_ = zoom;
        that.resetViewport();
      }
    });

    google.maps.event.addListener(this.map_, "idle", function() {
      that.redraw();
    });

    // Finally, add the markers
    if (
      opt_markers &&
      (opt_markers.length || Object.keys(opt_markers).length)
    ) {
      this.addMarkers(opt_markers, false);
    }
  }

  /**
   * Extends a objects prototype by anothers.
   *
   * @param {Object} obj1 The object to be extended.
   * @param {Object} obj2 The object to extend with.
   * @return {Object} The new extended object.
   * @ignore
   */
  extend(obj1, obj2) {
    return function(object) {
      for (var property in object.prototype) {
        this.prototype[property] = object.prototype[property];
      }
      return this;
    }.apply(obj1, [obj2]);
  }

  /**
   * Implementaion of the interface method.
   * @ignore
   */
  onAdd() {
    this.setReady_(true);
  }

  /**
   * Implementaion of the interface method.
   * @ignore
   */
  draw() {}

  /**
   * Sets up the styles object.
   *
   * @private
   */
  setupStyles_() {
    if (this.styles_.length) {
      return;
    }

    for (var i = 0, size; (size = this.sizes[i]); i++) {
      this.styles_.push({
        url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
        height: size,
        width: size
      });
    }
  }

  /**
   *  Fit the map to the bounds of the markers in the clusterer.
   */
  fitMapToMarkers() {
    var markers = this.getMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, marker; (marker = markers[i]); i++) {
      bounds.extend(marker.getPosition());
    }

    this.map_.fitBounds(bounds);
  }

  /**
   * @param {number} zIndex
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
  }

  /**
   * @return {number}
   */
  getZIndex() {
    return this.zIndex_;
  }

  /**
   *  Sets the styles.
   *
   *  @param {Object} styles The style to set.
   */
  setStyles(styles) {
    this.styles_ = styles;
  }

  /**
   *  Gets the styles.
   *
   *  @return {Object} The styles object.
   */
  getStyles() {
    return this.styles_;
  }

  /**
   * Whether zoom on click is set.
   *
   * @return {boolean} True if zoomOnClick_ is set.
   */
  isZoomOnClick() {
    return this.zoomOnClick_;
  }

  /**
   * Whether average center is set.
   *
   * @return {boolean} True if averageCenter_ is set.
   */
  isAverageCenter() {
    return this.averageCenter_;
  }

  /**
   *  Returns the array of markers in the clusterer.
   *
   *  @return {Array.<google.maps.Marker>} The markers.
   */
  getMarkers() {
    return this.markers_;
  }

  /**
   *  Returns the number of markers in the clusterer
   *
   *  @return {Number} The number of markers.
   */
  getTotalMarkers() {
    return this.markers_.length;
  }

  /**
   *  Sets the max zoom for the clusterer.
   *
   *  @param {number} maxZoom The max zoom level.
   */
  setMaxZoom(maxZoom) {
    this.maxZoom_ = maxZoom;
  }

  /**
   *  Gets the max zoom for the clusterer.
   *
   *  @return {number} The max zoom level.
   */
  getMaxZoom() {
    return this.maxZoom_;
  }

  /**
   *  The function for calculating the cluster icon image.
   *
   *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
   *  @param {number} numStyles The number of styles available.
   *  @return {Object} A object properties: 'text' (string) and 'index' (number).
   *  @private
   */
  calculator_(markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
      dv = parseInt(dv / 10, 10);
      index++;
    }

    index = Math.min(index, numStyles);
    return {
      text: count,
      index: index
    };
  }

  /**
   * Set the calculator function.
   *
   * @param {function(Array, number)} calculator The function to set as the
   *     calculator. The function should return a object properties:
   *     'text' (string) and 'index' (number).
   *
   */
  setCalculator(calculator) {
    this.calculator_ = calculator;
  }

  /**
   * Get the calculator function.
   *
   * @return {function(Array, number)} the calculator function.
   */
  getCalculator() {
    return this.calculator_;
  }

  /**
   * Add an array of markers to the clusterer.
   *
   * @param {Array.<google.maps.Marker>} markers The markers to add.
   * @param {boolean=} opt_nodraw Whether to redraw the clusters.
   */
  addMarkers(markers, opt_nodraw) {
    if (markers.length) {
      for (let i = 0, marker; (marker = markers[i]); i++) {
        this.pushMarkerTo_(marker);
      }
    } else if (Object.keys(markers).length) {
      for (let marker in markers) {
        this.pushMarkerTo_(markers[marker]);
      }
    }
    if (!opt_nodraw) {
      this.redraw();
    }
  }

  /**
   * Pushes a marker to the clusterer.
   *
   * @param {google.maps.Marker} marker The marker to add.
   * @private
   */
  pushMarkerTo_(marker) {
    marker.isAdded = false;
    if (marker["draggable"]) {
      // If the marker is draggable add a listener so we update the clusters on
      // the drag end.
      var that = this;
      google.maps.event.addListener(marker, "dragend", function() {
        marker.isAdded = false;
        that.repaint();
      });
    }
    this.markers_.push(marker);
  }

  /**
   * Adds a marker to the clusterer and redraws if needed.
   *
   * @param {google.maps.Marker} marker The marker to add.
   * @param {boolean=} opt_nodraw Whether to redraw the clusters.
   */
  addMarker(marker, opt_nodraw) {
    this.pushMarkerTo_(marker);
    if (!opt_nodraw) {
      this.redraw();
    }
  }

  /**
   * Removes a marker and returns true if removed, false if not
   *
   * @param {google.maps.Marker} marker The marker to remove
   * @return {boolean} Whether the marker was removed or not
   * @private
   */
  removeMarker_(marker) {
    var index = -1;
    if (this.markers_.indexOf) {
      index = this.markers_.indexOf(marker);
    } else {
      for (var i = 0, m; (m = this.markers_[i]); i++) {
        if (m == marker) {
          index = i;
          break;
        }
      }
    }

    if (index == -1) {
      // Marker is not in our list of markers.
      return false;
    }

    marker.setMap(null);

    this.markers_.splice(index, 1);

    return true;
  }

  /**
   * Remove a marker from the cluster.
   *
   * @param {google.maps.Marker} marker The marker to remove.
   * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
   * @return {boolean} True if the marker was removed.
   */
  removeMarker(marker, opt_nodraw) {
    var removed = this.removeMarker_(marker);

    if (!opt_nodraw && removed) {
      this.resetViewport();
      this.redraw();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes an array of markers from the cluster.
   *
   * @param {Array.<google.maps.Marker>} markers The markers to remove.
   * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
   */
  removeMarkers(markers, opt_nodraw) {
    // create a local copy of markers if required
    // (removeMarker_ modifies the getMarkers() array in place)
    var markersCopy = markers === this.getMarkers() ? markers.slice() : markers;
    var removed = false;

    for (var i = 0, marker; (marker = markersCopy[i]); i++) {
      var r = this.removeMarker_(marker);
      removed = removed || r;
    }

    if (!opt_nodraw && removed) {
      this.resetViewport();
      this.redraw();
      return true;
    }
  }

  /**
   * Sets the clusterer's ready state.
   *
   * @param {boolean} ready The state.
   * @private
   */
  setReady_(ready) {
    if (!this.ready_) {
      this.ready_ = ready;
      this.createClusters_();
    }
  }

  /**
   * Returns the number of clusters in the clusterer.
   *
   * @return {number} The number of clusters.
   */
  getTotalClusters() {
    return this.clusters_.length;
  }

  /**
   * Returns the google map that the clusterer is associated with.
   *
   * @return {google.maps.Map} The map.
   */
  getMap() {
    return this.map_;
  }

  /**
   * Sets the google map that the clusterer is associated with.
   *
   * @param {google.maps.Map} map The map.
   */
  setMap(map) {
    this.map_ = map;
  }

  /**
   * Returns the size of the grid.
   *
   * @return {number} The grid size.
   */
  getGridSize() {
    return this.gridSize_;
  }

  /**
   * Sets the size of the grid.
   *
   * @param {number} size The grid size.
   */
  setGridSize(size) {
    this.gridSize_ = size;
  }

  /**
   * Returns the min cluster size.
   *
   * @return {number} The grid size.
   */
  getMinClusterSize() {
    return this.minClusterSize_;
  }

  /**
   * Sets the min cluster size.
   *
   * @param {number} size The grid size.
   */
  setMinClusterSize(size) {
    this.minClusterSize_ = size;
  }

  /**
   * Extends a bounds object by the grid size.
   *
   * @param {google.maps.LatLngBounds} bounds The bounds to extend.
   * @return {google.maps.LatLngBounds} The extended bounds.
   */
  getExtendedBounds(bounds) {
    var projection = this.getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(
      bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng()
    );
    var bl = new google.maps.LatLng(
      bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng()
    );

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
  }

  /**
   * Determins if a marker is contained in a bounds.
   *
   * @param {google.maps.Marker} marker The marker to check.
   * @param {google.maps.LatLngBounds} bounds The bounds to check against.
   * @return {boolean} True if the marker is in the bounds.
   * @private
   */
  isMarkerInBounds_(marker, bounds) {
    return bounds.contains(marker.getPosition());
  }

  /**
   * Clears all clusters and markers from the clusterer.
   */
  clearMarkers() {
    this.resetViewport(true);

    // Set the markers a empty array.
    this.markers_ = [];
  }

  /**
   * Clears all existing clusters and recreates them.
   * @param {boolean} opt_hide To also hide the marker.
   */
  resetViewport(opt_hide) {
    // Remove all the clusters
    for (let i = 0, cluster; (cluster = this.clusters_[i]); i++) {
      cluster.remove();
    }

    // Reset the markers to not be added and to be invisible.
    for (let i = 0, marker; (marker = this.markers_[i]); i++) {
      marker.isAdded = false;
      if (opt_hide) {
        marker.setMap(null);
      }
    }

    this.clusters_ = [];
  }

  /**
   *
   */
  repaint() {
    var oldClusters = this.clusters_.slice();
    this.clusters_.length = 0;
    this.resetViewport();
    this.redraw();

    // Remove the old clusters.
    // Do it in a timeout so the other clusters have been drawn first.
    setTimeout(function() {
      for (var i = 0, cluster; (cluster = oldClusters[i]); i++) {
        cluster.remove();
      }
    }, 0);
  }

  /**
   * Redraws the clusters.
   */
  redraw() {
    this.createClusters_();
  }

  /**
   * Calculates the distance between two latlng locations in km.
   * @see http://www.movable-type.co.uk/scripts/latlong.html
   *
   * @param {google.maps.LatLng} p1 The first lat lng point.
   * @param {google.maps.LatLng} p2 The second lat lng point.
   * @return {number} The distance between the two points in km.
   * @private
   */
  distanceBetweenPoints_(p1, p2) {
    if (!p1 || !p2) {
      return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = ((p2.lat() - p1.lat()) * Math.PI) / 180;
    var dLon = ((p2.lng() - p1.lng()) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat() * Math.PI) / 180) *
        Math.cos((p2.lat() * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  /**
   * Add a marker to a cluster, or creates a new cluster.
   *
   * @param {google.maps.Marker} marker The marker to add.
   * @private
   */
  addToClosestCluster_(marker) {
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    for (var i = 0, cluster; (cluster = this.clusters_[i]); i++) {
      var center = cluster.getCenter();
      if (center) {
        var d = this.distanceBetweenPoints_(center, marker.getPosition());
        if (d < distance) {
          distance = d;
          clusterToAddTo = cluster;
        }
      }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker);
    } else {
      var newCluster = new Cluster(this);
      newCluster.addMarker(marker);
      this.clusters_.push(newCluster);
    }
  }

  /**
   * Creates the clusters.
   *
   * @private
   */
  createClusters_() {
    if (!this.ready_) {
      return;
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    var mapBounds = new google.maps.LatLngBounds(
      this.map_.getBounds().getSouthWest(),
      this.map_.getBounds().getNorthEast()
    );
    var bounds = this.getExtendedBounds(mapBounds);

    for (var i = 0, marker; (marker = this.markers_[i]); i++) {
      if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
        this.addToClosestCluster_(marker);
      }
    }
  }
}

/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
class Cluster {
  constructor(markerClusterer) {
    this.markerClusterer_ = markerClusterer;
    this.map_ = markerClusterer.getMap();
    this.gridSize_ = markerClusterer.getGridSize();
    this.minClusterSize_ = markerClusterer.getMinClusterSize();
    this.averageCenter_ = markerClusterer.isAverageCenter();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(
      this,
      markerClusterer.getStyles(),
      markerClusterer.getGridSize()
    );
  }

  /**
   * Determins if a marker is already added to the cluster.
   *
   * @param {google.maps.Marker} marker The marker to check.
   * @return {boolean} True if the marker is already added.
   */
  isMarkerAlreadyAdded(marker) {
    if (this.markers_.indexOf) {
      return this.markers_.indexOf(marker) != -1;
    } else {
      for (var i = 0, m; (m = this.markers_[i]); i++) {
        if (m == marker) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Add a marker the cluster.
   *
   * @param {google.maps.Marker} marker The marker to add.
   * @return {boolean} True if the marker was added.
   */
  addMarker(marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
      return false;
    }

    if (!this.center_) {
      this.center_ = marker.getPosition();
      this.calculateBounds_();
    } else {
      if (this.averageCenter_) {
        var l = this.markers_.length + 1;
        var lat =
          (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
        var lng =
          (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
        this.center_ = new google.maps.LatLng(lat, lng);
        this.calculateBounds_();
      }
    }

    marker.isAdded = true;
    this.markers_.push(marker);

    var len = this.markers_.length;
    if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
      // Min cluster size not reached so show the marker.
      marker.setMap(this.map_);
    }

    if (len == this.minClusterSize_) {
      // Hide the markers that were showing.
      for (var i = 0; i < len; i++) {
        this.markers_[i].setMap(null);
      }
    }

    if (len >= this.minClusterSize_) {
      marker.setMap(null);
    }

    this.updateIcon();
    return true;
  }

  /**
   * Returns the marker clusterer that the cluster is associated with.
   *
   * @return {MarkerClusterer} The associated marker clusterer.
   */
  getMarkerClusterer() {
    return this.markerClusterer_;
  }

  /**
   * Returns the bounds of the cluster.
   *
   * @return {google.maps.LatLngBounds} the cluster bounds.
   */
  getBounds() {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    var markers = this.getMarkers();
    for (var i = 0, marker; (marker = markers[i]); i++) {
      bounds.extend(marker.getPosition());
    }
    return bounds;
  }

  /**
   * Removes the cluster
   */
  remove() {
    this.clusterIcon_.remove();
    this.markers_.length = 0;
    delete this.markers_;
  }

  /**
   * Returns the number of markers in the cluster.
   *
   * @return {number} The number of markers in the cluster.
   */
  getSize() {
    return this.markers_.length;
  }

  /**
   * Returns a list of the markers in the cluster.
   *
   * @return {Array.<google.maps.Marker>} The markers in the cluster.
   */
  getMarkers() {
    return this.markers_;
  }

  /**
   * Returns the center of the cluster.
   *
   * @return {google.maps.LatLng} The cluster center.
   */
  getCenter() {
    return this.center_;
  }

  /**
   * Calculated the extended bounds of the cluster with the grid.
   *
   * @private
   */
  calculateBounds_() {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
  }

  /**
   * Determines if a marker lies in the clusters bounds.
   *
   * @param {google.maps.Marker} marker The marker to check.
   * @return {boolean} True if the marker lies in the bounds.
   */
  isMarkerInClusterBounds(marker) {
    return this.bounds_.contains(marker.getPosition());
  }

  /**
   * Returns the map that the cluster is associated with.
   *
   * @return {google.maps.Map} The map.
   */
  getMap() {
    return this.map_;
  }

  /**
   * Updates the cluster icon
   */
  updateIcon() {
    var zoom = this.map_.getZoom();
    var mz = this.markerClusterer_.getMaxZoom();

    if (mz && zoom > mz) {
      // The zoom is greater than our max zoom so show all the markers in cluster.
      for (var i = 0, marker; (marker = this.markers_[i]); i++) {
        marker.setMap(this.map_);
      }
      return;
    }

    if (this.markers_.length < this.minClusterSize_) {
      // Min cluster size not yet reached.
      this.clusterIcon_.hide();
      return;
    }

    var numStyles = this.markerClusterer_.getStyles().length;
    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(sums);
    this.clusterIcon_.show();
  }
}

/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
class ClusterIcon {
  constructor(cluster, styles, opt_padding) {
    cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

    this.styles_ = styles;
    this.padding_ = opt_padding || 0;
    this.cluster_ = cluster;
    this.center_ = null;
    this.map_ = cluster.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;

    this.setMap(this.map_);
  }

  /**
   * Triggers the clusterclick event and zoom's if the option is set.
   */
  triggerClusterClick() {
    var clusterBounds = this.cluster_.getBounds();
    var markerClusterer = this.cluster_.getMarkerClusterer();

    // Trigger the clusterclick event.
    google.maps.event.trigger(
      markerClusterer.map_,
      "clusterclick",
      this.cluster_
    );

    if (markerClusterer.isZoomOnClick()) {
      // Zoom into the cluster.
      this.map_.fitBounds(clusterBounds);
      this.map_.setCenter(clusterBounds.getCenter());
    }
  }

  /**
   * Adding the cluster icon to the dom.
   * @ignore
   */
  onAdd() {
    this.div_ = document.createElement("DIV");
    if (this.visible_) {
      var pos = this.getPosFromLatLng_(this.center_);
      this.div_.style.cssText = this.createCss(pos);
      this.div_.innerHTML = this.sums_.text;
    }

    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);

    var that = this;
    google.maps.event.addDomListener(this.div_, "click", function() {
      that.triggerClusterClick();
    });
  }

  /**
   * Returns the position to place the div dending on the latlng.
   *
   * @param {google.maps.LatLng} latlng The position in latlng.
   * @return {google.maps.Point} The position in pixels.
   * @private
   */
  getPosFromLatLng_(latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
    return pos;
  }

  /**
   * Draw the icon.
   * @ignore
   */
  draw() {
    if (this.visible_) {
      var pos = this.getPosFromLatLng_(this.center_);
      this.div_.style.top = pos.y + "px";
      this.div_.style.left = pos.x + "px";
    }
  }

  /**
   * Hide the icon.
   */
  hide() {
    if (this.div_) {
      this.div_.style.display = "none";
    }
    this.visible_ = false;
  }

  /**
   * Position and show the icon.
   */
  show() {
    if (this.div_) {
      var pos = this.getPosFromLatLng_(this.center_);
      this.div_.style.cssText = this.createCss(pos);
      this.div_.style.display = "";
    }
    this.visible_ = true;
  }

  /**
   * Remove the icon from the map
   */
  remove() {
    this.setMap(null);
  }

  /**
   * Implementation of the onRemove interface.
   * @ignore
   */
  onRemove() {
    if (this.div_ && this.div_.parentNode) {
      this.hide();
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  }

  /**
   * Set the sums of the icon.
   *
   * @param {Object} sums The sums containing:
   *   'text': (string) The text to display in the icon.
   *   'index': (number) The style index of the icon.
   */
  setSums(sums) {
    this.sums_ = sums;
    this.text_ = sums.text;
    this.index_ = sums.index;
    if (this.div_) {
      this.div_.innerHTML = sums.text;
    }

    this.useStyle();
  }

  /**
   * Sets the icon to the the styles.
   */
  useStyle() {
    var index = Math.max(0, this.sums_.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    var style = this.styles_[index];
    this.url_ = style["url"];
    this.height_ = style["height"];
    this.width_ = style["width"];
    this.textColor_ = style["textColor"];
    this.anchor_ = style["anchor"];
    this.textSize_ = style["textSize"];
    this.backgroundPosition_ = style["backgroundPosition"];
  }

  /**
   * Sets the center of the icon.
   *
   * @param {google.maps.LatLng} center The latlng to set as the center.
   */
  setCenter(center) {
    this.center_ = center;
  }

  /**
   * Create the css text based on the position of the icon.
   *
   * @param {google.maps.Point} pos The position.
   * @return {string} The css style text.
   */
  createCss(pos) {
    var style = [];
    style.push("z-index:" + this.cluster_.markerClusterer_.getZIndex() + ";");
    style.push("background-image:url(" + this.url_ + ");");
    var backgroundPosition = this.backgroundPosition_
      ? this.backgroundPosition_
      : "0 0";
    style.push("background-position:" + backgroundPosition + ";");

    if (typeof this.anchor_ === "object") {
      if (
        typeof this.anchor_[0] === "number" &&
        this.anchor_[0] > 0 &&
        this.anchor_[0] < this.height_
      ) {
        style.push(
          "height:" +
            (this.height_ - this.anchor_[0]) +
            "px; padding-top:" +
            this.anchor_[0] +
            "px;"
        );
      } else {
        style.push(
          "height:" + this.height_ + "px; line-height:" + this.height_ + "px;"
        );
      }
      if (
        typeof this.anchor_[1] === "number" &&
        this.anchor_[1] > 0 &&
        this.anchor_[1] < this.width_
      ) {
        style.push(
          "width:" +
            (this.width_ - this.anchor_[1]) +
            "px; padding-left:" +
            this.anchor_[1] +
            "px;"
        );
      } else {
        style.push("width:" + this.width_ + "px; text-align:center;");
      }
    } else {
      style.push(
        "height:" +
          this.height_ +
          "px; line-height:" +
          this.height_ +
          "px; width:" +
          this.width_ +
          "px; text-align:center;"
      );
    }

    var txtColor = this.textColor_ ? this.textColor_ : "black";
    var txtSize = this.textSize_ ? this.textSize_ : 11;

    style.push(
      "cursor:pointer; top:" +
        pos.y +
        "px; left:" +
        pos.x +
        "px; color:" +
        txtColor +
        "; position:absolute; font-size:" +
        txtSize +
        "px; font-family:Arial,sans-serif; font-weight:bold"
    );
    return style.join("");
  }
}

export default MarkerClusterer;
