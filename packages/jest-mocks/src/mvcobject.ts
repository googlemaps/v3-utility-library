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
