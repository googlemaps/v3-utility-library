/**
 * @name MarkerWithLabel for V3
 * @version 1.2.3
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3
 *  <code>google.maps.Marker</code> class.
 *  <p>
 *  MarkerWithLabel allows you to define markers with associated labels. As you would expect,
 *  if the marker is draggable, so too will be the label. In addition, a marker with a label
 *  responds to all mouse events in the same manner as a regular marker. It also fires mouse
 *  events and "property changed" events just as a regular marker would.
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

/*jslint browser:true */
/*global document,google */

/**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 * @private
 */
function inherits(childCtor, parentCtor) {
  /* @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /* @override */
  childCtor.prototype.constructor = childCtor;
}

/**
 * This constructor creates a label and associates it with a marker.
 * It is for the private use of the MarkerWithLabel class.
 * @constructor
 * @param {Marker} marker The marker with which the label is to be associated.
 * @param {string} crossURL The URL of the cross image =.
 * @private
 */
function MarkerLabel_(marker, crossURL) {
  this.marker_ = marker;

  this.labelDiv_ = document.createElement("div");
  this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

  // Set up the DIV for handling mouse events in the label. This DIV forms a transparent veil
  // in the "overlayMouseTarget" pane, a veil that covers just the label. This is done so that
  // events can be captured even if the label is in the shadow of a google.maps.InfoWindow.
  // Code is included here to ensure the veil is always exactly the same size as the label.
  this.eventDiv_ = document.createElement("div");
  this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;

  // This is needed for proper behavior on MSIE:
  this.eventDiv_.setAttribute("onselectstart", "return false;");
  this.eventDiv_.setAttribute("ondragstart", "return false;");

  // Get the DIV for the "X" to be displayed when the marker is raised.
  this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
}

if (typeof google !== 'undefined') {
  inherits(MarkerLabel_, google.maps.OverlayView);
}


/**
 * Returns the DIV for the cross used when dragging a marker when the
 * crossOnDrag parameter set to true. One cross is shared with all markers.
 * @param {string} crossURL The URL of the cross image.
 * @private
 */
MarkerLabel_.getSharedCross = function (crossURL) {
  var div;
  if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
    div = document.createElement("img");
    div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
    // Hopefully Google never changes the standard "X" attributes:
    div.style.marginLeft = "-8px";
    div.style.marginTop = "-9px";
    div.src = crossURL;
    MarkerLabel_.getSharedCross.crossDiv = div;
  }
  return MarkerLabel_.getSharedCross.crossDiv;
};

/**
 * Adds the DIV representing the label to the DOM. This method is called
 * automatically when the marker's <code>setMap</code> method is called.
 * @private
 */
MarkerLabel_.prototype.onAdd = function () {
  var me = this;

  this.getPanes().markerLayer.appendChild(this.labelDiv_);
  this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
  // One cross is shared with all markers, so only add it once:
  if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
    this.getPanes().overlayImage.appendChild(this.crossDiv_);
    MarkerLabel_.getSharedCross.processed = true;
  }

  this.addMouseListeners();

  this.listeners2_ = [
    google.maps.event.addListener(this.marker_, "clickable_changed", function () {
      me.setClickable();
    }),
    google.maps.event.addListener(this.marker_, "cursor_changed", function () {
      me.setCursor();
    }),
    google.maps.event.addListener(this.marker_, "draggable_changed", function () {
      me.setClickable();
    }),
    google.maps.event.addListener(this.marker_, "position_changed", function () {
      me.setPosition();
    }),
    google.maps.event.addListener(this.marker_, "visible_changed", function () {
      me.setVisible();
    }),
    google.maps.event.addListener(this.marker_, "title_changed", function () {
      me.setTitle();
    }),
    google.maps.event.addListener(this.marker_, "zindex_changed", function () {
      me.setZIndex();
    }),
    google.maps.event.addListener(this.marker_, "labelanchor_changed", function () {
      me.setAnchor();
    }),
    google.maps.event.addListener(this.marker_, "labelclass_changed", function () {
      me.setStyles();
    }),
    google.maps.event.addListener(this.marker_, "labelcontent_changed", function () {
      me.setContent();
    }),
    google.maps.event.addListener(this.marker_, "labelstyle_changed", function () {
      me.setStyles();
    }),
    google.maps.event.addListener(this.marker_, "labelvisible_changed", function () {
      me.setVisible();
    })
  ];
};

/**
 * Adds the listeners for a clickable label.
 * @private
 */
MarkerLabel_.prototype.addMouseListeners = function () {
  var me = this;
  var cTouchScreen = false;
  var cMouseIsDown = false;
  var cDraggingLabel = false;
  var cIgnoreClick;
  var cLatOffset, cLngOffset;

  // Stop all processing of an event.
  //
  var cAbortEvent = function (e) {
    e = e || window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  };

  // Stop an event from propagating.
  //
  var cStopPropagation = function (e) {
    e = e || window.event;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  };

  this.listeners1_ = [
    google.maps.event.addDomListener(this.eventDiv_, "mouseover", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      if (me.marker_.getClickable() || me.marker_.getDraggable()) {
        if (!cTouchScreen) {
          this.style.cursor = (me.marker_.getCursor() || "pointer");
          google.maps.event.trigger(me.marker_, "mouseover", mEvent);
          cAbortEvent(e);
        }
      } else {
        this.style.cursor = null;
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mouseout", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      if (me.marker_.getClickable() || me.marker_.getDraggable()) {
        if (!cTouchScreen) {
          google.maps.event.trigger(me.marker_, "mouseout", mEvent);
          cAbortEvent(e);
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mousedown", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      cDraggingLabel = false;
      if (me.marker_.getClickable() || me.marker_.getDraggable()) {
        cMouseIsDown = true;
        google.maps.event.trigger(me.marker_, "mousedown", mEvent);
        if (!cTouchScreen) {
          cAbortEvent(e); // Prevent map pan when starting a drag on a label
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mouseup", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      if (cMouseIsDown) {
        cMouseIsDown = false;
        google.maps.event.trigger(me.marker_, "mouseup", mEvent);
        if (cDraggingLabel) {
          cDraggingLabel = false;
          me.crossDiv_.style.display = "none";
          cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
          google.maps.event.trigger(me.marker_, "dragend", mEvent);
        }
        if (!me.marker_.getDraggable()) {
          cAbortEvent(e);
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "click", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      if (me.marker_.getClickable() || me.marker_.getDraggable()) {
        if (cIgnoreClick) { // Ignore the click reported when a label drag ends
          cIgnoreClick = false;
        } else {
          google.maps.event.trigger(me.marker_, "click", mEvent);
        }
        cAbortEvent(e); // Prevent click from being passed on to map
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "dblclick", function (e) {
      var mEvent = {latLng: me.marker_.getPosition()};
      if (me.marker_.getClickable() || me.marker_.getDraggable()) {
        google.maps.event.trigger(me.marker_, "dblclick", mEvent);
        cAbortEvent(e); // Prevent map zoom when double-clicking on a label
      }
    }),
    google.maps.event.addListener(this.marker_.getMap(), "mousemove", function (mEvent) {
      var position;
      if (cMouseIsDown && me.marker_.getDraggable()) {
        if (cDraggingLabel) {
          // Change the reported location from the mouse position to the marker position:
          mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
          if (me.marker_.get("crossOnDrag")) { // Position and display the cross
            position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
            me.crossDiv_.style.left = position.x + "px";
            me.crossDiv_.style.top = position.y + "px";
            me.crossDiv_.style.display = "";
          }
          google.maps.event.trigger(me.marker_, "drag", mEvent);
        } else {
          // Calculate offsets from the click point to the marker position:
          cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
          cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
          cDraggingLabel = true;
          mEvent.latLng = me.marker_.getPosition();
          google.maps.event.trigger(me.marker_, "dragstart", mEvent);
        }
      }
    }),
    google.maps.event.addListener(this.marker_, "dragstart", function (mEvent) {
      // During a drag, the marker's z-index is temporarily set to 1000000 to ensure
      // it appears above all other markers. Here we also set the label's z-index
      // to 1000000 (plus or minus 1 depending on whether the label is supposed
      // to be above or below the marker). (NOTE: For some reason, Google does not
      // fire a zindex_changed event when changing the marker's z-index to 100000
      // or else this task would be handled by the MarkerLabel_.setZIndex() method.)
      //
      me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
      me.eventDiv_.style.zIndex = me.labelDiv_.style.zIndex;
    }),
    google.maps.event.addListener(this.marker_, "drag", function (mEvent) {
      this.setPosition(mEvent.latLng);
    }),
    google.maps.event.addListener(this.marker_, "dragend", function (mEvent) {
      me.setZIndex();
    }),
    // Prevent touch events from passing through the label DIV to the underlying map.
    //
    google.maps.event.addDomListener(this.eventDiv_, "touchstart", function (e) {
      cTouchScreen = true;
      cStopPropagation(e);
    }),
    google.maps.event.addDomListener(this.eventDiv_, "touchmove", function (e) {
      cStopPropagation(e);
    }),
    google.maps.event.addDomListener(this.eventDiv_, "touchend", function (e) {
      cStopPropagation(e);
    })
  ];
};

/**
 * Removes the listeners for a clickable label.
 * @private
 */
MarkerLabel_.prototype.removeMouseListeners = function () {
  var i;

  if (this.listeners1_) {
    for (i = 0; i < this.listeners1_.length; i++) {
      google.maps.event.removeListener(this.listeners1_[i]);
    }
  }
};

/**
 * Removes the DIV for the label from the DOM. It also removes all event handlers.
 * This method is called automatically when the marker's <code>setMap(null)</code>
 * method is called.
 * @private
 */
MarkerLabel_.prototype.onRemove = function () {
  var i;
  if (this.labelDiv_.parentNode) {
    this.labelDiv_.parentNode.removeChild(this.labelDiv_);
  }
  if (this.eventDiv_.parentNode) {
    this.eventDiv_.parentNode.removeChild(this.eventDiv_);
  }
  // Remove event listeners:
  this.removeMouseListeners();

  if (this.listeners2_) {
    for (i = 0; i < this.listeners2_.length; i++) {
      google.maps.event.removeListener(this.listeners2_[i]);
    }
  }
};

/**
 * Draws the label on the map.
 * @private
 */
MarkerLabel_.prototype.draw = function () {
  this.setContent();
  this.setTitle();
  this.setStyles();
};

/**
 * Sets the content of the label.
 * The content can be plain text or an HTML DOM node.
 * @private
 */
MarkerLabel_.prototype.setContent = function () {
  var content = this.marker_.get("labelContent");
  var previousContent = this.marker_._previousContent;
  if(previousContent !== content){
    this.marker_._previousContent = content;
    if (typeof content.nodeType === "undefined") {
      this.labelDiv_.innerHTML = content;
      this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
    } else {
      this.labelDiv_.innerHTML = ""; // Remove current content
      this.labelDiv_.appendChild(content);
      content = content.cloneNode(true);
      this.eventDiv_.innerHTML = ""; // Remove current content
      this.eventDiv_.appendChild(content);
    }
  }
};

/**
 * Sets the content of the tool tip for the label. It is
 * always set to be the same as for the marker itself.
 * @private
 */
MarkerLabel_.prototype.setTitle = function () {
  this.eventDiv_.title = this.marker_.getTitle() || "";
};

/**
 * Sets the style of the label by setting the style sheet and applying
 * other specific styles requested.
 * @private
 */
MarkerLabel_.prototype.setStyles = function () {
  var i, labelStyle;

  // Apply style values from the style sheet defined in the labelClass parameter:
  this.labelDiv_.className = this.marker_.get("labelClass");
  this.eventDiv_.className = this.labelDiv_.className;

  // Clear existing inline style values:
  this.labelDiv_.style.cssText = "";
  this.eventDiv_.style.cssText = "";
  // Apply style values defined in the labelStyle parameter:
  labelStyle = this.marker_.get("labelStyle");
  for (i in labelStyle) {
    if (labelStyle.hasOwnProperty(i)) {
      this.labelDiv_.style[i] = labelStyle[i];
      this.eventDiv_.style[i] = labelStyle[i];
    }
  }
  this.setMandatoryStyles();
};

/**
 * Sets the mandatory styles to the DIV representing the label as well as to the
 * associated event DIV. This includes setting the DIV position, z-index, and visibility.
 * @private
 */
MarkerLabel_.prototype.setMandatoryStyles = function () {
  this.labelDiv_.style.position = "absolute";
  this.labelDiv_.style.overflow = "hidden";
  // Make sure the opacity setting causes the desired effect on MSIE:
  if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
    this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
    this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
  }

  this.eventDiv_.style.position = this.labelDiv_.style.position;
  this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
  this.eventDiv_.style.cursor = "pointer"; // Required to make this clickable on iOS
  this.eventDiv_.style.opacity = 0.01; // Don't use 0; DIV won't be clickable on MSIE
  this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
  this.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE

  this.setAnchor();
  this.setPosition();
  this.setZIndex();
  this.setVisible();
};

/**
 * Sets the anchor point of the label.
 * @private
 */
MarkerLabel_.prototype.setAnchor = function () {
  var anchor = this.marker_.get("labelAnchor");
  this.labelDiv_.style.marginLeft = -anchor.x + "px";
  this.labelDiv_.style.marginTop = -anchor.y + "px";
  this.eventDiv_.style.marginLeft = -anchor.x + "px";
  this.eventDiv_.style.marginTop = -anchor.y + "px";
};

/**
 * Sets the position of the label. The z-index is also updated, if necessary.
 * @private
 */
MarkerLabel_.prototype.setPosition = function () {
  var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
  this.labelDiv_.style.left = Math.round(position.x) + "px";
  this.labelDiv_.style.top = Math.round(position.y) + "px";
  this.eventDiv_.style.left = this.labelDiv_.style.left;
  this.eventDiv_.style.top = this.labelDiv_.style.top;
};

/**
 * Sets the z-index of the label. If the marker's z-index property has not been defined, the z-index
 * of the label is set to the vertical coordinate of the label. This is in keeping with the default
 * stacking order for Google Maps: markers to the south are in front of markers to the north.
 * @private
 */
MarkerLabel_.prototype.setZIndex = function () {
  var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
  if (typeof this.marker_.getZIndex() === "undefined") {
    this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  } else {
    this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  }
};

/**
 * Sets the clickability of the label. The label is clickable only if the
 * marker itself is clickable (i.e., its clickable property is true) or if
 * it is draggable (i.e., its draggable property is true).
 * @private
 */
MarkerLabel_.prototype.setClickable = function () {
  this.removeMouseListeners();
  this.eventDiv_.style.cursor = null;
  if (this.marker_.getClickable() || this.marker_.getDraggable()) {
    this.addMouseListeners();
  }
};

/**
 * Sets the cursor for the label.
 * @private
 */
MarkerLabel_.prototype.setCursor = function () {
  this.eventDiv_.style.cursor = this.marker_.getCursor();
};

/**
 * Sets the visibility of the label. The label is visible only if the marker itself is
 * visible (i.e., its visible property is true) and the labelVisible property is true.
 * @private
 */
MarkerLabel_.prototype.setVisible = function () {
  if (this.marker_.get("labelVisible")) {
    this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
  } else {
    this.labelDiv_.style.display = "none";
  }
  this.eventDiv_.style.display = this.labelDiv_.style.display;
};

/**
 * @name MarkerWithLabelOptions
 * @class This class represents the optional parameter passed to the {@link MarkerWithLabel} constructor.
 *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
 *  of the properties listed below. To change any of these additional properties after the labeled
 *  marker has been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
 *  <p>
 *  When any of these properties changes, a property changed event is fired. The names of these
 *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
 *  For example, if the content of the label changes, a <code>labelcontent_changed</code> event
 *  is fired.
 *  <p>
 * @property {string|Node} [labelContent] The content of the label (plain text or an HTML DOM node).
 * @property {Point} [labelAnchor] By default, a label is drawn with its anchor point at (0,0) so
 *  that its top left corner is positioned at the anchor point of the associated marker. Use this
 *  property to change the anchor point of the label. For example, to center a 50px-wide label
 *  beneath a marker, specify a <code>labelAnchor</code> of <code>google.maps.Point(25, 0)</code>.
 *  (Note: x-values increase to the right and y-values increase to the top.)
 * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
 *  <code>marginTop</code> are ignored; these styles are for internal use only.
 * @property {Object} [labelStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the label. Style values defined here override those that may
 *  be defined in the <code>labelClass</code> style sheet. If this property is changed after the
 *  label has been created, all previously set styles (except those defined in the style sheet)
 *  are removed from the label before the new style values are applied.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
 *  <code>marginTop</code> are ignored; these styles are for internal use only.
 * @property {boolean} [labelInBackground] A flag indicating whether a label that overlaps its
 *  associated marker should appear in the background (i.e., in a plane below the marker).
 *  The default is <code>false</code>, which causes the label to appear in the foreground.
 * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
 *  The default is <code>true</code>. Note that even if <code>labelVisible</code> is
 *  <code>true</code>, the label will <i>not</i> be visible unless the associated marker is also
 *  visible (i.e., unless the marker's <code>visible</code> property is <code>true</code>).
 * @property {boolean} [crossOnDrag] A flag indicating whether a cross ("X") is to be
 *  shown when the marker label is dragged. The default is <code>true</code>. The marker
 *  is placed at the position of the cross when the drag ends.
 * @property {boolean} [optimized] A flag indicating whether rendering is to be optimized
 *  for the marker. <b>Important: The optimized rendering technique is not supported by
 *  MarkerWithLabel, so the value of this parameter is always forced to <code>false</code>.
 * @property {string} [crossImage="//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"]
 *  The URL of the cross image to be displayed while dragging a marker.
 */
/**
 * Creates a MarkerWithLabel with the options specified in {@link MarkerWithLabelOptions}.
 * @constructor
 * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
 */
function MarkerWithLabel(opt_options) {
  opt_options = opt_options || {};
  opt_options.labelContent = opt_options.labelContent || "";
  opt_options.labelAnchor = opt_options.labelAnchor || new google.maps.Point(0, 0);
  opt_options.labelClass = opt_options.labelClass || "markerLabels";
  opt_options.labelStyle = opt_options.labelStyle || {};
  opt_options.labelInBackground = opt_options.labelInBackground || false;
  if (typeof opt_options.labelVisible === "undefined") {
    opt_options.labelVisible = true;
  }
  if (typeof opt_options.crossOnDrag === "undefined") {
    opt_options.crossOnDrag = true;
  }
  if (typeof opt_options.clickable === "undefined") {
    opt_options.clickable = true;
  }
  if (typeof opt_options.draggable === "undefined") {
    opt_options.draggable = false;
  }
  if (typeof opt_options.optimized === "undefined") {
    opt_options.optimized = false;
  }
  opt_options.crossImage = opt_options.crossImage || "//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
  opt_options.optimized = false; // Optimized rendering is not supported

  this.label = new MarkerLabel_(this, opt_options.crossImage); // Bind the label to the marker

  // Call the parent constructor. It calls Marker.setValues to initialize, so all
  // the new parameters are conveniently saved and can be accessed with get/set.
  // Marker.set triggers a property changed event (called "propertyname_changed")
  // that the marker label listens for in order to react to state changes.
  google.maps.Marker.apply(this, arguments);
}

if (typeof google !== 'undefined') {
  inherits(MarkerWithLabel, google.maps.Marker);
}

/**
 * Overrides the standard Marker setMap function.
 * @param {Map} theMap The map to which the marker is to be added.
 * @private
 */
MarkerWithLabel.prototype.setMap = function (theMap) {

  // Call the inherited function...
  google.maps.Marker.prototype.setMap.apply(this, arguments);

  // ... then deal with the label:
  this.label.setMap(theMap);
};

if (typeof module == 'object') {
  module.exports = MarkerWithLabel;
}
