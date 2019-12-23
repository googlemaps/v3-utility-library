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
export declare class LatLng implements google.maps.LatLng {
    constructor(literal: google.maps.LatLngLiteral, noWrap?: boolean);
    equals: jest.Mock<any, any>;
    lat: jest.Mock<any, any>;
    lng: jest.Mock<any, any>;
    toString: jest.Mock<any, any>;
    toUrlValue: jest.Mock<any, any>;
    toJSON: jest.Mock<any, any>;
}
export declare class LatLngBounds implements google.maps.LatLngBounds {
    constructor(sw?: google.maps.LatLng | google.maps.LatLngLiteral, ne?: google.maps.LatLng | google.maps.LatLngLiteral);
    contains: jest.Mock<any, any>;
    equals: jest.Mock<any, any>;
    extend: jest.Mock<any, any>;
    getCenter: jest.Mock<any, any>;
    getNorthEast: jest.Mock<any, any>;
    getSouthWest: jest.Mock<any, any>;
    intersects: jest.Mock<any, any>;
    isEmpty: jest.Mock<any, any>;
    toJSON: jest.Mock<any, any>;
    toSpan: jest.Mock<any, any>;
    toString: jest.Mock<any, any>;
    toUrlValue: jest.Mock<any, any>;
    union: jest.Mock<any, any>;
}
