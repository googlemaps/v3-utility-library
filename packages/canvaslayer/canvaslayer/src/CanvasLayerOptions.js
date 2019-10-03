/**
 * @fileoverview Definitions of all options for CanvasLayer.
 * @author Brendan Kenny
 */

/**
 * Options for a CanvasLayer.
 *
 * @interface
 */
function CanvasLayerOptions() {}

/**
 * If true, updateHandler will be called repeatedly, once per frame. If false,
 * updateHandler will only be called when a map property changes that could
 * require the canvas content to be redrawn.
 * @type {boolean}
 */
CanvasLayerOptions.prototype.animate;

/**
 * Map on which to overlay the canvas.
 * @type {google.maps.Map}
 */
CanvasLayerOptions.prototype.map;

/**
 * The name of the MapPane in which this layer will be displayed. See
 * {@code google.maps.MapPanes} for the panes available. Default is
 * "overlayLayer".
 * @type {string}
 */
CanvasLayerOptions.prototype.paneName;

/**
 * A function that is called whenever the canvas has been resized to fit the
 * map.
 * @type {function}
 */
CanvasLayerOptions.prototype.resizeHandler;

/**
 * A function that is called when a repaint of the canvas is required.
 * @type {function}
 */
CanvasLayerOptions.prototype.updateHandler;
