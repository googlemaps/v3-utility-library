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

import { MVCObject } from "./mvcobject";

export class Polyline extends MVCObject implements google.maps.Polyline {
  constructor(opts?: {}) {
    super();
  }

  getDraggable = jest.fn().mockImplementation((): boolean => false);
  getEditable = jest.fn().mockImplementation((): boolean => false);
  getMap = jest
    .fn()
    .mockImplementation((): google.maps.Map => ({} as google.maps.Map));
  getPath = jest
    .fn()
    .mockImplementation(
      (): google.maps.MVCArray<google.maps.LatLng> =>
        ({} as google.maps.MVCArray<google.maps.LatLng>)
    );
  getVisible = jest.fn().mockImplementation((): boolean => false);
  setDraggable = jest.fn().mockImplementation((draggable: boolean): void => {});
  setEditable = jest.fn().mockImplementation((editable: boolean): void => {});
  setMap = jest.fn().mockImplementation((map: google.maps.Map): void => {});
  setOptions = jest
    .fn()
    .mockImplementation((options: google.maps.PolylineOptions): void => {});
  setPath = jest
    .fn()
    .mockImplementation(
      (
        path:
          | google.maps.MVCArray<google.maps.LatLng>
          | google.maps.LatLng[]
          | google.maps.LatLngLiteral[]
      ): void => {}
    );
  setVisible = jest.fn().mockImplementation((visible: boolean): void => {});
}
