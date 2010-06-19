/**
 * @name ExtDraggableObject
 * @version 1.0
 * @author Gabriel Schneider
 * @copyright (c) 2009 Gabriel Schneider
 * @fileoverview This sets up a given DOM element to be draggable
 *     around the page.
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
 * Sets up a DOM element to be draggable. The options available
 *     within {@link ExtDraggableObjectOptions} are: top, left, container,
 *     draggingCursor, draggableCursor, intervalX, intervalY,
 *     toleranceX, toleranceY, restrictX, and restrictY.
 * @param {HTMLElement} src The element to make draggable
 * @param {ExtDraggableObjectOptions} [opts] options
 * @constructor
 */
function ExtDraggableObject(src, opt_drag) {
  var me = this;
  var event_ = (window["GEvent"]||google.maps.Event||google.maps.event);
  var opt_drag_=opt_drag||{};
  var draggingCursor_ = opt_drag_.draggingCursor||"default";
  var draggableCursor_ = opt_drag_.draggableCursor||"default";
  var moving_ = false, preventDefault_;
  var currentX_, currentY_, formerY_, formerX_, formerMouseX_, formerMouseY_;
  var top_, left_;
  var mouseDownEvent_, mouseUpEvent_, mouseMoveEvent_;
  var originalX_, originalY_;
  var halfIntervalX_ = Math.round(opt_drag_.intervalX/2);
  var halfIntervalY_ = Math.round(opt_drag_.intervalY/2);
  var target_ = src.setCapture?src:document;

  if (typeof opt_drag_.intervalX !== "number") {
    opt_drag_.intervalX = 1;
  }
  if (typeof opt_drag_.intervalY !== "number") {
    opt_drag_.intervalY = 1;
  }
  if (typeof opt_drag_.toleranceX !== "number") {
    opt_drag_.toleranceX = Infinity;
  }
  if (typeof opt_drag_.toleranceY !== "number") {
    opt_drag_.toleranceY = Infinity;
  }

  mouseDownEvent_ = event_.addDomListener(src, "mousedown", mouseDown_);
  mouseUpEvent_ = event_.addDomListener(target_, "mouseup", mouseUp_);

  setCursor_(false);
  if (opt_drag_.container) {

  }
  src.style.position = "absolute";
  opt_drag_.left = opt_drag_.left||src.offsetLeft;
  opt_drag_.top = opt_drag_.top||src.offsetTop;
  opt_drag_.interval = opt_drag_.interval||1;
  moveTo_(opt_drag_.left, opt_drag_.top, false);

  /**
   * Set the cursor for {@link src} based on whether or not
   *     the element is currently being dragged.
   * @param {Boolean} a Is the element being dragged?
   * @private
   */
  function setCursor_(a) {
    if(a) {
      src.style.cursor = draggingCursor_;
    } else {
      src.style.cursor = draggableCursor_;
    }
  }

  /**
   * Moves the element {@link src} to the given
   *     location.
   * @param {Number} x The left position to move to.
   * @param {Number} y The top position to move to.
   * @param {Boolean} prevent Prevent moving?
   * @private
   */
  function moveTo_(x, y, prevent) {
    var roundedIntervalX_, roundedIntervalY_;
    left_ = Math.round(x);
    top_ = Math.round(y);
    if (opt_drag_.intervalX>1) {
      roundedIntervalX_ = Math.round(left_%opt_drag_.intervalX);
      left_ = (roundedIntervalX_<halfIntervalX_)?(left_-roundedIntervalX_):(left_+(opt_drag_.intervalX-roundedIntervalX_));
    }
    if (opt_drag_.intervalY>1) {
      roundedIntervalY_ = Math.round(top_%opt_drag_.intervalY);
      top_ = (roundedIntervalY_<halfIntervalY_)?(top_-roundedIntervalY_):(top_+(opt_drag_.intervalY-roundedIntervalY_));
    }
    if (opt_drag_.container&&opt_drag_.container.offsetWidth) {
      left_ = Math.max(0,Math.min(left_,opt_drag_.container.offsetWidth-src.offsetWidth));
      top_ = Math.max(0,Math.min(top_,opt_drag_.container.offsetHeight-src.offsetHeight));
    }
    if (typeof currentX_ === "number") {
      if (((left_-currentX_)>opt_drag_.toleranceX||(currentX_-(left_+src.offsetWidth))>opt_drag_.toleranceX)||((top_-currentY_)>opt_drag_.toleranceY||(currentY_-(top_+src.offsetHeight))>opt_drag_.toleranceY)) {
        left_ = originalX_;
        top_ = originalY_;
      }
    }
    if(!opt_drag_.restrictX&&!prevent) {
      src.style.left = left_ + "px";
    }
    if(!opt_drag_.restrictY&&!prevent) {
      src.style.top = top_ + "px";
    }
  }
 
  /**
   * Handles the mousemove event.
   * @param {event} ev The event data sent by the browser.
   * @private
   */
  function mouseMove_(ev) {
    var e=ev||event;
    currentX_ = formerX_+((e.pageX||(e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft))-formerMouseX_);
    currentY_ = formerY_+((e.pageY||(e.clientY+document.body.scrollTop+document.documentElement.scrollTop))-formerMouseY_);
    formerX_ = currentX_;
    formerY_ = currentY_;
    formerMouseX_ = e.pageX||(e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft);
    formerMouseY_ = e.pageY||(e.clientY+document.body.scrollTop+document.documentElement.scrollTop);
    if (moving_) {
      moveTo_(currentX_,currentY_, preventDefault_);
      event_.trigger(me, "drag", {mouseX: formerMouseX_, mouseY: formerMouseY_, startLeft: originalX_, startTop: originalY_, event:e});
    }
  }

  /**
   * Handles the mousedown event.
   * @param {event} ev The event data sent by the browser.
   * @private
   */
  function mouseDown_(ev) {
    var e=ev||event;
    setCursor_(true);
    event_.trigger(me, "mousedown", e);
    if (src.style.position !== "absolute") {
      src.style.position = "absolute";
      return;
    }
    formerMouseX_ = e.pageX||(e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft);
    formerMouseY_ = e.pageY||(e.clientY+document.body.scrollTop+document.documentElement.scrollTop);
    originalX_ = src.offsetLeft;
    originalY_ = src.offsetTop;
    formerX_ = originalX_;
    formerY_ = originalY_;
    mouseMoveEvent_ = event_.addDomListener(target_, "mousemove", mouseMove_);
    if (src.setCapture) {
      src.setCapture();
    }
    if (e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.cancelBubble=true;
      e.returnValue=false;
    }
    moving_ = true;
    event_.trigger(me, "dragstart", {mouseX: formerMouseX_, mouseY: formerMouseY_, startLeft: originalX_, startTop: originalY_, event:e});
  }

  /**
   * Handles the mouseup event.
   * @param {event} ev The event data sent by the browser.
   * @private
   */
  function mouseUp_(ev) {
    var e=ev||event;
    if (moving_) {
      setCursor_(false);
      event_.removeListener(mouseMoveEvent_);
      if (src.releaseCapture) {
        src.releaseCapture();
      }
      moving_ = false;
      event_.trigger(me, "dragend", {mouseX: formerMouseX_, mouseY: formerMouseY_, startLeft: originalX_, startTop: originalY_, event:e});
    }
    currentX_ = currentY_ = null;
    event_.trigger(me, "mouseup", e);
  }

  /**
   * Move the element {@link src} to the given location.
   * @param {Point} point An object with an x and y property
   *     that represents the location to move to.
   */
  me.moveTo = function(point) {
    moveTo_(point.x, point.y, false);
  };

  /**
   * Move the element {@link src} by the given amount.
   * @param {Size} size An object with an x and y property
   *     that represents distance to move the element.
   */
  me.moveBy = function(size) {
    moveTo_(src.offsetLeft + size.width, src.offsetHeight + size.height, false);
  }

  /**
   * Sets the cursor for the dragging state.
   * @param {String} cursor The name of the cursor to use.
   */
  me.setDraggingCursor = function(cursor) {
    draggingCursor_ = cursor;
    setCursor_(moving_);
  };

  /**
   * Sets the cursor for the draggable state.
   * @param {String} cursor The name of the cursor to use.
   */
  me.setDraggableCursor = function(cursor) {
    draggableCursor_ = cursor;
    setCursor_(moving_);
  };

  /**
   * Returns the current left location.
   * @return {Number}
   */
  me.left = function() {
    return left_;
  };

  /**
   * Returns the current top location.
   * @return {Number}
   */
  me.top = function() {
    return top_;
  };

  /**
   * Returns the number of intervals the element has moved
   *     along the X axis. Useful for scrollbar type
   *     applications.
   * @return {Number}
   */
  me.valueX = function() {
    var i = opt_drag_.intervalX||1;
    return Math.round(left_ / i);
  };

  /**
   * Returns the number of intervals the element has moved
   *     along the Y axis. Useful for scrollbar type
   *     applications.
   * @return {Number}
   */
  me.valueY = function() {
    var i = opt_drag_.intervalY||1;
    return Math.round(top_ / i);
  };

  /**
   * Sets the left position of the draggable object based on
   *     intervalX. 
   * @param {Number} value The location to move to.
   */
  me.setValueX = function(value) {
    moveTo_(value * opt_drag_.intervalX, top_, false);
  };

  /**
   * Sets the top position of the draggable object based on
   *     intervalY. 
   * @param {Number} value The location to move to.
   */
  me.setValueY = function(value) {
    moveTo_(left_, value * opt_drag_.intervalY, false);
  };

  /**
   * Prevents the default movement behavior of the object.
   *     The object can still be moved by other methods.
   */
  me.preventDefaultMovement = function(prevent) {
    preventDefault_ = prevent;
  };
}
  /**
   * @name ExtDraggableObjectOptions
   * @class This class represents the optional parameter passed into constructor of 
   * <code>ExtDraggableObject</code>. 
   * @property {Number} [top] Top pixel
   * @property {Number} [left] Left pixel
   * @property {HTMLElement} [container] HTMLElement as container.
   * @property {String} [draggingCursor] Dragging Cursor
   * @property {String} [draggableCursor] Draggable Cursor
   * @property {Number} [intervalX] Interval in X direction 
   * @property {Number} [intervalY] Interval in Y direction
   * @property {Number} [toleranceX] Tolerance X in pixel
   * @property {Number} [toleranceY] Tolerance Y in pixel
   * @property {Boolean} [restrictX] Whether to restrict move in X direction
   * @property {Boolean} [restrictY] Whether to restrict move in Y direction
   */
 
