import { stringify } from 'query-string';

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
 * @ignore
 */
const DEFAULT_WMS_PARAMS = {
    request: "GetMap",
    service: "WMS",
    srs: "EPSG:3857"
};
/**
 * @ignore
 */
const EPSG_3857_EXTENT = 20037508.34789244;
/**
 * @ignore
 */
const ORIG_X = -EPSG_3857_EXTENT; // x starts from right
/**
 * @ignore
 */
const ORIG_Y = EPSG_3857_EXTENT; // y starts from top
/**
 * Convert xyz tile coordinates to mercator bounds.
 *
 * @param x
 * @param y
 * @param zoom
 * @returns {number[]} minx, miny, maxx, maxy
 */
function xyzToBounds(x, y, zoom) {
    const tileSize = (EPSG_3857_EXTENT * 2) / Math.pow(2, zoom);
    const minx = ORIG_X + x * tileSize;
    const maxx = ORIG_X + (x + 1) * tileSize;
    const miny = ORIG_Y - (y + 1) * tileSize;
    const maxy = ORIG_Y - y * tileSize;
    return [minx, miny, maxx, maxy];
}
/**
 *
 * @param {WmsMapTypeOptions} params
 */
const WmsMapType = function ({ url, layers, styles = "", bgcolor = "0xFFFFFF", version = "1.1.1", transparent = true, format = "image/png", outline = false, 
// google.maps.ImageMapTypeOptions interface
name, alt, maxZoom, minZoom, opacity }) {
    // currently only support tileSize of 256
    const tileSize = new google.maps.Size(256, 256);
    const params = Object.assign({ layers,
        styles,
        version,
        transparent,
        bgcolor,
        format,
        outline, width: tileSize.width, height: tileSize.height }, DEFAULT_WMS_PARAMS);
    if (url.slice(-1) !== "?") {
        url += "?";
    }
    const getTileUrl = function (coord, zoom) {
        return (url +
            stringify(Object.assign({ bbox: xyzToBounds(coord.x, coord.y, zoom).join(",") }, params)));
    };
    return new google.maps.ImageMapType({
        getTileUrl,
        name,
        alt,
        opacity,
        maxZoom,
        minZoom,
        tileSize
    });
};

export { WmsMapType, xyzToBounds };
//# sourceMappingURL=ogc.esm.js.map
