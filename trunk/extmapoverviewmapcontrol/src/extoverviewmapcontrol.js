/**
 * @name ExtOverviewMapControl for V3
 * @version 0.1
 * @author: Randy Becker
 * @fileoverview This library adds an overview map to a Google map.
 */
/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//TODO: Add corner arrow toggler
//TODO: Make transparant rectangle draggable
//TODO: Programatically construct and style overview div
//TODO: Encapsulate into an object, rather than window.onload
//TODO: Add docstrings
//TODO: Fix bugs near equator, prime meridian, poles
//TODO: Clean up everything

/*global google*/
window.onload = function () {
  // Initialize two maps: one full size and one in a small div in the corner
  // of the large map.
  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    "noClear": true
  });
  var overlayMap = new google.maps.Map(
    document.getElementById('overlayMap'),
    {
      mapTypeId: google.maps.MapTypeId.ROADMAP, // Always show roadmap
      disableDefaultUI: true, // Turn off the controls
      scrollwheel: false, // Disable scrollwheel zooming
      disableDoubleClickZoom: true
    }
  );

  var translucentBox = new google.maps.Polygon({
    strokeColor: "#4444BB",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#4444BB",
    fillOpacity: 0.25
  });
  translucentBox.setMap(overlayMap);

  var transparentBox = new google.maps.Polygon({
    strokeColor: "#4444BB",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#4444BB",
    fillOpacity: 0.01
  });
  transparentBox.setMap(overlayMap);

  function pathFromBounds(bounds) {
    var northEastCorner = bounds.getNorthEast();
    var southWestCorner = bounds.getSouthWest();
    var northEastLat = northEastCorner.lat();
    var northEastLng = northEastCorner.lng();
    var southWestLat = southWestCorner.lat();
    var southWestLng = southWestCorner.lng();
    var southEastCorner = new google.maps.LatLng(southWestLat, northEastLng);
    var northWestCorner = new google.maps.LatLng(northEastLat, southWestLng);

    return [
      northEastCorner,
      southEastCorner,
      southWestCorner,
      northWestCorner,
      northEastCorner
    ];
  }

  function updateOverlayMapCenter() {
    var newCenter = map.getCenter();
    if (overlayMap.getCenter() !== newCenter) {
      overlayMap.panTo(newCenter);
    }
  }

  google.maps.event.addListener(map, 'bounds_changed', function () {
    var newBounds = map.getBounds();
    var path = [];
    if (newBounds !== undefined) {
      var mapWidth = null;
      var mapHeight = null;
      (function () {
        var northEastCorner = newBounds.getNorthEast();
        var southWestCorner = newBounds.getSouthWest();
        var northEastLat = northEastCorner.lat();
        var northEastLng = northEastCorner.lng();
        var southWestLat = southWestCorner.lat();
        var southWestLng = southWestCorner.lng();

        mapHeight = Math.abs(180 + northEastLat - southWestLat) - 180;
        mapWidth = Math.abs(360 + northEastLng - southWestLng) - 360;
      })();

      var overlayMapHeight = null;
      var overlayMapWidth = null;
      (function () {
        var overlayBounds = overlayMap.getBounds();
        var northEastCorner = overlayBounds.getNorthEast();
        var southWestCorner = overlayBounds.getSouthWest();
        var northEastLat = northEastCorner.lat();
        var northEastLng = northEastCorner.lng();
        var southWestLat = southWestCorner.lat();
        var southWestLng = southWestCorner.lng();

        overlayMapHeight = Math.abs(180 + northEastLat - southWestLat) - 180;
        overlayMapHeight = overlayMapHeight / 2;
        overlayMapWidth = Math.abs(360 + northEastLng - southWestLng) - 360;
      })();

      var heightOverage = (overlayMapHeight - mapHeight);
      var widthOverage = (overlayMapWidth - mapWidth);
      var margin = 0.2;
      var divisor = (2 + 2 * margin);
      var wayTooBig = false;
      if (
        // margin of one means zoom in when overage is big enough that 
        // zooming in would leave > half of width
        // which would be when overage is > three quarters width

        // margin of zero mean zoom in when overage is > half width
        (widthOverage > (divisor - 1) * (overlayMapWidth / divisor)) &&
        (heightOverage > (divisor - 1) * (overlayMapHeight / divisor))
      ) {
        //FIXME: sometimes it isn't enough to change by only 1.
        overlayMap.setZoom(overlayMap.getZoom() + 1);
      } else if (
        // margin of one means, zoom out when overage is < half width
        // margin of half means zoom out when overage is < quarter width
        // margin of zero means zoom out when overage is < 0
        (widthOverage < margin * overlayMapWidth / 2) ||
        (heightOverage < margin * overlayMapHeight / 2)
      ) {
        var overlayZoom = overlayMap.getZoom();
        if (overlayZoom > 0) {
          //FIXME: sometimes it isn't enough to change by only 1.
          overlayMap.setZoom(overlayZoom - 1);
        } else {
          wayTooBig = true;
        }
      }
      if (wayTooBig === false) {
        path = pathFromBounds(newBounds);
      }
    }
    translucentBox.setPath(path);
  });

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function latToY(latitude) {
    var lat = degToRad(latitude);
    return Math.log(Math.tan(lat) + 1 / Math.cos(lat));
  }

  function radToDeg(radians) {
    return radians * 180 / Math.PI;
  }

  function yToLat(y) {
    var angle = 2 * Math.atan(Math.pow(Math.E, y)) - Math.PI / 2;
    return radToDeg(angle);
  }

  google.maps.event.addListener(overlayMap, 'bounds_changed', function () {
    var mapBounds = map.getBounds();
    if (mapBounds !== undefined) {
      var northEastCorner = mapBounds.getNorthEast();
      var southWestCorner = mapBounds.getSouthWest();
      var northEastLat = northEastCorner.lat();
      var northEastLng = northEastCorner.lng();
      var southWestLat = southWestCorner.lat();
      var southWestLng = southWestCorner.lng();

      var mapCenter = map.getCenter();
      var overlayCenter = overlayMap.getCenter();
      var lngDelta = overlayCenter.lng() - mapCenter.lng();
      northEastLng += lngDelta;
      southWestLng += lngDelta;

      var overlayMapBounds = overlayMap.getBounds();
      var overlayTopLat = overlayMapBounds.getNorthEast().lat();
      var overlayBottomLat = overlayMapBounds.getSouthWest().lat();
      var overlayTop = latToY(overlayTopLat);
      var overlayBottom = latToY(overlayBottomLat);
      var overlayHeight = Math.abs(overlayTop - overlayBottom);
      var mapHeight = Math.abs(latToY(northEastLat) - latToY(southWestLat));

      var bottomLatDelta = overlayBottom + (overlayHeight - mapHeight) / 2;
      var topLatDelta = overlayTop - (overlayHeight - mapHeight) / 2;
      northEastLat = yToLat(topLatDelta);
      southWestLat = yToLat(bottomLatDelta);

      var sw = new google.maps.LatLng(southWestLat, southWestLng);
      var se = new google.maps.LatLng(southWestLat, northEastLng);
      var ne = new google.maps.LatLng(northEastLat, northEastLng);
      var nw = new google.maps.LatLng(northEastLat, southWestLng);
      transparentBox.setPath([sw, nw, ne, se, sw]);
    }
  });

  google.maps.event.addListener(map, 'zoom_changed', function () {
    var newZoom = Math.max(map.get_zoom() - 4, 0);
    if (overlayMap.getZoom() !== newZoom) {
      overlayMap.setZoom(newZoom);
    }
  });

  var mapDragInProgress = false;
  var panHasBegun = false;

  google.maps.event.addListener(map, 'center_changed', function () {
    if ((mapDragInProgress === false) && (panHasBegun === false)) {
      updateOverlayMapCenter();
    }
  });

  google.maps.event.addListener(map, 'idle', function () {
    if (panHasBegun === true) {
      panHasBegun = false;
      mapDragInProgress = false;
    }
  });

  google.maps.event.addListener(map, 'dragstart', function () {
    panHasBegun = false;
    mapDragInProgress = true;
  });

  google.maps.event.addListener(map, 'dragend', function () {
    updateOverlayMapCenter();
    mapDragInProgress = false;
  });

  google.maps.event.addListener(overlayMap, 'dragstart', function () {
    panHasBegun = false;
    mapDragInProgress = true;
  });

  google.maps.event.addListener(overlayMap, 'dragend', function () {
    panHasBegun = true;
    var newCenter = overlayMap.getCenter();
    if (map.getCenter() !== newCenter) {
      map.panTo(newCenter);
    }
  });

  google.maps.event.addListener(overlayMap, 'dblclick', function (mEvent) {
    mapDragInProgress = true;
    overlayMap.panTo(mEvent.latLng);
    map.panTo(mEvent.latLng);
  });

  google.maps.event.addListener(map, 'maptypeid_changed', function () {
    overlayMap.setOptions({mapTypeId: map.getMapTypeId()});
  });

  // Set map's properties now that all bindings and listeners are set up.
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  map.setZoom(8); // This will trigger a zoom_changed on the map
  var defaultCenter = new google.maps.LatLng(41.889, -87.629);
  map.setCenter(defaultCenter);

  overlayMap.setZoom(4);
  overlayMap.setCenter(defaultCenter);

};
