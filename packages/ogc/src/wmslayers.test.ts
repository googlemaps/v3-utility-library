/// <reference types="@types/jest" />
/// <reference types="@types/googlemaps" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { xyzToBounds, EPSG_3857_EXTENT, WMSLayer } from "./wmslayer";

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

test("WMSLayer can be called with getTIleUrl", () => {
  WMSLayer({
    url: "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms",
    layers: "mrlc_display:NLCD_2016_Land_Cover_L48",
    name: "Land Cover",
    alt: "NLCD_2016_Land_Cover_L48",
    maxZoom: 18,
    styles: "mrlc:mrlc_NLCD_2016_Land_Cover_L48_20190424",
    bgcolor: "0xFFFFFF",
    version: "1.1.1",
    transparent: true,
    format: "image/jpeg",
    outline: false
  });

  const tileUrl = ImageMapType.mock.calls[0][0].getTileUrl(
    new google.maps.Point(0, 0),
    1,
    null
  );

  const expected =
    "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms" +
    "?bbox=-20037508.34789244%2C0%2C0%2C20037508.34789244" +
    "&bgcolor=0xFFFFFF&format=image%2Fjpeg&height=256&" +
    "layers=mrlc_display%3ANLCD_2016_Land_Cover_L48&outline=false" +
    "&request=GetMap&service=WMS&srs=EPSG%3A3857" +
    "&styles=mrlc%3Amrlc_NLCD_2016_Land_Cover_L48_20190424" +
    "&transparent=true&version=1.1.1&width=256";

  expect(tileUrl).toEqual(expected);
});
