import { MVCObject } from "./mvcobject";
import { LatLng } from "./index";

export class Marker extends MVCObject implements google.maps.Marker {
  static readonly MAX_ZINDEX: number;
  constructor(opts?: google.maps.ReadonlyMarkerOptions) {
    super();
  }
  getAnimation = jest
    .fn()
    .mockImplementation((): Animation | null | undefined => null);
  getClickable = jest.fn().mockImplementation((): boolean => null);
  getCursor = jest
    .fn()
    .mockImplementation((): string | null | undefined => null);
  getDraggable = jest
    .fn()
    .mockImplementation((): boolean | null | undefined => null);
  getIcon = jest
    .fn()
    .mockImplementation(
      ():
        | string
        | google.maps.ReadonlyIcon
        | google.maps.ReadonlySymbol
        | null
        | undefined => null
    );
  getLabel = jest
    .fn()
    .mockImplementation(
      (): google.maps.ReadonlyMarkerLabel | null | undefined => null
    );
  getMap = jest
    .fn()
    .mockImplementation(
      (): google.maps.Map | google.maps.StreetViewPanorama | null | undefined =>
        null
    );
  getOpacity = jest
    .fn()
    .mockImplementation((): number | null | undefined => null);
  getPosition = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng | null | undefined =>
        new LatLng({ lat: 0, lng: 0 })
    );
  getShape = jest
    .fn()
    .mockImplementation((): google.maps.MarkerShape | null | undefined => null);
  getTitle = jest
    .fn()
    .mockImplementation((): string | null | undefined => null);
  getVisible = jest.fn().mockImplementation((): boolean => null);
  getZIndex = jest
    .fn()
    .mockImplementation((): number | null | undefined => null);
  setAnimation = jest
    .fn()
    .mockImplementation((animation: Animation | null): void => {});
  setClickable = jest.fn().mockImplementation((flag: boolean): void => {});
  setCursor = jest.fn().mockImplementation((cursor: string | null): void => {});
  setDraggable = jest
    .fn()
    .mockImplementation((flag: boolean | null): void => {});
  setIcon = jest
    .fn()
    .mockImplementation(
      (
        icon:
          | string
          | google.maps.ReadonlyIcon
          | google.maps.ReadonlySymbol
          | null
      ): void => {}
    );
  setLabel = jest
    .fn()
    .mockImplementation(
      (label: string | google.maps.ReadonlyMarkerLabel | null): void => {}
    );
  setMap = jest
    .fn()
    .mockImplementation(
      (map: google.maps.Map | google.maps.StreetViewPanorama | null): void => {}
    );
  setOpacity = jest
    .fn()
    .mockImplementation((opacity: number | null): void => {});
  setOptions = jest
    .fn()
    .mockImplementation(
      (options: google.maps.ReadonlyMarkerOptions): void => {}
    );
  setPosition = jest
    .fn()
    .mockImplementation(
      (
        latlng: google.maps.LatLng | google.maps.ReadonlyLatLngLiteral | null
      ): void => {}
    );
  setShape = jest
    .fn()
    .mockImplementation((shape: google.maps.MarkerShape | null): void => {});
  setTitle = jest.fn().mockImplementation((title: string | null): void => {});
  setVisible = jest.fn().mockImplementation((visible: boolean): void => {});
  setZIndex = jest.fn().mockImplementation((zIndex: number | null): void => {});
  addListener = jest
    .fn()
    .mockImplementation(
      (
        eventName:
          | google.maps.MarkerChangeOptionEventNames
          | google.maps.MarkerMouseEventNames,
        handler: (this: Marker, event: MouseEvent) => void
      ): google.maps.MapsEventListener =>
        (jest.fn() as unknown) as google.maps.MapsEventListener
    );
}
