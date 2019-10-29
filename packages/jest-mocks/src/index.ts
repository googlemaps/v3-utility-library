/* eslint-disable @typescript-eslint/no-explicit-any */

import { LatLng, LatLngBounds } from "./latlng";
import { Map_ } from "./map";
import { Marker } from "./marker";
import { MVCObject } from "./mvcobject";
import { Point } from "./point";
import { Size } from "./size";

const initialize = function(): void {
  (global as any).google = {
    maps: {
      ImageMapType: jest.fn(),
      Marker: Marker,
      Map: Map_,
      Point: Point,
      Size: Size,
      MVCObject: MVCObject,
      LatLng: LatLng,
      LatLngBounds: LatLngBounds,
      event: {
        addListener: jest.fn(),
        addListenerOnce: jest.fn(),
        addDomListerner: jest.fn(),
        addDomListernerOnce: jest.fn(),
        clearInstanceListeners: jest.fn(),
        clearListeners: jest.fn(),
        removeListener: jest.fn(),
        trigger: jest.fn()
      }
    }
  };
};

export {
  Marker,
  Map_ as Map,
  Size,
  MVCObject,
  LatLng,
  LatLngBounds,
  initialize
};
