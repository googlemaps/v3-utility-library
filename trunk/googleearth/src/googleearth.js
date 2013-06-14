/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
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
 * @fileoverview Earth API library for Maps v3.
 * usage:  var ge = new GoogleEarth(map);.
 * @author jlivni@google.com (Josh Livni).
 */

/**
 * @constructor
 * @param {google.maps.Map} map the Map associated with this Earth instance.
 */
function GoogleEarth(map) {
  if (!google || !google.earth) {
    throw 'google.earth not loaded';
  }

  if (!google.earth.isSupported()) {
    throw 'Google Earth API is not supported on this system';
  }

  if (!google.earth.isInstalled()) {
    throw 'Google Earth API is not installed on this system';
  }

  /**
   * @const
   * @private
   * @type {string} */
  this.RED_ICON_ = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';

  /**
   * @private
   * @type {google.maps.Map} */
  this.map_ = map;

  /**
   * @private
   * @type {Node} */
  this.mapDiv_ = map.getDiv();

  /**
   * @private
   * @type {boolean} */
  this.earthVisible_ = false;

  /**
   * @private
   * @type {string} */
  this.earthTitle_ = 'Earth';

  /**
   * @private
   * @type {Object} */
  this.moveEvents_ = [];

  /**
   * @private
   * @type {Object} */
  this.overlays_ = {};

  /**
   * @private
   * @type {?Object} */
  this.lastClickedPlacemark_ = null;

  /**
   * Keep track of each time the 3D view is reloaded/refreshed
   * @private
   * @type {number} */
  this.displayCounter_ = 0;

  this.addEarthMapType_();
  this.addEarthControl_();
}
window['GoogleEarth'] = GoogleEarth;

/**
 * @const
 * @type {string} */
GoogleEarth.MAP_TYPE_ID = 'GoogleEarthAPI';
GoogleEarth['MAP_TYPE_ID'] = GoogleEarth.MAP_TYPE_ID;

/**
 * @const
 * @private
 * @type {string}
 */
GoogleEarth.INFO_WINDOW_OPENED_EVENT_ = 'GEInfoWindowOpened';

/**
 * @const
 * @private
 * @type {number}
 */
GoogleEarth.MAX_EARTH_ZOOM_ = 27;

/**
 * @return {?google.earth.GEPlugin} The Earth API Instance.
 */
GoogleEarth.prototype.getInstance = function() {
  return this.instance_;
};
GoogleEarth.prototype['getInstance'] = GoogleEarth.prototype.getInstance;

/**
 * @private
 */
GoogleEarth.prototype.addEarthMapType_ = function() {
  var map = this.map_;

  var earthMapType = /** @type {google.maps.MapType} */({
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 19,
    name: this.earthTitle_,
    // The alt helps the findMapTypeControlDiv work.
    alt: this.earthTitle_,
    getTile:
      /**
       * @param {google.maps.Point} tileCoord the tile coordinate.
       * @param {number} zoom the zoom level.
       * @param {Node} ownerDocument n/a.
       * @return {Node} the overlay.
       */
      function(tileCoord, zoom, ownerDocument) {
        var div = ownerDocument.createElement('DIV');
        return div;
      }
  });

  map.mapTypes.set(GoogleEarth.MAP_TYPE_ID, earthMapType);

  var options = /** @type {google.maps.MapTypeControlOptions} */({
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                   google.maps.MapTypeId.SATELLITE,
                   GoogleEarth.MAP_TYPE_ID]
    }
  });

  map.setOptions(options);

  var that = this;
  google.maps.event.addListener(map, 'maptypeid_changed', function() {
    that.mapTypeChanged_();
  });
};

/**
 * @private
 */
GoogleEarth.prototype.mapTypeChanged_ = function() {
  if (this.map_.getMapTypeId() == GoogleEarth.MAP_TYPE_ID) {
    this.showEarth_();
  } else {
    this.switchToMapView_();
  }
};

/**
 * @private
 */
GoogleEarth.prototype.showEarth_ = function() {
  var mapTypeControlDiv = this.findMapTypeControlDiv_();
  this.setZIndexes_(mapTypeControlDiv);
  this.addShim_(mapTypeControlDiv);

  this.controlDiv_.style.display = '';

  this.earthVisible_ = true;
  if (!this.instance_) {
    this.initializeEarth_();
    return;
  }
  this.refresh_();
};

/**
 * @private
 */
GoogleEarth.prototype.refresh_ = function() {
  this.overlays_ = {};
  this.flyToMapView_(true);
  this.clearPlacemarks_();
  this.displayCounter_++;
  this.clearMoveEvents_();
  this.addMapOverlays_();
};

/**
 * Clear all marker position_changed events
 * @private
 */
GoogleEarth.prototype.clearMoveEvents_ = function() {
  for (var i = 0, evnt; evnt = this.moveEvents_[i]; i++) {
    google.maps.event.removeListener(evnt);
  }
};

/**
 * Clear all features on this instance.
 * @private
 */
GoogleEarth.prototype.clearPlacemarks_ = function() {
  var features = this.instance_.getFeatures();
  while (features.getFirstChild()) {
    features.removeChild(features.getFirstChild());
  }
};

/**
 * Fly to the current map zoom, add slight tilt.
 * @private
 * @param {boolean} tilt whether to teleport and tilt, or just flyto.
 */
GoogleEarth.prototype.flyToMapView_ = function(tilt) {
  var center = this.map_.getCenter();
  var lookAt = this.instance_.createLookAt('');
  var range = Math.pow(2, GoogleEarth.MAX_EARTH_ZOOM_ - this.map_.getZoom());
  lookAt.setRange(range);
  lookAt.setLatitude(center.lat());
  lookAt.setLongitude(center.lng());
  lookAt.setHeading(0);
  lookAt.setAltitude(0);
  var ge = this.instance_;
  if (tilt) {
    // Teleport to the pre-tilt view immediately.
    ge.getOptions().setFlyToSpeed(5);
    ge.getView().setAbstractView(lookAt);
    lookAt.setTilt(15);
    // Fly to the tilt at regular speed in 200ms
    ge.getOptions().setFlyToSpeed(0.75);
    window.setTimeout(function() {
      ge.getView().setAbstractView(lookAt);
    }, 200);
    // Set the flyto speed back to default after the animation starts.
    window.setTimeout(function() {
      ge.getOptions().setFlyToSpeed(1);
    }, 250);
  } else {
    // Fly to the approximate map view at regular speed.
    ge.getView().setAbstractView(lookAt);
  }
};

/**
 *  @param {string|*} hex color value in rgb.
 *  @param {string|*=} opacity -- in percentage.
 *  @return {string} abgr KML style color.
 *  @private
 */
GoogleEarth.getKMLColor_ = function(hex, opacity) {
  if (hex[0] == '#') {
    hex = hex.substring(1, 9);
  }
  if (typeof opacity == 'undefined') {
    opacity = 'FF';
  } else {
    opacity = parseInt(parseFloat(opacity) * 255, 10).toString(16);
    if (opacity.length == 1) {
      opacity = '0' + opacity;
    }
  }
  var R = hex.substring(0, 2);
  var G = hex.substring(2, 4);
  var B = hex.substring(4, 6);
  var abgr = [opacity, B, G, R].join('');
  return abgr;
};


/**
 * @param {google.maps.MVCObject} overlay the map overlay.
 * @return {String} ID for the Placemark.
 * @private
 */
GoogleEarth.prototype.generatePlacemarkId_ = function(overlay) {
  var placemarkId = this.displayCounter_ + 'GEV3_' + overlay['__gme_id'];
  return placemarkId;
};

/**
 * @param {google.maps.MVCObject} overlay the map overlay.
 * @return {google.earth.KmlPlacemark} placemark the placemark.
 * @private
 */
GoogleEarth.prototype.createPlacemark_ = function(overlay) {
  var placemarkId = this.generatePlacemarkId_(overlay);
  this.overlays_[placemarkId] = overlay;
  return this.instance_.createPlacemark(placemarkId);
};

/**
 * @param {google.maps.Rectangle} rectangle the rectangle overlay.
 * @private
 */
GoogleEarth.prototype.createRectangle_ = function(rectangle) {
  var ge = this.instance_;
  var bounds = rectangle.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  var placemark = this.createPlacemark_(rectangle);

  placemark.setGeometry(ge.createPolygon(''));
  var ring = ge.createLinearRing('');

  //set the style
  var style = this.createStyle_(rectangle);
  placemark.setStyleSelector(style);

  //create the rectangle
  var coords = ring.getCoordinates();
  coords.pushLatLngAlt(ne.lat(), ne.lng(), 0);
  coords.pushLatLngAlt(ne.lat(), sw.lng(), 0);
  coords.pushLatLngAlt(sw.lat(), sw.lng(), 0);
  coords.pushLatLngAlt(sw.lat(), ne.lng(), 0);
  coords.pushLatLngAlt(ne.lat(), ne.lng(), 0);

  placemark.getGeometry().setOuterBoundary(ring);
  placemark.setName('placemark');
  ge.getFeatures().appendChild(placemark);
};

/**
 * @param {google.maps.GroundOverlay} groundOverlay the GroundOverlay.
 * @private
 */
GoogleEarth.prototype.addGroundOverlay_ = function(groundOverlay) {
  var bounds = groundOverlay.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  var ge = this.instance_;
  var overlay = ge.createGroundOverlay('');

  overlay.setLatLonBox(ge.createLatLonBox(''));
  var latLonBox = overlay.getLatLonBox();
  latLonBox.setBox(ne.lat(), sw.lat(), ne.lng(), sw.lng(), 0);

  overlay.setIcon(ge.createIcon(''));
  overlay.getIcon().setHref(groundOverlay.getUrl());

  ge.getFeatures().appendChild(overlay);
};

/**
 * @param {string} url for kml.
 * @private
 */
GoogleEarth.prototype.addKML_ = function(url) {
  var ge = this.instance_;
  google.earth.fetchKml(ge, url, function(kml) {
    if (!kml) {
      // wrap alerts in API callbacks and event handlers
      // in a window.setTimeout to prevent deadlock in some browsers
      window.setTimeout(function() {
        alert('Bad or null KML.');
      }, 0);
      return;
    }
    ge.getFeatures().appendChild(kml);
 });
};

/**
 * @param {String} placemarkId the id of the placemark.
 * @private
 */
GoogleEarth.prototype.updatePlacemark_ = function(placemarkId) {
  //TODO(jlivni) generalize to work with more than just Markers/Points
  var marker = this.overlays_[placemarkId];
  var placemark = this.instance_.getElementById(placemarkId);
  var geom = placemark.getGeometry();
  var position = marker.getPosition();
  geom.setLatitude(position.lat());
  geom.setLongitude(position.lng());
};

/**
 * @param {google.maps.Marker} marker The map marker.
 * @private
 */
GoogleEarth.prototype.createPoint_ = function(marker) {
  if (!marker.getPosition()) {
    return;
  }
  var ge = this.instance_;
  var placemark = this.createPlacemark_(marker);
  if (marker.getTitle()) {
    placemark.setName(marker.getTitle());
  }

  // Create style map for placemark
  var icon = ge.createIcon('');
  if (marker.getIcon()) {
    //TODO(jlivni) fix for if it's a markerImage
    icon.setHref(marker.getIcon());
  } else {
    icon.setHref(this.RED_ICON_);
  }

  var style = ge.createStyle('');
  style.getIconStyle().setIcon(icon);
  placemark.setStyleSelector(style);

  // Create point
  var point = ge.createPoint('');
  point.setLatitude(marker.getPosition().lat());
  point.setLongitude(marker.getPosition().lng());
  placemark.setGeometry(point);

  ge.getFeatures().appendChild(placemark);

  //add listener for marker move on Map
  var that = this;
  var moveEvent = google.maps.event.addListener(marker,
    'position_changed',
    function() {
      var placemarkId = that.generatePlacemarkId_(marker);
      that.updatePlacemark_(placemarkId);
    });
  this.moveEvents_.push(moveEvent);
};

/**
 * @param {google.maps.Polygon} polygon the polygon overlay.
 * @private
 */
GoogleEarth.prototype.createPolygon_ = function(polygon) {
  var ge = this.instance_;
  var placemark = this.createPlacemark_(polygon);

  // Create polygon
  var poly = ge.createPolygon('');
  placemark.setGeometry(poly);

  //set the style
  var style = this.createStyle_(polygon);
  placemark.setStyleSelector(style);


  //assume single linearRing
  var outer = ge.createLinearRing('');
  poly.setOuterBoundary(outer);
  var coords = outer.getCoordinates();
  var path = polygon.getPath().getArray();

  //TODO(jlivni) use getPaths and multiple rings
  for (var i = 0, latLng; latLng = path[i]; i++) {
    coords.pushLatLngAlt(latLng.lat(), latLng.lng(), 0);
  }

  ge.getFeatures().appendChild(placemark);
};

/**
 * Computes the LatLng produced by starting from a given LatLng and heading a
 * given distance.
 * @see http://williams.best.vwh.net/avform.htm#LL
 * @param {google.maps.LatLng} from The LatLng from which to start.
 * @param {number} distance The distance to travel.
 * @param {number} heading The heading in degrees clockwise from north.
 * @return {google.maps.LatLng} The result.
 * @private
 */
GoogleEarth.computeOffset_ = function(from, distance, heading) {
  var radius = 6378137;
  distance /= radius;
  heading = heading * (Math.PI / 180); //convert to radians
  var fromLat = from.lat() * (Math.PI / 180);
  var fromLng = from.lng() * (Math.PI / 180);
  var cosDistance = Math.cos(distance);
  var sinDistance = Math.sin(distance);
  var sinFromLat = Math.sin(fromLat);
  var cosFromLat = Math.cos(fromLat);
  var sinLat = cosDistance * sinFromLat +
      sinDistance * cosFromLat * Math.cos(heading);
  var dLng = Math.atan2(
      sinDistance * cosFromLat * Math.sin(heading),
      cosDistance - sinFromLat * sinLat);
  return new google.maps.LatLng((Math.asin(sinLat) / (Math.PI / 180)),
                                (fromLng + dLng) / (Math.PI / 180));
};

/**
 * @param {google.maps.Circle} circle The circle overlay.
 * @private
 */
GoogleEarth.prototype.createCircle_ = function(circle) {
  var ge = this.instance_;
  var center = circle.getCenter();
  var radius = circle.getRadius();
  var placemark = this.createPlacemark_(circle);
  placemark.setGeometry(ge.createPolygon(''));
  var ring = ge.createLinearRing('');

  //set the style
  var style = this.createStyle_(circle);
  placemark.setStyleSelector(style);

  //create a circle
  var vertices = 25;
  for (var i = 0; i < vertices; i++) {
    var heading = 360 / vertices * i;
    var offset = GoogleEarth.computeOffset_(center, radius, heading);
    ring.getCoordinates().pushLatLngAlt(offset.lat(), offset.lng(), 0);
  }
  placemark.getGeometry().setOuterBoundary(ring);
  placemark.setName('placemark');
  ge.getFeatures().appendChild(placemark);
};

/**
 * @param {google.maps.Polyline} polyline The map polyline overlay.
 * @private
 */
GoogleEarth.prototype.createPolyline_ = function(polyline) {
  var ge = this.instance_;
  var placemark = this.createPlacemark_(polyline);

  // Create linestring
  var lineString = ge.createLineString('');
  lineString.setTessellate(true);
  placemark.setGeometry(lineString);

  //set the style
  var style = this.createStyle_(polyline);
  placemark.setStyleSelector(style);

  var coords = lineString.getCoordinates();
  var path = polyline.getPath().getArray();
  //TODO(jlivni) use getPaths for case of multiple rings
  for (var i = 0, latLng; latLng = path[i]; i++) {
    coords.pushLatLngAlt(latLng.lat(), latLng.lng(), 0);
  }

  ge.getFeatures().appendChild(placemark);
};

/**
 * @param {google.maps.MVCObject} overlay the map overlay.
 * @return {google.earth.KmlStyle} the style.
 * @private
 */
GoogleEarth.prototype.createStyle_ = function(overlay) {
  var style = this.instance_.createStyle('');
  var polyStyle = style.getPolyStyle();
  var lineStyle = style.getLineStyle();

  lineStyle.setWidth(this.getMVCVal_(overlay, 'strokeWeight', 3));

  var strokeOpacity = this.getMVCVal_(overlay, 'strokeOpacity', 1);
  var fillOpacity = this.getMVCVal_(overlay, 'fillOpacity', 0.3);
  var strokeColor = this.getMVCVal_(overlay, 'strokeColor', '#000000');
  var fillColor = this.getMVCVal_(overlay, 'fillColor', '#000000');

  lineStyle.getColor().set(GoogleEarth.getKMLColor_(strokeColor,
                                                   strokeOpacity));
  polyStyle.getColor().set(GoogleEarth.getKMLColor_(fillColor, fillOpacity));

  return style;
};

/**
 * Gets the property value from an mvc object.
 * @param {google.maps.MVCObject} mvcObject The object.
 * @param {string} property The property.
 * @param {string|number} def The default.
 * @return {string|number} The property, or default if property undefined.
 * @private
 */
GoogleEarth.prototype.getMVCVal_ = function(mvcObject, property, def) {
  var val = mvcObject.get(property);
  if (typeof val == 'undefined') {
    return def;
  } else {
    return /** @type {string|number} */(val);
  }
};

/**
 * Add  map overlays to Earth.
 * @private
 */
GoogleEarth.prototype.addMapOverlays_ = function() {
  var overlays = this.getOverlays_();
  for (var i = 0, marker; marker = overlays['Marker'][i]; i++) {
    this.createPoint_(marker);
  }
  for (var i = 0, polygon; polygon = overlays['Polygon'][i]; i++) {
    this.createPolygon_(polygon);
  }
  for (var i = 0, polyline; polyline = overlays['Polyline'][i]; i++) {
    this.createPolyline_(polyline);
  }
  for (var i = 0, rectangle; rectangle = overlays['Rectangle'][i]; i++) {
    this.createRectangle_(rectangle);
  }
  for (var i = 0, circle; circle = overlays['Circle'][i]; i++) {
    this.createCircle_(circle);
  }
  for (var i = 0, kml; kml = overlays['KmlLayer'][i]; i++) {
    this.addKML_(kml.getUrl());
  }
  for (var i = 0, overlay; overlay = overlays['GroundOverlay'][i]; i++) {
    this.addGroundOverlay_(overlay);
  }
};

/**
 * @private
 */
GoogleEarth.prototype.initializeEarth_ = function() {
  var that = this;
  google.earth.createInstance(this.earthDiv_, function(instance) {
    that.instance_ = /** @type {google.earth.GEPlugin} */(instance);
    that.addEarthEvents_();
    that.refresh_();
  }, function(e) {
    that.hideEarth_();
    //TODO(jlivni) record previous maptype
    that.map_.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    throw 'Google Earth API failed to initialize: ' + e;
  });
};

/**
 * @private
 */
GoogleEarth.prototype.addEarthEvents_ = function() {
  var ge = this.instance_;
  ge.getWindow().setVisibility(true);

  // add a navigation control
  var navControl = ge.getNavigationControl();
  navControl.setVisibility(ge.VISIBILITY_AUTO);

  var screen = navControl.getScreenXY();
  screen.setYUnits(ge.UNITS_INSET_PIXELS);
  screen.setXUnits(ge.UNITS_PIXELS);

  // add some layers
  var layerRoot = ge.getLayerRoot();
  layerRoot.enableLayerById(ge.LAYER_BORDERS, true);
  layerRoot.enableLayerById(ge.LAYER_ROADS, true);

  var that = this;
  google.maps.event.addListener(this.map_,
                                GoogleEarth.INFO_WINDOW_OPENED_EVENT_,
                                function(infowindow) {
    //If Earth is open, create balloon
    if (!that.earthVisible_) {
      return;
    }
    var balloon = that.instance_.createHtmlStringBalloon('');
    //TODO assuming anchor == marker == lastclicked
    var placemark = that.lastClickedPlacemark_;
    balloon.setFeature(placemark);
    balloon.setContentString(infowindow.getContent());
    that.instance_.setBalloon(balloon);
  });

   // On click of a placemark we want to trigger the map click event.
  google.earth.addEventListener(ge.getGlobe(), 'click', function(event) {
    var target = event.getTarget();
    var overlay = that.overlays_[target.getId()];
    if (overlay) {
      event.preventDefault();
      // Close any currently opened map info windows.
      var infoWindows = that.getOverlaysForType_('InfoWindow');
      for (var i = 0, infoWindow; infoWindow = infoWindows[i]; i++) {
        infoWindow.close();
      }
      that.lastClickedPlacemark_ = target;
      google.maps.event.trigger(overlay, 'click');
    }
  });

};

/**
 * Set the Map view to match Earth.
 * @private
 */
GoogleEarth.prototype.matchMapToEarth_ = function() {
  var lookAt = this.instance_.getView().copyAsLookAt(
      this.instance_.ALTITUDE_RELATIVE_TO_GROUND);
  var range = lookAt.getRange();
  var zoom = Math.round(
      GoogleEarth.MAX_EARTH_ZOOM_ - (Math.log(range) / Math.log(2)));
  if (!this.map_.getZoom() == zoom) {
    this.map_.setZoom(zoom - 1);
  } else {
    this.map_.setZoom(zoom);
  }
  var center = new google.maps.LatLng(lookAt.getLatitude(),
                                      lookAt.getLongitude());
  this.map_.panTo(center);
};

/**
 * Animate from Earth to Maps view.
 * @private
 */
GoogleEarth.prototype.switchToMapView_ = function() {
  if (!this.earthVisible_) {
    return;
  }

  // First, set map to match current earth view.
  this.matchMapToEarth_();

  // Now fly Earth to match the map view.
  var that = this;

  window.setTimeout(function() {
    // Sometimes it takes a few ms before the map zoom is ready.
    that.flyToMapView_();
  }, 50);

  window.setTimeout(function() {
    // And switch back to maps once we've flown.
    that.hideEarth_();
  }, 2200);
};

/**
 * Hide the Earth div.
 * @private
 */
GoogleEarth.prototype.hideEarth_ = function() {
  this.unsetZIndexes_();
  this.removeShim_();

  this.controlDiv_.style.display = 'none';
  this.earthVisible_ = false;
};

/**
 * Sets the z-index of all controls except for the map type control so that
 * they appear behind Earth.
 * @param {Node} mapTypeControlDiv the control div.
 * @private
 */
GoogleEarth.prototype.setZIndexes_ = function(mapTypeControlDiv) {
  var oldIndex = mapTypeControlDiv.style.zIndex;
  var siblings = this.controlDiv_.parentNode.childNodes;
  for (var i = 0, sibling; sibling = siblings[i]; i++) {
    sibling['__gme_ozi'] = sibling.style.zIndex;
    // Sets the zIndex of all controls to be behind Earth.
    sibling.style.zIndex = -1;
  }

  mapTypeControlDiv['__gme_ozi'] = oldIndex;
  this.controlDiv_.style.zIndex = mapTypeControlDiv.style.zIndex = 0;
};

/**
 * @private
 */
GoogleEarth.prototype.unsetZIndexes_ = function() {
  var siblings = this.controlDiv_.parentNode.childNodes;
  for (var i = 0, sibling; sibling = siblings[i]; i++) {
    // Set the old zIndex back
    sibling.style.zIndex = sibling['__gme_ozi'];
  }
};

/**
 * @param {Node} mapTypeControlDiv the control div.
 * @private
 */
GoogleEarth.prototype.addShim_ = function(mapTypeControlDiv) {
  var iframeShim = this.iframeShim_ = document.createElement('IFRAME');
  iframeShim.src = 'javascript:false;';
  iframeShim.scrolling = 'no';
  iframeShim.frameBorder = '0';

  var style = iframeShim.style;
  style.zIndex = -100000;
  style.width = style.height = '100%';
  style.position = 'absolute';
  style.left = style.top = 0;

  // Appends the iframe to the map type control's DIV so that its width and
  // height will be 100% and if the control changes from a bar to a drop down,
  // it flows nicely.
  mapTypeControlDiv.appendChild(iframeShim);
};

/**
 * Remove the shim containing the earth div.
 * @private
 */
GoogleEarth.prototype.removeShim_ = function() {
  this.iframeShim_.parentNode.removeChild(this.iframeShim_);
  this.iframeShim_ = null;
};

/**
 * @private
 * @return {Node} the map type control div.
 */
GoogleEarth.prototype.findMapTypeControlDiv_ = function() {
  var title = 'title=[\'\"]?' + this.earthTitle_ + '[\"\']?';
  var regex = new RegExp(title);
  var siblings = this.controlDiv_.parentNode.childNodes;
  for (var i = 0, sibling; sibling = siblings[i]; i++) {
    if (regex.test(sibling.innerHTML)) {
      return sibling;
    }
  }
};

/**
 * @private
 */
GoogleEarth.prototype.addEarthControl_ = function() {
  var mapDiv = this.mapDiv_;

  var control = this.controlDiv_ = document.createElement('DIV');
  control.style.position = 'absolute';
  control.style.width = 0;
  control.style.height = 0;
  control.index = 0;
  control.style.display = 'none';

  var inner = this.innerDiv_ = document.createElement('DIV');
  inner.style.width = mapDiv.clientWidth + 'px';
  inner.style.height = mapDiv.clientHeight + 'px';
  inner.style.position = 'absolute';

  control.appendChild(inner);

  var earthDiv = this.earthDiv_ = document.createElement('DIV');
  earthDiv.style.position = 'absolute';
  earthDiv.style.width = '100%';
  earthDiv.style.height = '100%';

  inner.appendChild(earthDiv);

  this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(control);

  var that = this;

  google.maps.event.addListener(this.map_, 'resize', function() {
    that.resizeEarth_();
  });
};

/**
 * @private
 */
GoogleEarth.prototype.resizeEarth_ = function() {
  var innerStyle = this.innerDiv_.style;
  var mapDiv = this.mapDiv_;
  innerStyle.width = mapDiv.clientWidth + 'px';
  innerStyle.height = mapDiv.clientHeight + 'px';
};

/**
 * @param {string} type type of overlay (Polygon, etc).
 * @return {Array.<Object>} list of overlays of given type currently on map.
 * @private
 */
GoogleEarth.prototype.getOverlaysForType_ = function(type) {
  var tmp = [];
  var overlays = GoogleEarth.overlays_[type];
  for (var i in overlays) {
    if (overlays.hasOwnProperty(i)) {
      var overlay = overlays[i];
      if (overlay.get('map') == this.map_) {
        tmp.push(overlay);
      }
    }
  }
  return tmp;
};

/**
 * @return {Object} dictionary of lists for all map overlays.
 * @private
 */
GoogleEarth.prototype.getOverlays_ = function() {
  var overlays = {};
  var overlayClasses = GoogleEarth.OVERLAY_CLASSES;

  for (var i = 0, overlayClass; overlayClass = overlayClasses[i]; i++) {
    overlays[overlayClass] = this.getOverlaysForType_(overlayClass);
  }
  return overlays;
};

/**
 * @private
 */
GoogleEarth.overlays_ = {};

/**
 * override the open property for infowindow
 * @private
 */
GoogleEarth.modifyOpen_ = function() {
  google.maps.InfoWindow.prototype.openOriginal_ =
      google.maps.InfoWindow.prototype['open'];

  GoogleEarth.overlays_['InfoWindow'] = {};
  google.maps.InfoWindow.prototype['open'] = function(map, anchor) {
    if (map) {
      if (!this['__gme_id']) {
        this['__gme_id'] = GoogleEarth.counter_++;
        GoogleEarth.overlays_['InfoWindow'][this['__gme_id']] = this;
      }
    } else {
      delete GoogleEarth.overlays_['InfoWindow'][this['__gme_id']];
      this['__gme_id'] = undefined;
    }
    google.maps.event.trigger(map, GoogleEarth.INFO_WINDOW_OPENED_EVENT_, this);
    this.openOriginal_(map, anchor);
  };
};

/**
 * @param {string} overlayClass overlay type, such as Marker, Polygon, etc.
 * @private
 */
GoogleEarth.modifySetMap_ = function(overlayClass) {
  var proto = google.maps[overlayClass].prototype;
  proto['__gme_setMapOriginal'] = proto.setMap;

  GoogleEarth.overlays_[overlayClass] = {};
  google.maps[overlayClass].prototype['setMap'] = function(map) {
    if (map) {
      if (!this['__gme_id']) {
        this['__gme_id'] = GoogleEarth.counter_++;
        GoogleEarth.overlays_[overlayClass][this['__gme_id']] = this;
      }
    } else {
      delete GoogleEarth.overlays_[overlayClass][this['__gme_id']];
      this['__gme_id'] = undefined;
    }

    this['__gme_setMapOriginal'](map);
  };
};

/**
 * @const
 * @type {Array.<string>}
 */
GoogleEarth.OVERLAY_CLASSES = ['Marker', 'Polyline', 'Polygon', 'Rectangle',
    'Circle', 'KmlLayer', 'GroundOverlay', 'InfoWindow'];

/**
 * Keep track of total number of placemarks added.
 * @type {number}
 * @private
 */
GoogleEarth.counter_ = 0;

/**
 * Wrapper to call appropriate prototype override methods for all overlays
 * @private
 */
GoogleEarth.trackOverlays_ = function() {
  var overlayClasses = GoogleEarth.OVERLAY_CLASSES;

  for (var i = 0, overlayClass; overlayClass = overlayClasses[i]; i++) {
    GoogleEarth.modifySetMap_(overlayClass);
    if (overlayClass == 'InfoWindow') {
      GoogleEarth.modifyOpen_();
    }
  }
};

GoogleEarth.trackOverlays_();
