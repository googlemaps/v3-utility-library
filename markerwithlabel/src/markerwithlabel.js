/**
 * @name MarkerWithLabel for V3
 * @version 1.0 [June 22, 2010]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2010 Gary Little [gary at luxcentral.com]
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
 * This constructor creates a label associated with a marker. It is for the
 *  private use of the MarkerWithLabel class.
 * @constructor
 * @param {Marker} marker The marker with which the label is to be associated.
 * @private
 */
function MarkerLabel_(marker) {
  var me = this;

  this.marker_ = marker;

  this.labelDiv_ = document.createElement("div");
  this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

  // Set up the DIV for handling mouse events in the label. This DIV forms a transparent veil
  // in the "overlayMouseTarget" pane, a veil that covers the label. This is done so that
  // events can be captured even if the label is in the shadow of a google.maps.InfoWindow.
  // Code is included here to ensure the veil is always exactly the same size as the label.
  this.eventDiv_ = document.createElement("div");
  // Prevent selection of the text in the label:
  this.eventDiv_.onselectstart = function () {
    return false;
  };
  this.eventDiv_.style.cssText = "position: absolute; overflow: hidden;";

  this.setMap(this.marker_.getMap());
  google.maps.event.addListener(this.marker_, "map_changed", function () {
    me.setMap(me.marker_.getMap());
  });
}

// MarkerLabel_ inherits from <code>OverlayView</code>:
MarkerLabel_.prototype = new google.maps.OverlayView();

/**
 * Adds the DIV representing the label to the DOM. It is called
 * automatically when the marker's <code>setMap</code> method is called.
 * @private
 */
MarkerLabel_.prototype.onAdd = function () {
  var me = this;
  var cMouseIsDown = false;
  var cDraggingInProgress = false;
  var cLastPosition;
  var cLatOffset;
  var cLngOffset;
  var cSavedMarkerZ;
  var cIgnoreClick;
  
  // Applies mandatory style values to the label and event DIVs in case
  // an attempt was made to change them:
  var cApplyMandatoryStyles = function () {
    var position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());

    // Make sure the opacity setting causes the desired effect on MSIE:
    if (typeof me.labelDiv_.style.opacity !== "undefined") {
      me.labelDiv_.style.filter = "alpha(opacity=" + (me.labelDiv_.style.opacity * 100) + ")";
    }

    me.labelDiv_.style.position = "absolute";
    me.labelDiv_.style.overflow = "hidden";
    me.labelDiv_.style.left = position.x + "px";
    me.labelDiv_.style.top = position.y + "px";

    me.eventDiv_.style.position = me.labelDiv_.style.position;
    me.eventDiv_.style.overflow = me.labelDiv_.style.overflow;
    me.eventDiv_.style.left = me.labelDiv_.style.left;
    me.eventDiv_.style.top = me.labelDiv_.style.top;
    me.eventDiv_.style.opacity = 0.01; // Don't use 0; DIV won't be clickable on MSIE
    me.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE
  };

  this.getPanes().overlayImage.appendChild(this.labelDiv_);
  this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);

  this.listeners_ = [
    google.maps.event.addDomListener(document, "mouseup", function (mEvent) {
      if (cDraggingInProgress) {
        mEvent.latLng = cLastPosition;
        cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
        google.maps.event.trigger(me.marker_, "dragend", mEvent);
      }
      cMouseIsDown = false;
      google.maps.event.trigger(me.marker_, "mouseup", mEvent);
    }),
    google.maps.event.addListener(me.marker_.getMap(), "mousemove", function (mEvent) {
      if (cMouseIsDown && me.marker_.getDraggable()) {
        // Change the reported location from the mouse position to the marker position:
        mEvent.latLng = new google.maps.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
        cLastPosition = mEvent.latLng;
        if (cDraggingInProgress) {
          google.maps.event.trigger(me.marker_, "drag", mEvent);
        } else {
          // Calculate offsets from the click point to the marker position:
          cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
          cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
          google.maps.event.trigger(me.marker_, "dragstart", mEvent);
        }
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mouseover", function (e) {
      me.eventDiv_.style.cursor = "pointer";
      google.maps.event.trigger(me.marker_, "mouseover", e);
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mouseout", function (e) {
      me.eventDiv_.style.cursor = me.marker_.getCursor();
      google.maps.event.trigger(me.marker_, "mouseout", e);
    }),
    google.maps.event.addDomListener(this.eventDiv_, "click", function (e) {
      if (cIgnoreClick) { // Ignore the click reported when a label drag ends
        cIgnoreClick = false;
      } else {
        google.maps.event.trigger(me.marker_, "click", e);
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "dblclick", function (e) {
      google.maps.event.trigger(me.marker_, "dblclick", e);
      // Prevent map zoom when double-clicking on a label:
      e.cancelBubble = true;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }),
    google.maps.event.addDomListener(this.eventDiv_, "mousedown", function (e) {
      cMouseIsDown = true;
      cDraggingInProgress = false;
      cLatOffset = 0;
      cLngOffset = 0;
      google.maps.event.trigger(me.marker_, "mousedown", e);
      // Prevent map pan when starting a drag on a label:
      e.cancelBubble = true;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }),
    google.maps.event.addListener(this.marker_, "dragstart", function (mEvent) {
      cDraggingInProgress = true;
      cSavedMarkerZ = me.marker_.getZIndex();
    }),
    google.maps.event.addListener(this.marker_, "drag", function (mEvent) {
      me.marker_.setPosition(mEvent.latLng);
      me.marker_.setZIndex(1000000);
    }),
    google.maps.event.addListener(this.marker_, "dragend", function (mEvent) {
      cDraggingInProgress = false;
      me.marker_.setZIndex(cSavedMarkerZ);
    }),
    google.maps.event.addListener(this.marker_, "labeltext_changed", function () {
      me.labelDiv_.innerHTML = me.marker_.get("labelText");
      me.eventDiv_.innerHTML = me.labelDiv_.innerHTML;
    }),
    google.maps.event.addListener(this.marker_, "labelclass_changed", function () {
      me.labelDiv_.className = me.marker_.get("labelClass");
      me.eventDiv_.className = me.labelDiv_.className;
      cApplyMandatoryStyles();
    }),
    google.maps.event.addListener(this.marker_, "labelstyle_changed", function () {
      var i, labelStyle;

      // Apply default style values to the label:
      me.labelDiv_.className = me.marker_.get("labelClass");
      me.eventDiv_.className = me.labelDiv_.className;
      // Apply style values defined in the labelStyle parameter:
      labelStyle = me.marker_.get("labelStyle");
      for (i in labelStyle) {
        if (labelStyle.hasOwnProperty(i)) {
          me.labelDiv_.style[i] = labelStyle[i];
          me.eventDiv_.style[i] = labelStyle[i];
        }
      }
      cApplyMandatoryStyles();
    }),
    google.maps.event.addListener(this.marker_, "zindex_changed", function () {
      var zAdjust = (me.marker_.get("labelInForeground") ? 1 : 0);
      if (typeof me.marker_.getZIndex() === "undefined") {
        // Set up default stacking order: labels to the south are in front of labels to the north:
        me.labelDiv_.style.zIndex = parseInt(me.labelDiv_.style.top, 10) + zAdjust;
        me.eventDiv_.style.zIndex = me.labelDiv_.style.zIndex;
      } else {
        me.labelDiv_.style.zIndex = me.marker_.getZIndex() + zAdjust;
        me.eventDiv_.style.zIndex = me.labelDiv_.style.zIndex;
      }
    }),
    google.maps.event.addListener(this.marker_, "labelvisible_changed", function () {
      if (me.marker_.get("labelVisible")) {
        me.labelDiv_.style.display = me.marker_.getVisible() ? "block" : "none";
      } else {
        me.labelDiv_.style.display = "none";
      }
      me.eventDiv_.style.display = me.labelDiv_.style.display;
    }),
    google.maps.event.addListener(this.marker_, "position_changed", function () {
      var position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
      me.labelDiv_.style.left = position.x + "px";
      me.labelDiv_.style.top = position.y + "px";
      me.eventDiv_.style.left = me.labelDiv_.style.left;
      me.eventDiv_.style.top = me.labelDiv_.style.top;
      var zAdjust = (me.marker_.get("labelInForeground") ? 1 : 0);
      if (typeof me.marker_.getZIndex() === "undefined") {
        // Apply default stacking order: labels to the south are in front of labels to the north:
        me.labelDiv_.style.zIndex = parseInt(me.labelDiv_.style.top, 10) + zAdjust;
        me.eventDiv_.style.zIndex = me.labelDiv_.style.zIndex;
      }
    }),
    google.maps.event.addListener(this.marker_, "visible_changed", function () {
      if (me.marker_.get("labelVisible")) {
        me.labelDiv_.style.display = me.marker_.getVisible() ? "block" : "none";
      } else {
        me.labelDiv_.style.display = "none";
      }
      me.eventDiv_.style.display = me.labelDiv_.style.display;
    }),
    google.maps.event.addListener(this.marker_, "title_changed", function () {
      me.eventDiv_.title = me.marker_.getTitle();
    })
  ];
};

/**
 * Removes the DIV for the label from the DOM. It also removes all event handlers.
 * This method is called when <code>setMap(null)</code> is called.
 * @private
 */
MarkerLabel_.prototype.onRemove = function () {
  var i;
  this.labelDiv_.parentNode.removeChild(this.labelDiv_);
  this.eventDiv_.parentNode.removeChild(this.eventDiv_);

  // Remove event listeners:
  for (i = 0; i < this.listeners_.length; i++) {
    google.maps.event.removeListener(this.listeners_[i]);
  }
};

/**
 * Draws the label with the specified style and at the specified location.
 * @private
 */
MarkerLabel_.prototype.draw = function () {
  var i, labelStyle, zAdjust;
  
  // Position the container:
  var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
  this.labelDiv_.style.left = position.x + "px";
  this.labelDiv_.style.top = position.y + "px";
  this.eventDiv_.style.left = this.labelDiv_.style.left;
  this.eventDiv_.style.top = this.labelDiv_.style.top;

  if (this.marker_.get("labelVisible")) {
    this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
  } else {
    this.labelDiv_.style.display = "none";
  }
  this.eventDiv_.style.display = this.labelDiv_.style.display;

  this.eventDiv_.title = this.marker_.getTitle() || "";

  // Apply default style values to the label:
  this.labelDiv_.className = this.marker_.get("labelClass");
  this.eventDiv_.className = this.labelDiv_.className;
  // Apply style values defined in the labelStyle parameter:
  labelStyle = this.marker_.get("labelStyle");
  for (i in labelStyle) {
    if (labelStyle.hasOwnProperty(i)) {
      this.labelDiv_.style[i] = labelStyle[i];
      this.eventDiv_.style[i] = labelStyle[i];
    }
  }
  // Make sure the opacity setting causes the desired effect on MSIE:
  if (typeof this.labelDiv_.style.opacity !== "undefined") {
    this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
  }
  // Apply mandatory style values:
  this.labelDiv_.style.position = "absolute";
  this.labelDiv_.style.overflow = "hidden";
  this.labelDiv_.style.left = position.x + "px";
  this.labelDiv_.style.top = position.y + "px";

  this.eventDiv_.style.position = this.labelDiv_.style.position;
  this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
  this.eventDiv_.style.left = this.labelDiv_.style.left;
  this.eventDiv_.style.top = this.labelDiv_.style.top;
  this.eventDiv_.style.opacity = 0.01; // Don't use 0; not clickable on MSIE
  this.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE

  zAdjust = (this.marker_.get("labelInForeground") ? 1 : 0);
  if (typeof this.marker_.getZIndex() === "undefined") {
    // Apply default stacking order: labels to the south are in front of labels to the north:
    this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  } else {
    this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
    this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
  }

  this.labelDiv_.innerHTML = this.marker_.get("labelText");
  this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
};

/**
 * @name MarkerWithLabelOptions
 * @class This class represents the optional parameter passed into <code>MarkerWithLabel</code>.
 *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
 *  of the properties below. To change any of these new properties after the labeled marker has
 *  been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
 *  <p>
 *  When any of these properties changes, a property changed event is fired. The names of these
 *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
 *  For example, if the text of the label changes, a <code>labeltext_changed</code> event is fired.
 *  <p>
 * @property {string} [labelText] The text of the label. It can include HTML code.
 * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  and <code>left</code> are ignored; these styles are used internally only.
 * @property {Object} [labelStyle] An object literal whose properties define specific CSS
 *  style values to be applied to the label. Style values defined here override those that may
 *  be defined in the <code>labelClass</code> style sheet.
 *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
 *  and <code>left</code> are ignored; these styles are used internally only.
 * @property {number} [labelInForeground] A flag indicating whether a label that overlaps its
 *  corresponding marker should appear in the foreground (i.e., in a plane above the marker).
 *  The default is <code>true</code>.
 * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
 *  The default is <code>true</code>. Note that even when <code>labelVisible</code> is
 *  <code>true</code>, the label will <i>not</i> be visible if the marker itself is not visible
 *  (i.e., if the marker's <code>visible</code> property is <code>false</code>).
 */
/**
 * This constructor is used to create a marker with an associated label.
 * @constructor
 * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
 */
function MarkerWithLabel(opt_options) {
  opt_options.labelText = opt_options.labelText || "";
  opt_options.labelClass = opt_options.labelClass || "markerLabels";
  opt_options.labelStyle = opt_options.labelStyle || {};
  if (typeof opt_options.labelInForeground === "undefined") {
    opt_options.labelInForeground = true;
  }
  if (typeof opt_options.labelVisible === "undefined") {
    opt_options.labelVisible = true;
  }

  this.setValues(opt_options);
  this.theLabel_ = new MarkerLabel_(this);
}

// MarkerWithLabel inherits from <code>Marker</code>:
MarkerWithLabel.prototype = new google.maps.Marker();