/// <reference types="@types/jest" />
/// <reference types="@types/googlemaps" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MarkerManager } from "./markermanager";
import { initialize } from "@googlemaps/jest-mocks";
import { GridBounds } from "./gridbounds";

beforeEach(() => {
  initialize();
});

test("can construct MarkerManager", () => {
  const zoom = 10;
  const map = new google.maps.Map(null);
  (map.getZoom as jest.Mock).mockReturnValueOnce(zoom);

  const mm = new MarkerManager(map, {});

  expect(map.getZoom).toHaveBeenCalledTimes(1);
  expect(mm["_mapZoom"]).toBe(zoom);
});

test("can add and remove markers", () => {
  const map = new google.maps.Map(null);
  const mm = new MarkerManager(map, {});
  const marker = new google.maps.Marker();
  marker.setPosition({ lat: 0, lng: 0 });
  mm["_shownBounds"] = new GridBounds(
    [new google.maps.Point(-10, -10), new google.maps.Point(10, 10)],
    6
  );
  mm.addMarker(marker, 0, 10);

  expect(mm.shownMarkers).toBe(1);
  expect(mm.getMarker(0, 0, 0)).toBe(marker);

  mm.removeMarker(marker);
});
