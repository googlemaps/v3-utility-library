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
/// <reference types="googlemaps" />
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
declare type AriaLabelFn = (text: string) => string;
export declare type Calculator = (markers: google.maps.Marker[], clusterIconStylesCount: number) => ClusterIconInfo;
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
export declare class MarkerClusterer extends OverlayViewSafe {
    private options;
    /**
     * The number of markers to process in one batch.
     */
    static BATCH_SIZE: number;
    /**
     * The number of markers to process in one batch (IE only).
     */
    static BATCH_SIZE_IE: number;
    /**
     * The default root name for the marker cluster images.
     */
    static IMAGE_PATH: string;
    /**
     * The default extension name for the marker cluster images.
     */
    static IMAGE_EXTENSION: string;
    /**
     * The default array of sizes for the marker cluster images.
     */
    static IMAGE_SIZES: number[];
    private markers_;
    private clusters_;
    private listeners_;
    private activeMap_;
    private ready_;
    ariaLabelFn: AriaLabelFn;
    private zIndex_;
    private gridSize_;
    private minClusterSize_;
    private maxZoom_;
    private styles_;
    private title_;
    private zoomOnClick_;
    private averageCenter_;
    private ignoreHidden_;
    private enableRetinaIcons_;
    private imagePath_;
    private imageExtension_;
    private imageSizes_;
    private calculator_;
    private batchSize_;
    private batchSizeIE_;
    private clusterClass_;
    private prevZoom_;
    private timerRefStatic;
    /**
     * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
     * @param map The Google map to attach to.
     * @param markers The markers to be added to the cluster.
     * @param options The optional parameters.
     */
    constructor(map: google.maps.Map, markers?: google.maps.Marker[], options?: MarkerClustererOptions);
    /**
     * Implementation of the onAdd interface method.
     * @ignore
     */
    onAdd(): void;
    /**
     * Implementation of the onRemove interface method.
     * Removes map event listeners and all cluster icons from the DOM.
     * All managed markers are also put back on the map.
     * @ignore
     */
    onRemove(): void;
    /**
     * Implementation of the draw interface method.
     * @ignore
     */
    draw(): void;
    /**
     * Sets up the styles object.
     */
    private setupStyles_;
    /**
     *  Fits the map to the bounds of the markers managed by the clusterer.
     */
    fitMapToMarkers(padding: number | google.maps.Padding): void;
    /**
     * Returns the value of the `gridSize` property.
     *
     * @return The grid size.
     */
    getGridSize(): number;
    /**
     * Sets the value of the `gridSize` property.
     *
     * @param gridSize The grid size.
     */
    setGridSize(gridSize: number): void;
    /**
     * Returns the value of the `minimumClusterSize` property.
     *
     * @return The minimum cluster size.
     */
    getMinimumClusterSize(): number;
    /**
     * Sets the value of the `minimumClusterSize` property.
     *
     * @param minimumClusterSize The minimum cluster size.
     */
    setMinimumClusterSize(minimumClusterSize: number): void;
    /**
     *  Returns the value of the `maxZoom` property.
     *
     *  @return The maximum zoom level.
     */
    getMaxZoom(): number;
    /**
     *  Sets the value of the `maxZoom` property.
     *
     *  @param maxZoom The maximum zoom level.
     */
    setMaxZoom(maxZoom: number): void;
    getZIndex(): number;
    setZIndex(zIndex: number): void;
    /**
     *  Returns the value of the `styles` property.
     *
     *  @return The array of styles defining the cluster markers to be used.
     */
    getStyles(): ClusterIconStyle[];
    /**
     *  Sets the value of the `styles` property.
     *
     *  @param styles The array of styles to use.
     */
    setStyles(styles: ClusterIconStyle[]): void;
    /**
     * Returns the value of the `title` property.
     *
     * @return The content of the title text.
     */
    getTitle(): string;
    /**
     *  Sets the value of the `title` property.
     *
     *  @param title The value of the title property.
     */
    setTitle(title: string): void;
    /**
     * Returns the value of the `zoomOnClick` property.
     *
     * @return True if zoomOnClick property is set.
     */
    getZoomOnClick(): boolean;
    /**
     *  Sets the value of the `zoomOnClick` property.
     *
     *  @param zoomOnClick The value of the zoomOnClick property.
     */
    setZoomOnClick(zoomOnClick: boolean): void;
    /**
     * Returns the value of the `averageCenter` property.
     *
     * @return True if averageCenter property is set.
     */
    getAverageCenter(): boolean;
    /**
     *  Sets the value of the `averageCenter` property.
     *
     *  @param averageCenter The value of the averageCenter property.
     */
    setAverageCenter(averageCenter: boolean): void;
    /**
     * Returns the value of the `ignoreHidden` property.
     *
     * @return True if ignoreHidden property is set.
     */
    getIgnoreHidden(): boolean;
    /**
     *  Sets the value of the `ignoreHidden` property.
     *
     *  @param ignoreHidden The value of the ignoreHidden property.
     */
    setIgnoreHidden(ignoreHidden: boolean): void;
    /**
     * Returns the value of the `enableRetinaIcons` property.
     *
     * @return True if enableRetinaIcons property is set.
     */
    getEnableRetinaIcons(): boolean;
    /**
     *  Sets the value of the `enableRetinaIcons` property.
     *
     *  @param enableRetinaIcons The value of the enableRetinaIcons property.
     */
    setEnableRetinaIcons(enableRetinaIcons: boolean): void;
    /**
     * Returns the value of the `imageExtension` property.
     *
     * @return The value of the imageExtension property.
     */
    getImageExtension(): string;
    /**
     *  Sets the value of the `imageExtension` property.
     *
     *  @param imageExtension The value of the imageExtension property.
     */
    setImageExtension(imageExtension: string): void;
    /**
     * Returns the value of the `imagePath` property.
     *
     * @return The value of the imagePath property.
     */
    getImagePath(): string;
    /**
     *  Sets the value of the `imagePath` property.
     *
     *  @param imagePath The value of the imagePath property.
     */
    setImagePath(imagePath: string): void;
    /**
     * Returns the value of the `imageSizes` property.
     *
     * @return The value of the imageSizes property.
     */
    getImageSizes(): number[];
    /**
     *  Sets the value of the `imageSizes` property.
     *
     *  @param imageSizes The value of the imageSizes property.
     */
    setImageSizes(imageSizes: number[]): void;
    /**
     * Returns the value of the `calculator` property.
     *
     * @return the value of the calculator property.
     */
    getCalculator(): Calculator;
    /**
     * Sets the value of the `calculator` property.
     *
     * @param calculator The value of the calculator property.
     */
    setCalculator(calculator: Calculator): void;
    /**
     * Returns the value of the `batchSizeIE` property.
     *
     * @return the value of the batchSizeIE property.
     */
    getBatchSizeIE(): number;
    /**
     * Sets the value of the `batchSizeIE` property.
     *
     *  @param batchSizeIE The value of the batchSizeIE property.
     */
    setBatchSizeIE(batchSizeIE: number): void;
    /**
     * Returns the value of the `clusterClass` property.
     *
     * @return the value of the clusterClass property.
     */
    getClusterClass(): string;
    /**
     * Sets the value of the `clusterClass` property.
     *
     *  @param clusterClass The value of the clusterClass property.
     */
    setClusterClass(clusterClass: string): void;
    /**
     *  Returns the array of markers managed by the clusterer.
     *
     *  @return The array of markers managed by the clusterer.
     */
    getMarkers(): google.maps.Marker[];
    /**
     *  Returns the number of markers managed by the clusterer.
     *
     *  @return The number of markers.
     */
    getTotalMarkers(): number;
    /**
     * Returns the current array of clusters formed by the clusterer.
     *
     * @return The array of clusters formed by the clusterer.
     */
    getClusters(): Cluster[];
    /**
     * Returns the number of clusters formed by the clusterer.
     *
     * @return The number of clusters formed by the clusterer.
     */
    getTotalClusters(): number;
    /**
     * Adds a marker to the clusterer. The clusters are redrawn unless
     *  `nodraw` is set to `true`.
     *
     * @param marker The marker to add.
     * @param nodraw Set to `true` to prevent redrawing.
     */
    addMarker(marker: google.maps.Marker, nodraw?: boolean): void;
    /**
     * Adds an array of markers to the clusterer. The clusters are redrawn unless
     *  `nodraw` is set to `true`.
     *
     * @param markers The markers to add.
     * @param nodraw Set to `true` to prevent redrawing.
     */
    addMarkers(markers: google.maps.Marker[], nodraw?: boolean): void;
    /**
     * Pushes a marker to the clusterer.
     *
     * @param marker The marker to add.
     */
    private pushMarkerTo_;
    /**
     * Removes a marker from the cluster.  The clusters are redrawn unless
     *  `nodraw` is set to `true`. Returns `true` if the
     *  marker was removed from the clusterer.
     *
     * @param marker The marker to remove.
     * @param nodraw Set to `true` to prevent redrawing.
     * @return True if the marker was removed from the clusterer.
     */
    removeMarker(marker: google.maps.Marker, nodraw?: boolean): boolean;
    /**
     * Removes an array of markers from the cluster. The clusters are redrawn unless
     *  `nodraw` is set to `true`. Returns `true` if markers were removed from the clusterer.
     *
     * @param markers The markers to remove.
     * @param nodraw Set to `true` to prevent redrawing.
     * @return True if markers were removed from the clusterer.
     */
    removeMarkers(markers: google.maps.Marker[], nodraw?: boolean): boolean;
    /**
     * Removes a marker and returns true if removed, false if not.
     *
     * @param marker The marker to remove
     * @return Whether the marker was removed or not
     */
    private removeMarker_;
    /**
     * Removes all clusters and markers from the map and also removes all markers
     *  managed by the clusterer.
     */
    clearMarkers(): void;
    /**
     * Recalculates and redraws all the marker clusters from scratch.
     *  Call this after changing any properties.
     */
    repaint(): void;
    /**
     * Returns the current bounds extended by the grid size.
     *
     * @param bounds The bounds to extend.
     * @return The extended bounds.
     * @ignore
     */
    getExtendedBounds(bounds: google.maps.LatLngBounds): google.maps.LatLngBounds;
    /**
     * Redraws all the clusters.
     */
    private redraw_;
    /**
     * Removes all clusters from the map. The markers are also removed from the map
     *  if `hide` is set to `true`.
     *
     * @param hide Set to `true` to also remove the markers from the map.
     */
    private resetViewport_;
    /**
     * Calculates the distance between two latlng locations in km.
     *
     * @param p1 The first lat lng point.
     * @param p2 The second lat lng point.
     * @return The distance between the two points in km.
     * @link http://www.movable-type.co.uk/scripts/latlong.html
     */
    private distanceBetweenPoints_;
    /**
     * Determines if a marker is contained in a bounds.
     *
     * @param marker The marker to check.
     * @param bounds The bounds to check against.
     * @return True if the marker is in the bounds.
     */
    private isMarkerInBounds_;
    /**
     * Adds a marker to a cluster, or creates a new cluster.
     *
     * @param marker The marker to add.
     */
    private addToClosestCluster_;
    /**
     * Creates the clusters. This is done in batches to avoid timeout errors
     *  in some browsers when there is a huge number of markers.
     *
     * @param iFirst The index of the first marker in the batch of
     *  markers to be added to clusters.
     */
    private createClusters_;
    /**
     * The default function for determining the label text and style
     * for a cluster icon.
     *
     * @param markers The array of markers represented by the cluster.
     * @param numStyles The number of marker styles available.
     * @return The information resource for the cluster.
     */
    static CALCULATOR(markers: google.maps.Marker[], numStyles: number): ClusterIconInfo;
    /**
     * Generates default styles augmented with user passed values.
     * Useful when you want to override some default values but keep untouched
     *
     * @param overrides override default values
     */
    static withDefaultStyle(overrides: ClusterIconStyle): ClusterIconStyle;
}
export {};
