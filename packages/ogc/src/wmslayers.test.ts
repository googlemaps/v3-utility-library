/// <reference types="@types/jest" />
/// <reference types="@types/googlemaps" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  xyzToBounds,
  EPSG_3857_EXTENT,
  WMSLayer,
  WMSLayerOptions,
  DEFAULT_WMS_PARAMS
} from "./wmslayer";
import { parse } from "query-string";

const ImageMapType = jest.fn();

beforeAll(() => {
  (global as any).google = {
    maps: {
      ImageMapType: ImageMapType,
      Size: jest.fn((width, height) => ({ width, height })),
      Point: jest.fn((x, y) => ({ x, y }))
    }
  };
});

afterAll(() => {
  (global as any).google = {};
});

test("xyzToBounds is correct", () => {
  expect(xyzToBounds(0, 0, 0)).toEqual([
    -EPSG_3857_EXTENT,
    -EPSG_3857_EXTENT,
    EPSG_3857_EXTENT,
    EPSG_3857_EXTENT
  ]);
});

test.each([
  [
    {
      url: "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms",
      layers: "mrlc_display:NLCD_2016_Land_Cover_L48",
      styles: "mrlc:mrlc_NLCD_2016_Land_Cover_L48_20190424",
      bgcolor: "0xFFFFFF",
      version: "1.2.3",
      format: "image/jpeg",
      outline: true,
      transparent: true,
      name: "Land Cover",
      alt: "NLCD_2016_Land_Cover_L48",
      maxZoom: 18,
      minZoom: 0,
      opacity: 1.0
    }
  ],
  [
    {
      url: "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms?",
      layers: "mrlc_display:NLCD_2016_Land_Cover_L48",
      maxZoom: 18
    }
  ]
])("WMSLayer can be called with getTIleUrl", (options: WMSLayerOptions) => {
  WMSLayer(options);

  // need to get the mock in order of each
  const tileUrl = ImageMapType.mock.calls[
    ImageMapType.mock.calls.length - 1
  ][0].getTileUrl(new google.maps.Point(0, 0), 1, null);

  const [base, queryString] = tileUrl.split("?");

  expect(base).toEqual("https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms");

  const params = parse(queryString, {
    parseNumbers: true,
    parseBooleans: true
  });

  expect(params["layers"]).toEqual(options["layers"]);
  expect(params["bgcolor"]).toEqual(parseInt(options["bgcolor"] || "0xFFFFFF"));
  expect(params["styles"]).toEqual(options["styles"] || "");
  expect(params["request"]).toEqual(DEFAULT_WMS_PARAMS.request);
  expect(params["service"]).toEqual(DEFAULT_WMS_PARAMS.service);
  expect(params["srs"]).toEqual(DEFAULT_WMS_PARAMS.srs);
  expect(params["format"]).toEqual(options["format"] || "image/png");
  expect(params["outline"]).toEqual(options["outline"] || false);
  expect(params["version"]).toEqual(options["version"] || "1.1.1");
  expect(params["height"]).toEqual(256);
  expect(params["width"]).toEqual(256);
});
