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
interface Options {
    maxZoom?: number;
    shown?: boolean;
    trackMarkers?: boolean;
    borderPadding?: number;
}
/**
 * Creates a new MarkerManager that will show/hide markers on a map.
 */
declare class MarkerManager {
    shown: boolean;
    shownMarkers: number;
    private _map;
    private _mapZoom;
    private _maxZoom;
    private _tileSize;
    private _trackMarkers;
    private _swPadding;
    private _nePadding;
    private _gridWidth;
    private _grid;
    private _numMarkers;
    private _shownBounds;
    /**
     * @constructor
     * @param map The map to manage.
     * @param {Options} options
     */
    constructor(map: google.maps.Map, { maxZoom, trackMarkers, shown, borderPadding }: Options);
    private _initialize;
    /**
     * This closure provide easy access to the map.
     * They are used as callbacks, not as methods.
     * @param marker Marker to be removed from the map
     */
    private _removeOverlay;
    /**
     * This closure provide easy access to the map.
     * They are used as callbacks, not as methods.
     * @param marker Marker to be added to the map
     */
    private _addOverlay;
    /**
     * Initializes MarkerManager arrays for all zoom levels
     * Called by constructor and by clearAllMarkers
     */
    resetManager(): void;
    /**
     * Removes all markers in the manager, and
     * removes any visible markers from the map.
     */
    clearMarkers(): void;
    /**
     * Gets the tile coordinate for a given latlng point.
     *
     * @param {LatLng} latlng The geographical point.
     * @param {Number} zoom The zoom level.
     * @param {google.maps.Size} padding The padding used to shift the pixel coordinate.
     *               Used for expanding a bounds to include an extra padding
     *               of pixels surrounding the bounds.
     * @return {GPoint} The point in tile coordinates.
     *
     */
    private _getTilePoint;
    /**
     * Finds the appropriate place to add the marker to the grid.
     * Optimized for speed; does not actually add the marker to the map.
     * Designed for batch-_processing thousands of markers.
     *
     * @param {Marker} marker The marker to add.
     * @param {Number} minZoom The minimum zoom for displaying the marker.
     * @param {Number} maxZoom The maximum zoom for displaying the marker.
     */
    private _addMarkerBatch;
    /**
     * Returns whether or not the given point is visible in the shown bounds. This
     * is a helper method that takes care of the corner case, when shownBounds have
     * negative minX value.
     *
     * @param {Point} point a point on a grid.
     * @return {Boolean} Whether or not the given point is visible in the currently
     * shown bounds.
     */
    private _isGridPointVisible;
    /**
     * Reacts to a notification from a marker that it has moved to a new location.
     * It scans the grid all all zoom levels and moves the marker from the old grid
     * location to a new grid location.
     *
     * @param {Marker} marker The marker that moved.
     * @param {LatLng} oldPoint The old position of the marker.
     * @param {LatLng} newPoint The new position of the marker.
     */
    private _onMarkerMoved;
    /**
     * Removes marker from the manager and from the map
     * (if it's currently visible).
     * @param {GMarker} marker The marker to delete.
     */
    removeMarker(marker: google.maps.Marker): void;
    /**
     * Add many markers at once.
     * Does not actually update the map, just the internal grid.
     *
     * @param {Array of Marker} markers The markers to add.
     * @param {Number} minZoom The minimum zoom level to display the markers.
     * @param {Number} maxZoom The maximum zoom level to display the markers.
     */
    addMarkers(markers: google.maps.Marker[], minZoom: number, maxZoom: number): void;
    /**
     * Returns the value of the optional maximum zoom. This method is defined so
     * that we have just one place where optional maximum zoom is calculated.
     *
     * @param {Number} maxZoom The optinal maximum zoom.
     * @return The maximum zoom.
     */
    private _getOptmaxZoom;
    /**
     * Calculates the total number of markers potentially visible at a given
     * zoom level.
     *
     * @param {Number} zoom The zoom level to check.
     */
    getMarkerCount(zoom: number): number;
    /**
     * Returns a marker given latitude, longitude and zoom. If the marker does not
     * exist, the method will return a new marker. If a new marker is created,
     * it will NOT be added to the manager.
     *
     * @param {Number} lat - the latitude of a marker.
     * @param {Number} lng - the longitude of a marker.
     * @param {Number} zoom - the zoom level
     * @return {GMarker} marker - the marker found at lat and lng
     */
    getMarker(lat: number, lng: number, zoom: number): google.maps.Marker;
    /**
     * Add a single marker to the map.
     *
     * @param {Marker} marker The marker to add.
     * @param {Number} minZoom The minimum zoom level to display the marker.
     * @param {Number} maxZoom The maximum zoom level to display the marker.
     */
    addMarker(marker: google.maps.Marker, minZoom: number, maxZoom: number): void;
    /**
     * Get a cell in the grid, creating it first if necessary.
     *
     * Optimization candidate
     *
     * @param {Number} x The x coordinate of the cell.
     * @param {Number} y The y coordinate of the cell.
     * @param {Number} z The z coordinate of the cell.
     * @return {Array} The cell in the array.
     */
    private _getGridCellCreate;
    /**
     * Get a cell in the grid, returning undefined if it does not exist.
     *
     * NOTE: Optimized for speed -- otherwise could combine with _getGridCellCreate.
     *
     * @param {Number} x The x coordinate of the cell.
     * @param {Number} y The y coordinate of the cell.
     * @param {Number} z The z coordinate of the cell.
     * @return {Array} The cell in the array.
     */
    private _getGridCellNoCreate;
    /**
     * Turns at geographical bounds into a grid-space bounds.
     *
     * @param {LatLngBounds} bounds The geographical bounds.
     * @param {Number} zoom The zoom level of the bounds.
     * @param {google.maps.Size} swPadding The padding in pixels to extend beyond the
     * given bounds.
     * @param {google.maps.Size} nePadding The padding in pixels to extend beyond the
     * given bounds.
     * @return {GridBounds} The bounds in grid space.
     */
    private _getGridBounds;
    /**
     * Gets the grid-space bounds for the current map viewport.
     *
     * @return {Bounds} The bounds in grid space.
     */
    private _getMapGridBounds;
    /**
     * Event listener for map:movend.
     * NOTE: Use a timeout so that the user is not blocked
     * from moving the map.
     *
     * Removed this because a a lack of a scopy override/callback function on events.
     */
    private _onMapMoveEnd;
    /**
     * Is this layer visible?
     *
     * Returns visibility setting
     *
     * @return {Boolean} Visible
     */
    visible(): boolean;
    /**
     * Returns true if the manager is hidden.
     * Otherwise returns false.
     * @return {Boolean} Hidden
     */
    isHidden(): boolean;
    /**
     * Shows the manager if it's currently hidden.
     */
    show(): void;
    /**
     * Hides the manager if it's currently visible
     */
    hide(): void;
    /**
     * Toggles the visibility of the manager.
     */
    toggle(): void;
    /**
     * Refresh forces the marker-manager into a good state.
     * <ol>
     *   <li>If never before initialized, shows all the markers.</li>
     *   <li>If previously initialized, removes and re-adds all markers.</li>
     * </ol>
     */
    refresh(): void;
    /**
     * After the viewport may have changed, add or remove markers as needed.
     */
    private _updateMarkers;
    /**
     * Notify listeners when the state of what is displayed changes.
     */
    private _notifyListeners;
    /**
     * Process all markers in the bounds provided, using a callback.
     *
     * @param {Bounds} bounds The bounds in grid space.
     * @param {Function} callback The function to call for each marker.
     */
    private _processAll;
    /**
     * Process all markers in the grid cell, using a callback.
     *
     * @param {Number} x The x coordinate of the cell.
     * @param {Number} y The y coordinate of the cell.
     * @param {Number} z The z coordinate of the cell.
     * @param {Function} callback The function to call for each marker.
     */
    private _processCellMarkers;
    /**
     * Remove all markers in a grid cell.
     *
     * @param {Number} x The x coordinate of the cell.
     * @param {Number} y The y coordinate of the cell.
     * @param {Number} z The z coordinate of the cell.
     */
    private _removeCellMarkers;
    /**
     * Add all markers in a grid cell.
     *
     * @param {Number} x The x coordinate of the cell.
     * @param {Number} y The y coordinate of the cell.
     * @param {Number} z The z coordinate of the cell.
     */
    private _addCellMarkers;
    /**
     * Use the _rectangleDiffCoords function to process all grid cells
     * that are in bounds1 but not bounds2, using a callback, and using
     * the current MarkerManager object as the instance.
     *
     * Pass the z parameter to the callback in addition to x and y.
     *
     * @param {Bounds} bounds1 The bounds of all points we may _process.
     * @param {Bounds} bounds2 The bounds of points to exclude.
     * @param {Function} callback The callback function to call
     *                   for each grid coordinate (x, y, z).
     */
    private _rectangleDiff;
    /**
     * Calls the function for all points in bounds1, not in bounds2
     *
     * @param {Bounds} bounds1 The bounds of all points we may process.
     * @param {Bounds} bounds2 The bounds of points to exclude.
     * @param {Function} callback The callback function to call
     *                   for each grid coordinate.
     */
    private _rectangleDiffCoords;
    /**
     * Removes marker from cell. O(N).
     */
    private _removeMarkerFromCell;
}
export { MarkerManager };
