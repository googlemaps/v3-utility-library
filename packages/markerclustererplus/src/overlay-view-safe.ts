export interface OverlayViewSafe extends google.maps.OverlayView {}

export class OverlayViewSafe {
  constructor() {
    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    this.extend(OverlayViewSafe, google.maps.OverlayView);
  }

  /**
   * Extends an object's prototype by another's.
   *
   * @param {Object} obj1 The object to be extended.
   * @param {Object} obj2 The object to extend with.
   * @return {Object} The new extended object.
   * @ignore
   */
  extend(obj1: any, obj2: any) {
    return function(object: any) {
      for (const property in object.prototype) {
        this.prototype[property] = object.prototype[property];
      }
      return this;
    }.apply(obj1, [obj2]);
  }
}
