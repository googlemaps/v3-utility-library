export class Point implements google.maps.Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  equals(other: Point): boolean {
    return other.x === this.x && other.y === this.y;
  }
  toString = jest.fn().mockImplementation((): string => {
    return "";
  });
}
