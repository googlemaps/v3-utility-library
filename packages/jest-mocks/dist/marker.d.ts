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
/// <reference types="jest" />
import { MVCObject } from "./mvcobject";
export declare class Marker extends MVCObject implements google.maps.Marker {
    static readonly MAX_ZINDEX: number;
    constructor(opts?: google.maps.ReadonlyMarkerOptions);
    getAnimation: jest.Mock<any, any>;
    getClickable: jest.Mock<any, any>;
    getCursor: jest.Mock<any, any>;
    getDraggable: jest.Mock<any, any>;
    getIcon: jest.Mock<any, any>;
    getLabel: jest.Mock<any, any>;
    getMap: jest.Mock<any, any>;
    getOpacity: jest.Mock<any, any>;
    getPosition: jest.Mock<any, any>;
    getShape: jest.Mock<any, any>;
    getTitle: jest.Mock<any, any>;
    getVisible: jest.Mock<any, any>;
    getZIndex: jest.Mock<any, any>;
    setAnimation: jest.Mock<any, any>;
    setClickable: jest.Mock<any, any>;
    setCursor: jest.Mock<any, any>;
    setDraggable: jest.Mock<any, any>;
    setIcon: jest.Mock<any, any>;
    setLabel: jest.Mock<any, any>;
    setMap: jest.Mock<any, any>;
    setOpacity: jest.Mock<any, any>;
    setOptions: jest.Mock<any, any>;
    setPosition: jest.Mock<any, any>;
    setShape: jest.Mock<any, any>;
    setTitle: jest.Mock<any, any>;
    setVisible: jest.Mock<any, any>;
    setZIndex: jest.Mock<any, any>;
    addListener: jest.Mock<any, any>;
}
