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
/// <reference types="@types/googlemaps" />
/**
 * @ignore
 */
declare const DEFAULT_WMS_PARAMS: {
    request: string;
    service: string;
    srs: string;
};
/**
 * @ignore
 */
declare const EPSG_3857_EXTENT = 20037508.34789244;
/**
 * Convert xyz tile coordinates to mercator bounds.
 *
 * @param x
 * @param y
 * @param zoom
 * @returns {number[]} minx, miny, maxx, maxy
 */
declare function xyzToBounds(x: number, y: number, zoom: number): number[];
interface WmsMapTypeOptions {
    url: string;
    layers: string;
    maxZoom: number;
    styles?: string;
    bgcolor?: string;
    version?: string;
    transparent?: boolean;
    format?: string;
    outline?: boolean;
    name?: string;
    alt?: string;
    minZoom?: number;
    opacity?: number;
}
/**
 *
 * @param {WmsMapTypeOptions} params
 */
declare const WmsMapType: ({ url, layers, styles, bgcolor, version, transparent, format, outline, name, alt, maxZoom, minZoom, opacity }: WmsMapTypeOptions) => google.maps.ImageMapType;
export { EPSG_3857_EXTENT, DEFAULT_WMS_PARAMS, xyzToBounds, WmsMapType, WmsMapTypeOptions };
