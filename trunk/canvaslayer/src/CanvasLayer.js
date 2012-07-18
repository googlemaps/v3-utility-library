/**
 * @fileoverview Extends OverlayView to provide a canvas "Layer".
 * @author Brendan Kenny
 */

/**
 * A map layer that provides a canvas over the slippy map and a callback
 * system for efficient animation. Requires canvas and CSS 2D transform
 * support.
 * @constructor
 * @extends google.maps.OverlayView
 * @param {CanvasLayerOptions=} opt_options Options to set in this CanvasLayer.
 */
function CanvasLayer(opt_options) {
  /**
   * If true, canvas is in a map pane and the OverlayView is fully functional.
   * See google.maps.OverlayView.onAdd for more information.
   * @type {boolean}
   * @private
   */
  this.isAdded_ = false;

  /**
   * If true, each update will immediately schedule the next.
   * @type {boolean}
   * @private
   */
  this.isAnimated_ = false;

  /**
   * The name of the MapPane in which this layer will be displayed.
   * @type {string}
   * @private
   */
  this.paneName_ = CanvasLayer.DEFAULT_PANE_NAME_;

  /**
   * A user-supplied function called whenever an update is required. Null or
   * undefined if a callback is not provided.
   * @type {?function=}
   * @private
   */
  this.updateHandler_ = null;

  /**
   * A user-supplied function called whenever an update is required and the
   * map has been resized since the last update. Null or undefined if a
   * callback is not provided.
   * @type {?function}
   * @private
   */
  this.resizeHandler_ = null;

  /**
   * The LatLng coordinate of the top left of the current view of the map. Will
   * be null when this.isAdded_ is false.
   * @type {google.maps.LatLng}
   * @private
   */
  this.topLeft_ = null;

  /**
   * The map-pan event listener. Will be null when this.isAdded_ is false. Will
   * be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.centerListener_ = null;

  /**
   * The map-resize event listener. Will be null when this.isAdded_ is false.
   * @type {?function}
   * @private
   */
  this.resizeListener_ = null;

  /**
   * If true, the map size has changed and this.resizeHandler_ must be called
   * on the next update.
   * @type {boolean}
   * @private
   */
  this.needsResize_ = true;

  /**
   * A browser-defined id for the currently requested callback. Null when no
   * callback is queued.
   * @type {?number}
   * @private
   */
  this.requestAnimationFrameId_ = null;

  var canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';

  /**
   * The canvas element.
   * @type {!HTMLCanvasElement}
   */
  this.canvas = canvas;

  /**
   * Simple bind for functions with no args for bind-less browsers (Safari).
   * @param {Object} thisArg The this value used for the target function.
   * @param {function} func The function to be bound.
   */
  function simpleBindShim(thisArg, func) {
    return function() { func.apply(thisArg); };
  }

  /**
   * A reference to this.repositionCanvas_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.repositionFunction_ = simpleBindShim(this, this.repositionCanvas_);

  /**
   * A reference to this.resize_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.resizeFunction_ = simpleBindShim(this, this.resize_);

  /**
   * A reference to this.update_ with this bound as its this value.
   * @type {function}
   * @private
   */
  this.requestUpdateFunction_ = simpleBindShim(this, this.update_);

  // set provided options, if any
  if (opt_options) {
    this.setOptions(opt_options);
  }
}

CanvasLayer.prototype = new google.maps.OverlayView();

/**
 * The default MapPane to contain the canvas.
 * @type {string}
 * @const
 * @private
 */
CanvasLayer.DEFAULT_PANE_NAME_ = 'overlayLayer';

/**
 * Transform CSS property name, with vendor prefix if required. If browser
 * does not support transforms, property will be ignored.
 * @type {string}
 * @const
 * @private
 */
CanvasLayer.CSS_TRANSFORM_ = (function() {
  var div = document.createElement('div');
  var transformProps = [
    'transform',
    'WebkitTransform',
    'MozTransform',
    'OTransform',
    'msTransform'
  ];
  for (var i = 0; i < transformProps.length; i++) {
    var prop = transformProps[i];
    if (div.style[prop] !== undefined) {
      return prop;
    }
  }

  // return unprefixed version by default
  return transformProps[0];
})();

/**
 * The requestAnimationFrame function, with vendor-prefixed or setTimeout-based
 * fallbacks. MUST be called with window as thisArg.
 * @type {function}
 * @param {function} callback The function to add to the frame request queue.
 * @return {number} The browser-defined id for the requested callback.
 * @private
 */
CanvasLayer.prototype.requestAnimFrame_ =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };

/**
 * The cancelAnimationFrame function, with vendor-prefixed fallback. Does not
 * fall back to clearTimeout as some platforms implement requestAnimationFrame
 * but not cancelAnimationFrame, and the cost is an extra frame on onRemove.
 * MUST be called with window as thisArg.
 * @type {function}
 * @param {number=} requestId The id of the frame request to cancel.
 * @private
 */
CanvasLayer.prototype.cancelAnimFrame_ =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function(requestId) {};

/**
 * Sets any options provided. See CanvasLayerOptions for more information.
 * @param {CanvasLayerOptions} options The options to set.
 */
CanvasLayer.prototype.setOptions = function(options) {
  if (options.animate !== undefined) {
    this.setAnimate(options.animate);
  }

  if (options.paneName !== undefined) {
    this.setPane(options.paneName);
  }

  if (options.updateHandler !== undefined) {
    this.setUpdateHandler(options.updateHandler);
  }

  if (options.resizeHandler !== undefined) {
    this.setResizeHandler(options.resizeHandler);
  }

  if (options.map !== undefined) {
    this.setMap(options.map);
  }
};

/**
 * Set the animated state of the layer. If true, updateHandler will be called
 * repeatedly, once per frame. If false, updateHandler will only be called when
 * a map property changes that could require the canvas content to be redrawn.
 * @param {boolean} animate Whether the canvas is animated.
 */
CanvasLayer.prototype.setAnimate = function(animate) {
  this.isAnimated_ = !!animate;

  if (this.isAnimated_) {
    this.scheduleUpdate();
  }
};

/**
 * @return {boolean} Whether the canvas is animated.
 */
CanvasLayer.prototype.isAnimated = function() {
  return this.isAnimated_;
};

/**
 * Set the MapPane in which this layer will be displayed, by name. See
 * {@code google.maps.MapPanes} for the panes available.
 * @param {string} paneName The name of the desired MapPane.
 */
CanvasLayer.prototype.setPaneName = function(paneName) {
  this.paneName_ = paneName;

  this.setPane_();
};

/**
 * @return {string} The name of the current container pane.
 */
CanvasLayer.prototype.getPaneName = function() {
  return this.paneName_;
};

/**
 * Adds the canvas to the specified container pane. Since this is guaranteed to
 * execute only after onAdd is called, this is when paneName's existence is
 * checked (and an error is thrown if it doesn't exist).
 * @private
 */
CanvasLayer.prototype.setPane_ = function() {
  if (!this.isAdded_) {
    return;
  }

  // onAdd has been called, so panes can be used
  var panes = this.getPanes();
  if (!panes[this.paneName_]) {
    throw new Error('"' + this.paneName_ + '" is not a valid MapPane name.');
  }

  panes[this.paneName_].appendChild(this.canvas);
};

/**
 * Set a function that will be called whenever the parent map and the overlay's
 * canvas have been resized. If opt_resizeHandler is null or unspecified, any
 * existing callback is removed.
 * @param {?function=} opt_resizeHandler The resize callback function.
 */
CanvasLayer.prototype.setResizeHandler = function(opt_resizeHandler) {
  this.resizeHandler_ = opt_resizeHandler;
};

/**
 * Set a function that will be called when a repaint of the canvas is required.
 * If opt_updateHandler is null or unspecified, any existing callback is
 * removed.
 * @param {?function=} opt_updateHandler The update callback function.
 */
CanvasLayer.prototype.setUpdateHandler = function(opt_updateHandler) {
  this.updateHandler_ = opt_updateHandler;
};

/**
 * @inheritDoc
 */
CanvasLayer.prototype.onAdd = function() {
  if (this.isAdded_) {
    return;
  }

  this.isAdded_ = true;
  this.setPane_();

  this.resizeListener_ = google.maps.event.addListener(this.getMap(),
      'resize', this.resizeFunction_);
  this.centerListener_ = google.maps.event.addListener(this.getMap(),
      'center_changed', this.repositionFunction_);

  this.resize_();
  this.repositionCanvas_();
};

/**
 * @inheritDoc
 */
CanvasLayer.prototype.onRemove = function() {
  if (!this.isAdded_) {
    return;
  }

  this.isAdded_ = false;
  this.topLeft_ = null;

  // remove canvas and listeners for pan and resize from map
  this.canvas.parentElement.removeChild(this.canvas);
  if (this.centerListener_) {
    google.maps.event.removeListener(this.centerListener_);
    this.centerListener_ = null;
  }
  if (this.resizeListener_) {
    google.maps.event.removeListener(this.resizeListener_);
    this.resizeListener_ = null;
  }

  // cease canvas update callbacks
  if (this.requestAnimationFrameId_) {
    this.cancelAnimFrame_.call(window, this.requestAnimationFrameId_);
    this.requestAnimationFrameId_ = null;
  }
};

/**
 * The internal callback for resize events that resizes the canvas to keep the
 * map properly covered.
 * @private
 */
CanvasLayer.prototype.resize_ = function() {
  // TODO(bckenny): it's common to use a smaller canvas but use CSS to scale
  // what is drawn by the browser to save on fill rate. Add an option to do
  // this.

  if (!this.isAdded_) {
    return;
  }

  var map = this.getMap();
  var width = map.getDiv().offsetWidth;
  var height = map.getDiv().offsetHeight;
  var oldWidth = this.canvas.width;
  var oldHeight = this.canvas.height;

  // resizing may allocate a new back buffer, so do so conservatively
  if (oldWidth !== width || oldHeight !== height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.needsResize_ = true;
    this.scheduleUpdate();
  }
};

/**
 * @inheritDoc
 */
CanvasLayer.prototype.draw = function() {
  this.repositionCanvas_();
};

/**
 * Internal callback for map view changes. Since the Maps API moves the overlay
 * along with the map, this function calculates the opposite translation to
 * keep the canvas in place.
 * @private
 */
CanvasLayer.prototype.repositionCanvas_ = function() {
  // TODO(bckenny): *should* only be executed on RAF, but in current browsers
  //     this causes noticeable hitches in map and overlay relative
  //     positioning.

  var bounds = this.getMap().getBounds();
  this.topLeft_ = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getSouthWest().lng());

  // canvas position relative to draggable map's conatainer depends on
  // overlayView's projection, not the map's
  var projection = this.getProjection();
  var divTopLeft = projection.fromLatLngToDivPixel(this.topLeft_);
  this.canvas.style[CanvasLayer.CSS_TRANSFORM_] = 'translate(' +
      Math.round(divTopLeft.x) + 'px,' + Math.round(divTopLeft.y) + 'px)';

  this.scheduleUpdate();
};

/**
 * Internal callback that serves as main animation scheduler via
 * requestAnimationFrame. Calls resize and update callbacks if set, and
 * schedules the next frame if overlay is animated.
 * @private
 */
CanvasLayer.prototype.update_ = function() {
  this.requestAnimationFrameId_ = null;

  if (!this.isAdded_) {
    return;
  }

  if (this.isAnimated_) {
    this.scheduleUpdate();
  }

  if (this.needsResize_ && this.resizeHandler_) {
    this.needsResize_ = false;
    this.resizeHandler_();
  }

  if (this.updateHandler_) {
    this.updateHandler_();
  }
};

/**
 * A convenience method to get the current LatLng coordinate of the top left of
 * the current view of the map.
 * @return {google.maps.LatLng} The top left coordinate.
 */
CanvasLayer.prototype.getTopLeft = function() {
  return this.topLeft_;
};

/**
 * Schedule a requestAnimationFrame callback to updateHandler. If one is
 * already scheduled, there is no effect.
 */
CanvasLayer.prototype.scheduleUpdate = function() {
  if (this.isAdded_ && !this.requestAnimationFrameId_) {
    this.requestAnimationFrameId_ =
        this.requestAnimFrame_.call(window, this.requestUpdateFunction_);
  }
};
