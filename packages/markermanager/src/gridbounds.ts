/**
 * Helper class to create a bounds of INT ranges.
 * @param bounds Array.<Object.<string, number>> Bounds object.
 * @constructor
 */
export class GridBounds {
  public z: number;
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;

  constructor(bounds: google.maps.Point[], z: number) {
    // [sw, ne]
    this.z = z;
    this.minX = Math.min(bounds[0].x, bounds[1].x);
    this.maxX = Math.max(bounds[0].x, bounds[1].x);
    this.minY = Math.min(bounds[0].y, bounds[1].y);
    this.maxY = Math.max(bounds[0].y, bounds[1].y);
  }

  /**
   * Returns true if this bounds equal the given bounds.
   * @param {GridBounds} gridBounds GridBounds The bounds to test.
   * @return {Boolean} This Bounds equals the given GridBounds.
   */
  equals(gridBounds: GridBounds): boolean {
    if (
      this.maxX === gridBounds.maxX &&
      this.maxY === gridBounds.maxY &&
      this.minX === gridBounds.minX &&
      this.minY === gridBounds.minY
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns true if this bounds (inclusively) contains the given point.
   * @param {Point} point  The point to test.
   * @return {Boolean} This Bounds contains the given Point.
   */
  containsPoint(point: google.maps.Point): boolean {
    return (
      this.minX <= point.x &&
      this.maxX >= point.x &&
      this.minY <= point.y &&
      this.maxY >= point.y
    );
  }
}
