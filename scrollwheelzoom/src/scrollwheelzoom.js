/**
 * @name Scroll Wheel Zoom for V3
 * @version 1.0
 * @author: Nianwei Liu [nianwei at gmail dot com]
 * @fileoverview This Lib allows Scroll Wheel Zoom before it is
 * officially availabel in core API. Will only test in limited browsers.
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
(function () {
  /*jslint browser:true */
  /*global google */
  /**
   * Get the position of the mouse relative to the document.
   * @param {Object} e  Mouse event
   * @return {Object} left & top position
   */
  var getMousePosition = function (e) {
    var posX = 0, posY = 0;
    e = e || window.event;
    if (typeof e.pageX !== "undefined") {
      posX = e.pageX;
      posY = e.pageY;
    } else if (typeof e.clientX !== "undefined") {
      posX = e.clientX +
      (typeof document.documentElement.scrollLeft !== "undefined" ? document.documentElement.scrollLeft : document.body.scrollLeft);
      posY = e.clientY +
      (typeof document.documentElement.scrollTop !== "undefined" ? document.documentElement.scrollTop : document.body.scrollTop);
    }
    return {
      left: posX,
      top: posY
    };
  };
  
  /**
   * Get the position of an HTML element relative to the document.
   * @param {Object} h  HTML element
   * @return {Object} left & top position
   */
  var getElementPosition = function (h) {
    var posX = h.offsetLeft;
    var posY = h.offsetTop;
    var parent = h.offsetParent;
    // Add offsets for all ancestors in the hierarchy
    while (parent !== null) {
      // Adjust for scrolling elements which may affect the map position.
      //
      // See http://www.howtocreate.co.uk/tutorials/javascript/browserspecific
      //
      // "...make sure that every element [on a Web page] with an overflow
      // of anything other than visible also has a position style set to
      // something other than the default static..."
      if (parent !== document.body && parent !== document.documentElement) {
        posX -= parent.scrollLeft;
        posY -= parent.scrollTop;
      }
      posX += parent.offsetLeft;
      posY += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return {
      left: posX,
      top: posY
    };
  };
  
  
  /**@private
   * In V3 it is quite hard to gain access to Projection and Panes.
   * This is a helper class
   * @param {google.maps.Map} map
   */ 
  function ProjectionHelperOverlay(map) {
    google.maps.OverlayView.call(this);
    this.set_map(map);
  }
  ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
  ProjectionHelperOverlay.prototype.draw = function () {
    if (!this.ready) {
      this.ready = true;
      google.maps.event.trigger(this, 'load');
    }
  };
   /**
   * @name WheelZoom
   * @private
   * @class This class enables Wheel Zoom for V3
   * @param {google.maps.Map} map
   */
  function WheelZoom(map) {
    this.prjov_ = new ProjectionHelperOverlay(map);
    // must save mousePosition because the value maybe wrong if event is wheel.
    this.mousePos_ = null;
    var me = this;
    google.maps.event.addListener(this.prjov_, 'load', function () {
      me.init_(map);
    });
  }
  /**
   * Init the tool.
   * @param {google.maps.Map} map
   */
  WheelZoom.prototype.init_ = function (map) {
    this.map_ = map;
    var me = this;
    this.mouseWheelListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousewheel', function (e) {
      me.onMouseWheel_(e);
    });
    this.mouseWheelListener2_ = google.maps.event.addDomListener(map.getDiv(), 'DOMMouseScroll', function (e) {
      me.onMouseWheel_(e);
    });
    this.mouseMoveListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousemove', function (e) {
      me.onMouseMove_(e);
    });
  };
 
  /**
   * Get the <code>google.maps.Point</code> of the mouse position relative to container.
   * @param {Object} e
   * @return {google.maps.Point} point
   * @private
   */
  WheelZoom.prototype.getMousePoint_ = function (e) {
    //NL: 2009-07-17: mouse position incorrect if e is a wheel event in FF
    var mousePosn = this.mousePos_;
    if (!mousePosn) {
      return null;
    }
    var mapPosn = getElementPosition(this.map_.getDiv());
    return new google.maps.Point(mousePosn.left - mapPosn.left, mousePosn.top - mapPosn.top);
  };
  
  WheelZoom.prototype.onMouseMove_ = function (e) {
    this.mousePos_ = getMousePosition(e);
  };
  
  WheelZoom.prototype.onMouseWheel_ = function (e) {
    if (this.map_) {
      e = e ? e : window.event;
      var wheelData = e.detail ? -e.detail : e.wheelDelta;
      var p = this.getMousePoint_(e);
      if (!p) {
        return;
      }
      var div = this.map_.getDiv();
      var prj = this.prjov_.get_projection();
      var c = new google.maps.Point(div.offsetWidth / 2, div.offsetHeight / 2);
      var z = this.map_.get_zoom();
      var latlng = null;
      // 2009-05-29: since V3 does not have fromContainerPixel, 
      //needs find offset here
      var containerPos = getElementPosition(this.map_.getDiv());
      var mapPanePos = getElementPosition(this.prjov_.get_panes().mapPane);
      var xoffset = containerPos.left - mapPanePos.left;
      var yoffset = containerPos.top - mapPanePos.top;
      // some tricks to keep mouse pointed LatLng unchanged after zoom
      if (wheelData > 0) {
        z++;
        latlng = prj.fromDivPixelToLatLng(new google.maps.Point((p.x + c.x) / 2 + xoffset, (p.y + c.y) / 2 + yoffset));
      } else {
        z--;
        latlng = prj.fromDivPixelToLatLng(new google.maps.Point(c.x * 2 - p.x + xoffset, c.y * 2 - p.y + yoffset));
      }
      this.map_.set_center(latlng);
      this.map_.set_zoom(z);
    }
  };
  /**
   * @name google.maps.Map
   * @class These are new methods added to the Google Maps API's
   * <a href  = 'http://code.google.com/apis/maps/documentation/v3/reference.html#Map'>Map</a>
   * class.
   */
  /**
   * Enable wheel zoom. 
   */
  google.maps.Map.prototype.enableScrollWheelZoom = function () {
    if (!this.wheelZoom_) {
      this.wheelZoom_ = new WheelZoom(this);
    }
  };
  /**
   * Disable wheel zoom.
   */
  google.maps.Map.prototype.disableScrollWheelZoom = function () {
    var d = this.wheelZoom_;
    if (d) {
      this.wheelZoom_ = null;
      google.maps.event.removeListener(d.mouseWheelListener_);
      google.maps.event.removeListener(d.mouseWheelListener2_);
      google.maps.event.removeListener(d.mouseMoveListener_);
    }
  };
  /**
   * Returns true if the Wheel zoom feature has been enabled.
   * @return {Boolean}
   */
  google.maps.Map.prototype.scrollWheelZoomEnabled = function () {
    return !this.wheelZoom_;
  };
})();
