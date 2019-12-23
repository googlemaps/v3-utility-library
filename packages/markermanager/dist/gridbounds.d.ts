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
/// <reference types="@types/googlemaps" />
/**
 * Helper class to create a bounds of INT ranges.
 * @ignore
 */
export declare class GridBounds {
    z: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    /**
     *
     * @param bounds
     * @param z
     */
    constructor(bounds: google.maps.Point[], z: number);
    /**
     * Returns true if this bounds equal the given bounds.
     * @param {GridBounds} gridBounds GridBounds The bounds to test.
     * @return {Boolean} This Bounds equals the given GridBounds.
     */
    equals(gridBounds: GridBounds): boolean;
    /**
     * Returns true if this bounds (inclusively) contains the given point.
     * @param {Point} point  The point to test.
     * @return {Boolean} This Bounds contains the given Point.
     */
    containsPoint(point: google.maps.Point): boolean;
}
