import { LatLng } from "./latlng";
import { MVCObject } from "./mvcobject";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Map_ extends MVCObject implements google.maps.Map {
  controls: Array<google.maps.MVCArray<Node>>;
  data: google.maps.Data;
  mapTypes: google.maps.MapTypeRegistry;
  overlayMapTypes: google.maps.MVCArray<google.maps.MapType>;

  constructor(mapDiv: Element | null, opts?: google.maps.MapOptions) {
    super();
  }
  fitBounds = jest
    .fn()
    .mockImplementation(
      (
        bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
        padding?: number | google.maps.Padding
      ): void => {}
    );
  getBounds = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLngBounds | null | undefined => null
    );
  getCenter = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng => new LatLng({ lat: 0, lng: 0 })
    );
  getDiv = jest.fn().mockImplementation(
    (): Element => {
      return (jest.fn() as unknown) as Element;
    }
  );
  getHeading = jest.fn().mockImplementation((): number => 0);
  getMapTypeId = jest
    .fn()
    .mockImplementation(
      (): google.maps.MapTypeId => google.maps.MapTypeId.ROADMAP
    );
  getProjection = jest
    .fn()
    .mockImplementation((): google.maps.Projection | null => jest.fn() as null);
  getStreetView = jest
    .fn()
    .mockImplementation(
      (): google.maps.StreetViewPanorama =>
        (jest.fn() as unknown) as google.maps.StreetViewPanorama
    );
  getTilt = jest.fn().mockImplementation((): number => 0);
  getZoom = jest.fn().mockImplementation((): number => 0);
  panBy = jest.fn().mockImplementation((x: number, y: number): void => {});
  panTo = jest
    .fn()
    .mockImplementation(
      (latLng: google.maps.LatLng | google.maps.LatLngLiteral): void => {}
    );
  panToBounds = jest
    .fn()
    .mockImplementation(
      (
        latLngBounds:
          | google.maps.LatLngBounds
          | google.maps.LatLngBoundsLiteral,
        padding?: number | google.maps.Padding
      ): void => {}
    );
  setCenter = jest
    .fn()
    .mockImplementation(
      (latlng: google.maps.LatLng | google.maps.LatLngLiteral): void => {}
    );
  setHeading = jest.fn().mockImplementation((heading: number): void => {});
  setMapTypeId = jest
    .fn()
    .mockImplementation(
      (mapTypeId: google.maps.MapTypeId | string): void => {}
    );
  setOptions = jest
    .fn()
    .mockImplementation((options: google.maps.MapOptions): void => {});
  setStreetView = jest
    .fn()
    .mockImplementation((panorama: google.maps.StreetViewPanorama): void => {});
  setTilt = jest.fn().mockImplementation((tilt: number): void => {});
  setZoom = jest.fn().mockImplementation((zoom: number): void => {});
  setClickableIcons = jest
    .fn()
    .mockImplementation((clickable: boolean): void => {});
}
