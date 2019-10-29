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
import { stringify } from "query-string";

const DEFAULT_WMS_PARAMS = {
  request: "GetMap",
  service: "WMS",
  srs: "EPSG:3857"
};
const EPSG_3857_EXTENT = 20037508.34789244;
const ORIG_X = -EPSG_3857_EXTENT; // x starts from right
const ORIG_Y = EPSG_3857_EXTENT; // y starts from top

function xyzToBounds(x: number, y: number, zoom: number): Array<number> {
  const tileSize = (EPSG_3857_EXTENT * 2) / Math.pow(2, zoom);
  const minx = ORIG_X + x * tileSize;
  const maxx = ORIG_X + (x + 1) * tileSize;
  const miny = ORIG_Y - (y + 1) * tileSize;
  const maxy = ORIG_Y - y * tileSize;
  return [minx, miny, maxx, maxy];
}

interface WMSLayerOptions {
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
const WMSLayer = function({
  url,
  layers,
  styles = "",
  bgcolor = "0xFFFFFF",
  version = "1.1.1",
  transparent = true,
  format = "image/png",
  outline = false,
  // google.maps.ImageMapTypeOptions interface
  name,
  alt,
  maxZoom,
  minZoom,
  opacity
}: WMSLayerOptions): google.maps.ImageMapType {
  // currently only support tileSize of 256
  const tileSize = new google.maps.Size(256, 256);

  const params = {
    layers,
    styles,
    version,
    transparent,
    bgcolor,
    format,
    outline,
    width: tileSize.width,
    height: tileSize.height,
    ...DEFAULT_WMS_PARAMS
  };

  if (url.slice(-1) !== "?") {
    url += "?";
  }

  const getTileUrl = function(coord: google.maps.Point, zoom: number): string {
    return (
      url +
      stringify({
        bbox: xyzToBounds(coord.x, coord.y, zoom).join(","),
        ...params
      })
    );
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

export {
  EPSG_3857_EXTENT,
  DEFAULT_WMS_PARAMS,
  xyzToBounds,
  WMSLayer,
  WMSLayerOptions
};
