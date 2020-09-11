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
export declare class MVCArray<T> extends MVCObject implements google.maps.MVCArray<T> {
    constructor(array?: T[]);
    clear: jest.Mock<any, any>;
    forEach: jest.Mock<any, any>;
    getArray: jest.Mock<any, any>;
    getAt: jest.Mock<any, any>;
    getLength: jest.Mock<any, any>;
    insertAt: jest.Mock<any, any>;
    pop: jest.Mock<any, any>;
    push: jest.Mock<any, any>;
    removeAt: jest.Mock<any, any>;
    setAt: jest.Mock<any, any>;
}
