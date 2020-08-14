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
 * @name MarkerClustererPlus for Google Maps V3
 * @author Gary Little
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of markers.
 * <p>
 * This is an enhanced V3 implementation of the V2 MarkerClusterer by Xiaoxi Wu. It is
 * based on the V3 MarkerClusterer port by Luke Mahe. MarkerClustererPlus was created
 * by Gary Little.
 * <p>
 * v2.0 release: MarkerClustererPlus v2.0 is backward compatible with MarkerClusterer v1.0. It
 *  adds support for the `ignoreHidden`, `title`, `batchSizeIE`,
 *  and `calculator` properties as well as support for four more events. It also allows
 *  greater control over the styling of the text that appears on the cluster marker. The
 *  documentation has been significantly improved and the overall code has been simplified and
 *  polished. Very large numbers of markers can now be managed without causing Javascript timeout
 *  errors on Internet Explorer. Note that the name of the `clusterclick` event has been
 *  deprecated. The new name is `click`, so please change your application code now.
 */

import { ClusterIconInfo, ClusterIconStyle } from "./cluster-icon";

import { Cluster } from "./cluster";
import { OverlayViewSafe } from "./overlay-view-safe";

/**
 * @param text The text attribute of the cluster
 */
type AriaLabelFn = (text: string) => string;

export type Calculator = (
  markers: google.maps.Marker[],
  clusterIconStylesCount: number
) => ClusterIconInfo;

export interface ClusterAugmentedMarker extends google.maps.Marker {
  isAdded?: boolean;
}

/**
 * This event is fired on the {@link MarkerClusterer} instance when the `MarkerClusterer` stops clustering markers.
 *
 * Example:
 * ```typescript
 *  mc.addListener('clusteringend', (mc: MarkerClusterer) => {})
 * ```
 *
 * @param mc The MarkerClusterer whose markers are being clustered.
 * @event clusteringend
 */
export declare function clusteringend(mc: MarkerClusterer): void;

/**
 * This event is fired on the {@link MarkerClusterer} instance when the `MarkerClusterer` begins clustering markers.
 *
 * Example:
 * ```typescript
 *  mc.addListener('clusteringbegin', (mc: MarkerClusterer) => {})
 * ```
 *
 * @param mc The MarkerClusterer whose markers are being clustered.
 * @event clusteringbegin
 */
export declare function clusteringbegin(mc: MarkerClusterer): void;

/**
 * Optional parameter passed to the {@link MarkerClusterer} constructor.
 */
export interface MarkerClustererOptions {
  /**
   * The grid size of a cluster in pixels. The grid is a square.
   *
   * @default `60`
   */
  gridSize?: number;
  /**
   * The maximum zoom level at which clustering is enabled or
   * `null` if clustering is to be enabled at all zoom levels.
   *
   * @default `null`
   */
  maxZoom?: number;

  /**
   * Whether to zoom the map when a cluster marker is
   * clicked. You may want to set this to `false` if you have installed a handler
   * for the `click` event and it deals with zooming on its own.
   *
   * @default `true`
   */
  zoomOnClick?: boolean;
  /***
   * Whether the position of a cluster marker should be
   * the average position of all markers in the cluster. If set to `false`, the
   * cluster marker is positioned at the location of the first marker added to the cluster.
   *
   * @default `false`
   */
  averageCenter?: boolean;
  /**
   * The minimum number of markers needed in a cluster
   * before the markers are hidden and a cluster marker appears.
   *
   * @default `2`
   */
  minimumClusterSize?: number;

  /**
   *  the z-index of a cluster.
   *
   *  @default `google.maps.Marker.MAX_ZINDEX + 1`
   */
  zIndex?: number;

  /**
   * Whether to ignore hidden markers in clusters. You
   * may want to set this to `true` to ensure that hidden markers are not included
   * in the marker count that appears on a cluster marker (this count is the value of the
   * `text` property of the result returned by the default  {@link calculator}).
   * If set to `true` and you change the visibility of a marker being clustered, be
   * sure to also call {@link MarkerClusterer#repaint()}.
   *
   * @default `false`
   */
  ignoreHidden?: boolean;
  /**
   * The tooltip to display when the mouse moves over a cluster
   * marker. (Alternatively, you can use a custom `calculator` function to specify a
   * different tooltip for each cluster marker.)
   *
   * @default `""`
   */
  title?: string;
  /**
   * The function used to determine
   * the text to be displayed on a cluster marker and the index indicating which style to use
   * for the cluster marker. The input parameters for the function are (1) the array of markers
   * represented by a cluster marker and (2) the number of cluster icon styles. It returns a
   * {@link ClusterIconInfo} object. The default `calculator` returns a
   * `text` property which is the number of markers in the cluster and an
   * `index` property which is one higher than the lowest integer such that
   * `10^i` exceeds the number of markers in the cluster, or the size of the styles
   * array, whichever is less. The `styles` array element used has an index of
   * `index` minus 1. For example, the default `calculator` returns a
   * `text` value of `"125"` and an `index` of `3`
   * for a cluster icon representing 125 markers so the element used in the `styles`
   * array is `2`. A `calculator` may also return a `title`
   * property that contains the text of the tooltip to be used for the cluster marker. If
   * `title` is not defined, the tooltip is set to the value of the `title`
   * property for the MarkerClusterer.
   *
   * @default {@link MarkerClusterer.CALCULATOR}
   */
  calculator?: Calculator;
  /**
   * The name of the CSS class defining general styles
   * for the cluster markers. Use this class to define CSS styles that are not set up by the code
   * that processes the `styles` array.
   *
   * @default `"cluster"`
   */
  clusterClass?: string;
  /**
   * An array of {@link ClusterIconStyle} elements defining the styles
   * of the cluster markers to be used. The element to be used to style a given cluster marker
   * is determined by the function defined by the `calculator` property.
   * The default is an array of {@link ClusterIconStyle} elements whose properties are derived
   * from the values for `imagePath`, `imageExtension`, and `imageSizes`.
   *
   * @default `styles`
   */
  styles?: ClusterIconStyle[];
  /**
   * Whether to allow the use of cluster icons that
   * have sizes that are some multiple (typically double) of their actual display size. Icons such
   * as these look better when viewed on high-resolution monitors such as Apple's Retina displays.
   * Note: if this property is `true`, sprites cannot be used as cluster icons.
   *
   * @default `false`
   */
  enableRetinaIcons?: boolean;
  /**
   * Set this property to the number of markers to be processed in a single batch when using
   * a browser other than Internet Explorer (for Internet Explorer, use the batchSizeIE property instead).
   *
   * @default `MarkerClusterer.BATCH_SIZE`
   */
  batchSize?: number;
  /**
   * When Internet Explorer is
   * being used, markers are processed in several batches with a small delay inserted between
   * each batch in an attempt to avoid Javascript timeout errors. Set this property to the
   * number of markers to be processed in a single batch; select as high a number as you can
   * without causing a timeout error in the browser. This number might need to be as low as 100
   * if 15,000 markers are being managed, for example.
   *
   * @default `MarkerClusterer.BATCH_SIZE_IE`
   */
  batchSizeIE?: number;
  /**
   * The full URL of the root name of the group of image files to use for cluster icons.
   * The complete file name is of the form `imagePath`n.`imageExtension`
   * where n is the image file number (1, 2, etc.).
   *
   * @default `MarkerClusterer.IMAGE_PATH`
   */
  imagePath?: string;
  /**
   * The extension name for the cluster icon image files (e.g., `"png"` or
   * `"jpg"`).
   *
   * @default `MarkerClusterer.IMAGE_EXTENSION`
   */
  imageExtension?: string;
  /**
   * An array of numbers containing the widths of the group of
   * `imagePath`n.`imageExtension` image files.
   * (The images are assumed to be square.)
   *
   * @default `MarkerClusterer.IMAGE_SIZES`
   */
  imageSizes?: number[];
  /**
   * A function to take the text attribute associated with the cluster and output a string to attach an
   * ariaLabel to the cluster
   */
  ariaLabelFn?: AriaLabelFn;
}

/**
 * @ignore
 */
const getOption = <T, K extends keyof T>(
  options: T,
  prop: K,
  def: T[K]
): T[K] => {
  if (options[prop] !== undefined) {
    return options[prop];
  } else {
    return def;
  }
};

export class MarkerClusterer extends OverlayViewSafe {
  /**
   * The number of markers to process in one batch.
   */
  static BATCH_SIZE = 2000;

  /**
   * The number of markers to process in one batch (IE only).
   */
  static BATCH_SIZE_IE = 500;

  /**
   * The default root name for the marker cluster images.
   */
  static IMAGE_PATH = "../images/m";

  /**
   * The default extension name for the marker cluster images.
   */
  static IMAGE_EXTENSION = "png";

  /**
   * The default array of sizes for the marker cluster images.
   */
  static IMAGE_SIZES: number[] = [53, 56, 66, 78, 90];

  private markers_: ClusterAugmentedMarker[] = [];
  private clusters_: Cluster[] = [];
  private listeners_: google.maps.MapsEventListener[] = [];

  private activeMap_: google.maps.Map = null;
  private ready_ = false;

  public ariaLabelFn = this.options.ariaLabelFn || ((): string => "");

  private zIndex_ = this.options.zIndex || google.maps.Marker.MAX_ZINDEX + 1;
  private gridSize_ = this.options.gridSize || 60;
  private minClusterSize_ = this.options.minimumClusterSize || 2;
  private maxZoom_ = this.options.maxZoom || null;
  private styles_: ClusterIconStyle[] = this.options.styles || [];
  private title_ = this.options.title || "";

  private zoomOnClick_ = getOption(this.options, "zoomOnClick", true);
  private averageCenter_ = getOption(this.options, "averageCenter", false);

  private ignoreHidden_ = getOption(this.options, "ignoreHidden", false);
  private enableRetinaIcons_ = getOption(
    this.options,
    "enableRetinaIcons",
    false
  );

  private imagePath_ = this.options.imagePath || MarkerClusterer.IMAGE_PATH;
  private imageExtension_ =
    this.options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
  private imageSizes_ = this.options.imageSizes || MarkerClusterer.IMAGE_SIZES;
  private calculator_ = this.options.calculator || MarkerClusterer.CALCULATOR;
  private batchSize_ = this.options.batchSize || MarkerClusterer.BATCH_SIZE;
  private batchSizeIE_ =
    this.options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
  private clusterClass_ = this.options.clusterClass || "cluster";

  private prevZoom_: number;
  private timerRefStatic: number;

  /**
   * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
   * @param map The Google map to attach to.
   * @param markers The markers to be added to the cluster.
   * @param options The optional parameters.
   */
  constructor(
    map: google.maps.Map,
    markers: google.maps.Marker[] = [],
    private options: MarkerClustererOptions = {}
  ) {
    super();

    if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
      // Try to avoid IE timeout when processing a huge number of markers:
      this.batchSize_ = this.batchSizeIE_;
    }

    this.setupStyles_();

    this.addMarkers(markers, true);
    this.setMap(map); // Note: this causes onAdd to be called
  }

  /**
   * Implementation of the onAdd interface method.
   * @ignore
   */
  onAdd(): void {
    this.activeMap_ = this.getMap() as google.maps.Map;
    this.ready_ = true;

    this.repaint();

    this.prevZoom_ = this.getMap().getZoom();

    // Add the map event listeners
    this.listeners_ = [
      google.maps.event.addListener(this.getMap(), "zoom_changed", () => {
        const map: google.maps.Map & {
          minZoom: number;
          maxZoom: number;
          mapTypes: { [type: string]: google.maps.MapType };
        } = this.getMap() as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        // Fix for bug #407
        // Determines map type and prevents illegal zoom levels
        const minZoom = map.minZoom || 0;
        const maxZoom = Math.min(
          map.maxZoom || 100,
          map.mapTypes[map.getMapTypeId()].maxZoom
        );
        const zoom = Math.min(
          Math.max(this.getMap().getZoom(), minZoom),
          maxZoom
        );

        if (this.prevZoom_ != zoom) {
          this.prevZoom_ = zoom;
          this.resetViewport_(false);
        }
      }),
      google.maps.event.addListener(this.getMap(), "idle", () => {
        this.redraw_();
      })
    ];
  }

  /**
   * Implementation of the onRemove interface method.
   * Removes map event listeners and all cluster icons from the DOM.
   * All managed markers are also put back on the map.
   * @ignore
   */
  onRemove(): void {
    // Put all the managed markers back on the map:
    for (let i = 0; i < this.markers_.length; i++) {
      if (this.markers_[i].getMap() !== this.activeMap_) {
        this.markers_[i].setMap(this.activeMap_);
      }
    }

    // Remove all clusters:
    for (let i = 0; i < this.clusters_.length; i++) {
      this.clusters_[i].remove();
    }
    this.clusters_ = [];

    // Remove map event listeners:
    for (let i = 0; i < this.listeners_.length; i++) {
      google.maps.event.removeListener(this.listeners_[i]);
    }
    this.listeners_ = [];

    this.activeMap_ = null;
    this.ready_ = false;
  }

  /**
   * Implementation of the draw interface method.
   * @ignore
   */
  draw(): void {}

  /**
   * Sets up the styles object.
   */
  private setupStyles_(): void {
    if (this.styles_.length > 0) {
      return;
    }

    for (let i = 0; i < this.imageSizes_.length; i++) {
      const size = this.imageSizes_[i];
      this.styles_.push(
        MarkerClusterer.withDefaultStyle({
          url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
          height: size,
          width: size
        })
      );
    }
  }

  /**
   *  Fits the map to the bounds of the markers managed by the clusterer.
   */
  fitMapToMarkers(padding: number | google.maps.Padding): void {
    const markers = this.getMarkers();
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      // March 3, 2018: Bug fix -- honor the ignoreHidden property
      if (markers[i].getVisible() || !this.getIgnoreHidden()) {
        bounds.extend(markers[i].getPosition());
      }
    }

    (this.getMap() as google.maps.Map).fitBounds(bounds, padding);
  }

  /**
   * Returns the value of the `gridSize` property.
   *
   * @return The grid size.
   */
  getGridSize(): number {
    return this.gridSize_;
  }

  /**
   * Sets the value of the `gridSize` property.
   *
   * @param gridSize The grid size.
   */
  setGridSize(gridSize: number): void {
    this.gridSize_ = gridSize;
  }

  /**
   * Returns the value of the `minimumClusterSize` property.
   *
   * @return The minimum cluster size.
   */
  getMinimumClusterSize(): number {
    return this.minClusterSize_;
  }

  /**
   * Sets the value of the `minimumClusterSize` property.
   *
   * @param minimumClusterSize The minimum cluster size.
   */
  setMinimumClusterSize(minimumClusterSize: number): void {
    this.minClusterSize_ = minimumClusterSize;
  }

  /**
   *  Returns the value of the `maxZoom` property.
   *
   *  @return The maximum zoom level.
   */
  getMaxZoom(): number {
    return this.maxZoom_;
  }

  /**
   *  Sets the value of the `maxZoom` property.
   *
   *  @param maxZoom The maximum zoom level.
   */
  setMaxZoom(maxZoom: number): void {
    this.maxZoom_ = maxZoom;
  }

  getZIndex(): number {
    return this.zIndex_;
  }

  setZIndex(zIndex: number): void {
    this.zIndex_ = zIndex;
  }

  /**
   *  Returns the value of the `styles` property.
   *
   *  @return The array of styles defining the cluster markers to be used.
   */
  getStyles(): ClusterIconStyle[] {
    return this.styles_;
  }

  /**
   *  Sets the value of the `styles` property.
   *
   *  @param styles The array of styles to use.
   */
  setStyles(styles: ClusterIconStyle[]): void {
    this.styles_ = styles;
  }

  /**
   * Returns the value of the `title` property.
   *
   * @return The content of the title text.
   */
  getTitle(): string {
    return this.title_;
  }

  /**
   *  Sets the value of the `title` property.
   *
   *  @param title The value of the title property.
   */
  setTitle(title: string): void {
    this.title_ = title;
  }

  /**
   * Returns the value of the `zoomOnClick` property.
   *
   * @return True if zoomOnClick property is set.
   */
  getZoomOnClick(): boolean {
    return this.zoomOnClick_;
  }

  /**
   *  Sets the value of the `zoomOnClick` property.
   *
   *  @param zoomOnClick The value of the zoomOnClick property.
   */
  setZoomOnClick(zoomOnClick: boolean): void {
    this.zoomOnClick_ = zoomOnClick;
  }

  /**
   * Returns the value of the `averageCenter` property.
   *
   * @return True if averageCenter property is set.
   */
  getAverageCenter(): boolean {
    return this.averageCenter_;
  }

  /**
   *  Sets the value of the `averageCenter` property.
   *
   *  @param averageCenter The value of the averageCenter property.
   */
  setAverageCenter(averageCenter: boolean): void {
    this.averageCenter_ = averageCenter;
  }

  /**
   * Returns the value of the `ignoreHidden` property.
   *
   * @return True if ignoreHidden property is set.
   */
  getIgnoreHidden(): boolean {
    return this.ignoreHidden_;
  }

  /**
   *  Sets the value of the `ignoreHidden` property.
   *
   *  @param ignoreHidden The value of the ignoreHidden property.
   */
  setIgnoreHidden(ignoreHidden: boolean): void {
    this.ignoreHidden_ = ignoreHidden;
  }

  /**
   * Returns the value of the `enableRetinaIcons` property.
   *
   * @return True if enableRetinaIcons property is set.
   */
  getEnableRetinaIcons(): boolean {
    return this.enableRetinaIcons_;
  }

  /**
   *  Sets the value of the `enableRetinaIcons` property.
   *
   *  @param enableRetinaIcons The value of the enableRetinaIcons property.
   */
  setEnableRetinaIcons(enableRetinaIcons: boolean): void {
    this.enableRetinaIcons_ = enableRetinaIcons;
  }

  /**
   * Returns the value of the `imageExtension` property.
   *
   * @return The value of the imageExtension property.
   */
  getImageExtension(): string {
    return this.imageExtension_;
  }

  /**
   *  Sets the value of the `imageExtension` property.
   *
   *  @param imageExtension The value of the imageExtension property.
   */
  setImageExtension(imageExtension: string): void {
    this.imageExtension_ = imageExtension;
  }

  /**
   * Returns the value of the `imagePath` property.
   *
   * @return The value of the imagePath property.
   */
  getImagePath(): string {
    return this.imagePath_;
  }

  /**
   *  Sets the value of the `imagePath` property.
   *
   *  @param imagePath The value of the imagePath property.
   */
  setImagePath(imagePath: string): void {
    this.imagePath_ = imagePath;
  }

  /**
   * Returns the value of the `imageSizes` property.
   *
   * @return The value of the imageSizes property.
   */
  getImageSizes(): number[] {
    return this.imageSizes_;
  }

  /**
   *  Sets the value of the `imageSizes` property.
   *
   *  @param imageSizes The value of the imageSizes property.
   */
  setImageSizes(imageSizes: number[]): void {
    this.imageSizes_ = imageSizes;
  }

  /**
   * Returns the value of the `calculator` property.
   *
   * @return the value of the calculator property.
   */
  getCalculator(): Calculator {
    return this.calculator_;
  }

  /**
   * Sets the value of the `calculator` property.
   *
   * @param calculator The value of the calculator property.
   */
  setCalculator(calculator: Calculator): void {
    this.calculator_ = calculator;
  }

  /**
   * Returns the value of the `batchSizeIE` property.
   *
   * @return the value of the batchSizeIE property.
   */
  getBatchSizeIE(): number {
    return this.batchSizeIE_;
  }

  /**
   * Sets the value of the `batchSizeIE` property.
   *
   *  @param batchSizeIE The value of the batchSizeIE property.
   */
  setBatchSizeIE(batchSizeIE: number): void {
    this.batchSizeIE_ = batchSizeIE;
  }

  /**
   * Returns the value of the `clusterClass` property.
   *
   * @return the value of the clusterClass property.
   */
  getClusterClass(): string {
    return this.clusterClass_;
  }

  /**
   * Sets the value of the `clusterClass` property.
   *
   *  @param clusterClass The value of the clusterClass property.
   */
  setClusterClass(clusterClass: string): void {
    this.clusterClass_ = clusterClass;
  }

  /**
   *  Returns the array of markers managed by the clusterer.
   *
   *  @return The array of markers managed by the clusterer.
   */
  getMarkers(): google.maps.Marker[] {
    return this.markers_;
  }

  /**
   *  Returns the number of markers managed by the clusterer.
   *
   *  @return The number of markers.
   */
  getTotalMarkers(): number {
    return this.markers_.length;
  }

  /**
   * Returns the current array of clusters formed by the clusterer.
   *
   * @return The array of clusters formed by the clusterer.
   */
  getClusters(): Cluster[] {
    return this.clusters_;
  }

  /**
   * Returns the number of clusters formed by the clusterer.
   *
   * @return The number of clusters formed by the clusterer.
   */
  getTotalClusters(): number {
    return this.clusters_.length;
  }

  /**
   * Adds a marker to the clusterer. The clusters are redrawn unless
   *  `nodraw` is set to `true`.
   *
   * @param marker The marker to add.
   * @param nodraw Set to `true` to prevent redrawing.
   */
  addMarker(marker: google.maps.Marker, nodraw?: boolean): void {
    this.pushMarkerTo_(marker);
    if (!nodraw) {
      this.redraw_();
    }
  }

  /**
   * Adds an array of markers to the clusterer. The clusters are redrawn unless
   *  `nodraw` is set to `true`.
   *
   * @param markers The markers to add.
   * @param nodraw Set to `true` to prevent redrawing.
   */
  addMarkers(markers: google.maps.Marker[], nodraw?: boolean): void {
    for (const key in markers) {
      if (Object.prototype.hasOwnProperty.call(markers, key)) {
        this.pushMarkerTo_(markers[key]);
      }
    }
    if (!nodraw) {
      this.redraw_();
    }
  }

  /**
   * Pushes a marker to the clusterer.
   *
   * @param marker The marker to add.
   */
  private pushMarkerTo_(
    marker: google.maps.Marker & { isAdded?: boolean }
  ): void {
    // If the marker is draggable add a listener so we can update the clusters on the dragend:
    if (marker.getDraggable()) {
      google.maps.event.addListener(marker, "dragend", () => {
        if (this.ready_) {
          marker.isAdded = false;
          this.repaint();
        }
      });
    }
    marker.isAdded = false;
    this.markers_.push(marker);
  }

  /**
   * Removes a marker from the cluster.  The clusters are redrawn unless
   *  `nodraw` is set to `true`. Returns `true` if the
   *  marker was removed from the clusterer.
   *
   * @param marker The marker to remove.
   * @param nodraw Set to `true` to prevent redrawing.
   * @return True if the marker was removed from the clusterer.
   */
  removeMarker(marker: google.maps.Marker, nodraw?: boolean): boolean {
    const removed = this.removeMarker_(marker);

    if (!nodraw && removed) {
      this.repaint();
    }

    return removed;
  }

  /**
   * Removes an array of markers from the cluster. The clusters are redrawn unless
   *  `nodraw` is set to `true`. Returns `true` if markers were removed from the clusterer.
   *
   * @param markers The markers to remove.
   * @param nodraw Set to `true` to prevent redrawing.
   * @return True if markers were removed from the clusterer.
   */
  removeMarkers(markers: google.maps.Marker[], nodraw?: boolean): boolean {
    let removed = false;

    for (let i = 0; i < markers.length; i++) {
      const r = this.removeMarker_(markers[i]);
      removed = removed || r;
    }

    if (!nodraw && removed) {
      this.repaint();
    }

    return removed;
  }

  /**
   * Removes a marker and returns true if removed, false if not.
   *
   * @param marker The marker to remove
   * @return Whether the marker was removed or not
   */
  private removeMarker_(marker: google.maps.Marker): boolean {
    let index = -1;
    if (this.markers_.indexOf) {
      index = this.markers_.indexOf(marker);
    } else {
      for (let i = 0; i < this.markers_.length; i++) {
        if (marker === this.markers_[i]) {
          index = i;
          break;
        }
      }
    }

    if (index === -1) {
      // Marker is not in our list of markers, so do nothing:
      return false;
    }

    marker.setMap(null);
    this.markers_.splice(index, 1); // Remove the marker from the list of managed markers
    return true;
  }

  /**
   * Removes all clusters and markers from the map and also removes all markers
   *  managed by the clusterer.
   */
  clearMarkers(): void {
    this.resetViewport_(true);
    this.markers_ = [];
  }

  /**
   * Recalculates and redraws all the marker clusters from scratch.
   *  Call this after changing any properties.
   */
  repaint(): void {
    const oldClusters = this.clusters_.slice();
    this.clusters_ = [];
    this.resetViewport_(false);
    this.redraw_();

    // Remove the old clusters.
    // Do it in a timeout to prevent blinking effect.
    setTimeout(function() {
      for (let i = 0; i < oldClusters.length; i++) {
        oldClusters[i].remove();
      }
    }, 0);
  }

  /**
   * Returns the current bounds extended by the grid size.
   *
   * @param bounds The bounds to extend.
   * @return The extended bounds.
   * @ignore
   */
  getExtendedBounds(
    bounds: google.maps.LatLngBounds
  ): google.maps.LatLngBounds {
    const projection = this.getProjection();

    // Turn the bounds into latlng.
    const tr = new google.maps.LatLng(
      bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng()
    );
    const bl = new google.maps.LatLng(
      bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng()
    );

    // Convert the points to pixels and the extend out by the grid size.
    const trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    const blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    const ne = projection.fromDivPixelToLatLng(trPix);
    const sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
  }

  /**
   * Redraws all the clusters.
   */
  private redraw_(): void {
    this.createClusters_(0);
  }

  /**
   * Removes all clusters from the map. The markers are also removed from the map
   *  if `hide` is set to `true`.
   *
   * @param hide Set to `true` to also remove the markers from the map.
   */
  private resetViewport_(hide?: boolean): void {
    // Remove all the clusters
    for (let i = 0; i < this.clusters_.length; i++) {
      this.clusters_[i].remove();
    }
    this.clusters_ = [];

    // Reset the markers to not be added and to be removed from the map.
    for (let i = 0; i < this.markers_.length; i++) {
      const marker = this.markers_[i];
      marker.isAdded = false;
      if (hide) {
        marker.setMap(null);
      }
    }
  }

  /**
   * Calculates the distance between two latlng locations in km.
   *
   * @param p1 The first lat lng point.
   * @param p2 The second lat lng point.
   * @return The distance between the two points in km.
   * @link http://www.movable-type.co.uk/scripts/latlong.html
   */
  private distanceBetweenPoints_(
    p1: google.maps.LatLng,
    p2: google.maps.LatLng
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((p2.lat() - p1.lat()) * Math.PI) / 180;
    const dLon = ((p2.lng() - p1.lng()) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat() * Math.PI) / 180) *
        Math.cos((p2.lat() * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Determines if a marker is contained in a bounds.
   *
   * @param marker The marker to check.
   * @param bounds The bounds to check against.
   * @return True if the marker is in the bounds.
   */
  private isMarkerInBounds_(
    marker: google.maps.Marker,
    bounds: google.maps.LatLngBounds
  ): boolean {
    return bounds.contains(marker.getPosition());
  }

  /**
   * Adds a marker to a cluster, or creates a new cluster.
   *
   * @param marker The marker to add.
   */
  private addToClosestCluster_(marker: google.maps.Marker): void {
    let distance = 40000; // Some large number
    let clusterToAddTo = null;
    for (let i = 0; i < this.clusters_.length; i++) {
      const cluster = this.clusters_[i];
      const center = cluster.getCenter();
      if (center) {
        const d = this.distanceBetweenPoints_(center, marker.getPosition());
        if (d < distance) {
          distance = d;
          clusterToAddTo = cluster;
        }
      }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker);
    } else {
      const cluster = new Cluster(this);
      cluster.addMarker(marker);
      this.clusters_.push(cluster);
    }
  }

  /**
   * Creates the clusters. This is done in batches to avoid timeout errors
   *  in some browsers when there is a huge number of markers.
   *
   * @param iFirst The index of the first marker in the batch of
   *  markers to be added to clusters.
   */
  private createClusters_(iFirst: number): void {
    if (!this.ready_) {
      return;
    }

    // Cancel previous batch processing if we're working on the first batch:
    if (iFirst === 0) {
      google.maps.event.trigger(this, "clusteringbegin", this);

      if (typeof this.timerRefStatic !== "undefined") {
        clearTimeout(this.timerRefStatic);
        delete this.timerRefStatic;
      }
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    //
    // See Comments 9 & 11 on Issue 3651 relating to this workaround for a Google Maps bug:
    let mapBounds: google.maps.LatLngBounds;

    if (this.getMap().getZoom() > 3) {
      mapBounds = new google.maps.LatLngBounds(
        (this.getMap() as google.maps.Map).getBounds().getSouthWest(),
        (this.getMap() as google.maps.Map).getBounds().getNorthEast()
      );
    } else {
      mapBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(85.02070771743472, -178.48388434375),
        new google.maps.LatLng(-85.08136444384544, 178.00048865625)
      );
    }
    const bounds = this.getExtendedBounds(mapBounds);

    const iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);

    for (let i = iFirst; i < iLast; i++) {
      const marker = this.markers_[i];
      if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
        if (
          !this.ignoreHidden_ ||
          (this.ignoreHidden_ && marker.getVisible())
        ) {
          this.addToClosestCluster_(marker);
        }
      }
    }

    if (iLast < this.markers_.length) {
      this.timerRefStatic = window.setTimeout(() => {
        this.createClusters_(iLast);
      }, 0);
    } else {
      delete this.timerRefStatic;
      google.maps.event.trigger(this, "clusteringend", this);

      for (let i = 0; i < this.clusters_.length; i++) {
        this.clusters_[i].updateIcon();
      }
    }
  }

  /**
   * The default function for determining the label text and style
   * for a cluster icon.
   *
   * @param markers The array of markers represented by the cluster.
   * @param numStyles The number of marker styles available.
   * @return The information resource for the cluster.
   */
  static CALCULATOR(
    markers: google.maps.Marker[],
    numStyles: number
  ): ClusterIconInfo {
    let index = 0;
    const count: number = markers.length;

    let dv = count;
    while (dv !== 0) {
      dv = Math.floor(dv / 10);
      index++;
    }

    index = Math.min(index, numStyles);
    return {
      text: count.toString(),
      index: index,
      title: ""
    };
  }

  /**
   * Generates default styles augmented with user passed values.
   * Useful when you want to override some default values but keep untouched
   *
   * @param overrides override default values
   */
  static withDefaultStyle(overrides: ClusterIconStyle): ClusterIconStyle {
    return {
      textColor: "black",
      textSize: 11,
      textDecoration: "none",
      textLineHeight: overrides.height,
      fontWeight: "bold",
      fontStyle: "normal",
      fontFamily: "Arial,sans-serif",
      backgroundPosition: "0 0",
      ...overrides
    };
  }
}
