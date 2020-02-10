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
 * This class represents the object for values in the `styles` array passed
 * to the {@link MarkerClusterer} constructor. The element in this array that is used to
 * style the cluster icon is determined by calling the `calculator` function.
 */
import { Cluster } from "./cluster";
import { OverlayViewSafe } from "./overlay-view-safe";
export interface ClusterIconStyle {
    /** The URL of the cluster icon image file. If not set, img element will not be created */
    url?: string;
    /** The name of the CSS class defining styles for the cluster markers. */
    className?: string;
    /** Height The display height (in pixels) of the cluster icon. Required. */
    height: number;
    /** Width The display width (in pixels) of the cluster icon. Required. */
    width: number;
    /**
     * The position (in pixels) from the center of the cluster icon to
     * where the text label is to be centered and drawn. The format is `[yoffset, xoffset]`
     * where `yoffset` increases as you go down from center and `xoffset`
     * increases to the right of center. The default is `[0, 0]`.
     */
    anchorText?: [number, number];
    /**
     * The anchor position (in pixels) of the cluster icon. This is the
     * spot on the cluster icon that is to be aligned with the cluster position. The format is
     * `[yoffset, xoffset]` where `yoffset` increases as you go down and
     * `xoffset` increases to the right of the top-left corner of the icon. The default
     * anchor position is the center of the cluster icon.
     */
    anchorIcon?: [number, number];
    /**
     * The color of the label text shown on the cluster icon.
     * @default `"black"`
     */
    textColor?: string;
    /** The size (in pixels) of the label text shown on the cluster icon.
     * @default `11`
     */
    textSize?: number;
    /** The line height (in pixels) of the label text shown on the cluster icon.
     * @default the same as cluster icon height
     */
    textLineHeight?: number;
    /**
     * The value of the CSS `text-decoration`
     * property for the label text shown on the cluster icon.
     *
     * @default `"none"`
     */
    textDecoration?: string;
    /**
     * The value of the CSS `font-weight`
     * property for the label text shown on the cluster icon.
     *
     *  @default `"bold"`
     */
    fontWeight?: string;
    /**
     *  The value of the CSS `font-style`
     *  property for the label text shown on the cluster icon.
     *
     *  @default `"normal"`
     */
    fontStyle?: string;
    /**
     *  The value of the CSS `font-family`
     *  property for the label text shown on the cluster icon.
     *  @default `"Arial,sans-serif"`
     */
    fontFamily?: string;
    /**
     * The position of the cluster icon image
     * within the image defined by `url`. The format is `"xpos ypos"`
     * (the same format as for the CSS `background-position` property). You must set
     * this property appropriately when the image defined by `url` represents a sprite
     * containing multiple images. Note that the position <i>must</i> be specified in px units.
     *
     * @default `"0 0"`
     */
    backgroundPosition?: string;
}
/**
 * @description This is an object containing general information about a cluster icon. This is
 *  the object that a `calculator` function returns.
 */
export interface ClusterIconInfo {
    /**
     * The text of the label to be shown on the cluster icon.
     */
    text: string;
    /**
     * The index plus 1 of the element in the `styles`
     */
    index: number;
    /**
     * The tooltip to display when the mouse moves over the cluster icon.
     * If this value is `undefined` or `""`, `title` is set to the
     * value of the `title` property passed to the MarkerClusterer.
     */
    title: string;
}
/**
 * A cluster icon.
 */
export declare class ClusterIcon extends OverlayViewSafe {
    private cluster_;
    private styles_;
    private className_;
    private center_;
    private div_;
    private sums_;
    private visible_;
    private style;
    private anchorText_;
    private anchorIcon_;
    private boundsChangedListener_;
    /**
     * @param cluster_ The cluster with which the icon is to be associated.
     * @param styles_ An array of {@link ClusterIconStyle} defining the cluster icons
     *  to use for various cluster sizes.
     */
    constructor(cluster_: Cluster, styles_: ClusterIconStyle[]);
    /**
     * Adds the icon to the DOM.
     */
    onAdd(): void;
    /**
     * Removes the icon from the DOM.
     */
    onRemove(): void;
    /**
     * Draws the icon.
     */
    draw(): void;
    /**
     * Hides the icon.
     */
    hide(): void;
    /**
     * Positions and shows the icon.
     */
    show(): void;
    private getLabelDivHtml;
    private getImageElementHtml;
    /**
     * Sets the icon styles to the appropriate element in the styles array.
     *
     * @ignore
     * @param sums The icon label text and styles index.
     */
    useStyle(sums: ClusterIconInfo): void;
    /**
     * Sets the position at which to center the icon.
     *
     * @param center The latlng to set as the center.
     */
    setCenter(center: google.maps.LatLng): void;
    /**
     * Creates the `cssText` style parameter based on the position of the icon.
     *
     * @param pos The position of the icon.
     * @return The CSS style text.
     */
    private createCss_;
    /**
     * Returns the position at which to place the DIV depending on the latlng.
     *
     * @param latlng The position in latlng.
     * @return The position in pixels.
     */
    private getPosFromLatLng_;
}
