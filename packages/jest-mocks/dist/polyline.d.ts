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
/// <reference types="jest" />
/// <reference types="googlemaps" />
import { MVCObject } from "./mvcobject";
export declare class Polyline extends MVCObject implements google.maps.Polyline {
    constructor(opts?: {});
    getDraggable: jest.Mock<any, any>;
    getEditable: jest.Mock<any, any>;
    getMap: jest.Mock<any, any>;
    getPath: jest.Mock<any, any>;
    getVisible: jest.Mock<any, any>;
    setDraggable: jest.Mock<any, any>;
    setEditable: jest.Mock<any, any>;
    setMap: jest.Mock<any, any>;
    setOptions: jest.Mock<any, any>;
    setPath: jest.Mock<any, any>;
    setVisible: jest.Mock<any, any>;
}
