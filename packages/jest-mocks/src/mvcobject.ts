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

/* eslint-disable @typescript-eslint/no-explicit-any */

export class MVCObject implements google.maps.MVCObject {
  addListener = jest
    .fn()
    .mockImplementation(
      (eventName: string, handler: (...args: any[]) => void): void => {}
    );
  bindTo = jest
    .fn()
    .mockImplementation(
      (
        key: string,
        target: MVCObject,
        targetKey?: string,
        noNotify?: boolean
      ): void => {}
    );
  changed = jest.fn().mockImplementation((key: string): void => {});
  get = jest.fn().mockImplementation((key: string): any => {});
  notify = jest.fn().mockImplementation((key: string): void => {});
  set = jest.fn().mockImplementation((key: string, value: any): void => {});
  setValues = jest.fn().mockImplementation((values: any): void => {});
  unbind = jest.fn().mockImplementation((key: string): void => {});
  unbindAll = jest.fn().mockImplementation(() => {});
}
