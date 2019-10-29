export class LatLng implements google.maps.LatLng {
  constructor(literal: google.maps.LatLngLiteral, noWrap?: boolean) {}

  equals = jest
    .fn()
    .mockImplementation((other: google.maps.LatLng): boolean => false);
  lat = jest.fn().mockImplementation((): number => 0);
  lng = jest.fn().mockImplementation((): number => 0);
  toString = jest.fn().mockImplementation((): string => "");
  toUrlValue = jest.fn().mockImplementation((precision?: number): string => "");
  toJSON = jest.fn().mockImplementation(
    (): google.maps.LatLngLiteral => {
      return { lat: 0, lng: 0 };
    }
  );
}

export class LatLngBounds implements google.maps.LatLngBounds {
  constructor(
    sw?: google.maps.LatLng | google.maps.LatLngLiteral,
    ne?: google.maps.LatLng | google.maps.LatLngLiteral
  ) {}
  contains = jest
    .fn()
    .mockImplementation(
      (latLng: google.maps.LatLng | google.maps.LatLngLiteral): boolean => false
    );
  equals = jest
    .fn()
    .mockImplementation(
      (
        other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
      ): boolean => false
    );
  extend = jest
    .fn()
    .mockImplementation(
      (
        point: google.maps.LatLng | google.maps.LatLngLiteral
      ): google.maps.LatLngBounds => this
    );
  getCenter = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng => new google.maps.LatLng({ lat: 0, lng: 0 })
    );
  getNorthEast = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng => new google.maps.LatLng({ lat: 0, lng: 0 })
    );
  getSouthWest = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng => new google.maps.LatLng({ lat: 0, lng: 0 })
    );
  intersects = jest
    .fn()
    .mockImplementation(
      (
        other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
      ): boolean => false
    );
  isEmpty = jest.fn().mockImplementation((): boolean => false);
  toJSON = jest.fn().mockImplementation(
    (): google.maps.LatLngBoundsLiteral => {
      return { east: 0, north: 0, south: 0, west: 0 };
    }
  );
  toSpan = jest
    .fn()
    .mockImplementation(
      (): google.maps.LatLng => new google.maps.LatLng({ lat: 0, lng: 0 })
    );
  toString = jest.fn().mockImplementation((): string => "");
  toUrlValue = jest.fn().mockImplementation((precision?: number): string => "");
  union = jest
    .fn()
    .mockImplementation(
      (
        other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
      ): google.maps.LatLngBounds => this
    );
}
