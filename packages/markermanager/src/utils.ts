function lngToX(lng: number): number {
  return 1 + lng / 180;
}

function latToY(lat: number): number {
  const sinofphi = Math.sin((lat * Math.PI) / 180);
  return 1 - (0.5 / Math.PI) * Math.log((1 + sinofphi) / (1 - sinofphi));
}

export function latLngToPixel(
  latlng: google.maps.LatLng,
  zoom: number
): google.maps.Point {
  return new google.maps.Point(
    ~~(0.5 + lngToX(latlng.lng()) * (2 << (zoom + 6))),
    ~~(0.5 + latToY(latlng.lat()) * (2 << (zoom + 6)))
  );
}
