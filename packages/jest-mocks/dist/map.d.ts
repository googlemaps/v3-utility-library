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
export declare class Map_ extends MVCObject implements google.maps.Map {
    controls: Array<google.maps.MVCArray<Node>>;
    data: google.maps.Data;
    mapTypes: google.maps.MapTypeRegistry;
    overlayMapTypes: google.maps.MVCArray<google.maps.MapType>;
    constructor(mapDiv: Element | null, opts?: google.maps.MapOptions);
    fitBounds: jest.Mock<any, any>;
    getBounds: jest.Mock<any, any>;
    getCenter: jest.Mock<any, any>;
    getClickableIcons: jest.Mock<any, any>;
    getDiv: jest.Mock<any, any>;
    getHeading: jest.Mock<any, any>;
    getMapTypeId: jest.Mock<any, any>;
    getProjection: jest.Mock<any, any>;
    getStreetView: jest.Mock<any, any>;
    getTilt: jest.Mock<any, any>;
    getZoom: jest.Mock<any, any>;
    panBy: jest.Mock<any, any>;
    panTo: jest.Mock<any, any>;
    panToBounds: jest.Mock<any, any>;
    setCenter: jest.Mock<any, any>;
    setHeading: jest.Mock<any, any>;
    setMapTypeId: jest.Mock<any, any>;
    setOptions: jest.Mock<any, any>;
    setStreetView: jest.Mock<any, any>;
    setTilt: jest.Mock<any, any>;
    setZoom: jest.Mock<any, any>;
    setClickableIcons: jest.Mock<any, any>;
}
