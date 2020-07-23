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

export class MVCArray<T> extends MVCObject implements google.maps.MVCArray<T> {
  constructor(array?: T[]) {
    super();
  }

  clear = jest.fn().mockImplementation((): void => {});
  forEach = jest
    .fn()
    .mockImplementation((callback: (elem: T, i: number) => void): void => {});

  getArray = jest.fn().mockImplementation((): T[] => []);
  getAt = jest.fn().mockImplementation((i: number): T => ({} as T));
  getLength = jest.fn().mockImplementation((): number => 0);
  insertAt = jest.fn().mockImplementation((i: number, elem: T): void => {});
  pop = jest.fn().mockImplementation((): T => ({} as T));
  push = jest.fn().mockImplementation((elem: T): number => 0);
  removeAt = jest.fn().mockImplementation((i: number): T => ({} as T));
  setAt = jest.fn().mockImplementation((i: number, elem: T): void => {});
}
