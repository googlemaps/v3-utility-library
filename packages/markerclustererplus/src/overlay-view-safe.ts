/* eslint-disable @typescript-eslint/no-empty-interface */
export interface OverlayViewSafe extends google.maps.OverlayView {}

/**
 * Extends an object's prototype by another's.
 *
 * @param {Object} type1 The Type to be extended.
 * @param {Object} type2 The Type to extend with.
 * @ignore
 */
function extend(type1: any, type2: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const property in type2.prototype) {
    type1.prototype[property] = type2.prototype[property];
  }
}

export class OverlayViewSafe {
  constructor() {
    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    extend(OverlayViewSafe, google.maps.OverlayView);
  }
}

