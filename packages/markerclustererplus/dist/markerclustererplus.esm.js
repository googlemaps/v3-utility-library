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
/**
 * Extends an object's prototype by another's.
 *
 * @param type1 The Type to be extended.
 * @param type2 The Type to extend with.
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extend(type1, type2) {
    // eslint-disable-next-line prefer-const
    for (let property in type2.prototype) {
        type1.prototype[property] = type2.prototype[property];
    }
}
/**
 * @ignore
 */
class OverlayViewSafe {
    constructor() {
        // MarkerClusterer implements google.maps.OverlayView interface. We use the
        // extend function to extend MarkerClusterer with google.maps.OverlayView
        // because it might not always be available when the code is defined so we
        // look for it at the last possible moment. If it doesn't exist now then
        // there is no point going ahead :)
        extend(OverlayViewSafe, google.maps.OverlayView);
    }
}

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
/**
 *
 * @hidden
 */
function toCssText(styles) {
    return Object.keys(styles)
        .reduce((acc, key) => {
        if (styles[key]) {
            acc.push(key + ":" + styles[key]);
        }
        return acc;
    }, [])
        .join(";");
}
/**
 *
 * @hidden
 */
function coercePixels(pixels) {
    return pixels ? pixels + "px" : undefined;
}
/**
 * A cluster icon.
 */
class ClusterIcon extends OverlayViewSafe {
    /**
     * @param cluster_ The cluster with which the icon is to be associated.
     * @param styles_ An array of {@link ClusterIconStyle} defining the cluster icons
     *  to use for various cluster sizes.
     */
    constructor(cluster_, styles_) {
        super();
        this.cluster_ = cluster_;
        this.styles_ = styles_;
        this.center_ = null;
        this.div_ = null;
        this.sums_ = null;
        this.visible_ = false;
        this.style = null;
        this.setMap(cluster_.getMap()); // Note: this causes onAdd to be called
    }
    /**
     * Adds the icon to the DOM.
     */
    onAdd() {
        let cMouseDownInCluster;
        let cDraggingMapByCluster;
        const mc = this.cluster_.getMarkerClusterer();
        const [major, minor] = google.maps.version.split(".");
        const gmVersion = parseInt(major, 10) * 100 + parseInt(minor, 10);
        this.div_ = document.createElement("div");
        if (this.visible_) {
            this.show();
        }
        this.getPanes().overlayMouseTarget.appendChild(this.div_);
        // Fix for Issue 157
        this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function () {
            cDraggingMapByCluster = cMouseDownInCluster;
        });
        google.maps.event.addDomListener(this.div_, "mousedown", () => {
            cMouseDownInCluster = true;
            cDraggingMapByCluster = false;
        });
        // March 1, 2018: Fix for this 3.32 exp bug, https://issuetracker.google.com/issues/73571522
        // But it doesn't work with earlier releases so do a version check.
        if (gmVersion >= 332) {
            // Ugly version-dependent code
            google.maps.event.addDomListener(this.div_, "touchstart", e => {
                e.stopPropagation();
            });
        }
        google.maps.event.addDomListener(this.div_, "click", e => {
            cMouseDownInCluster = false;
            if (!cDraggingMapByCluster) {
                /**
                 * This event is fired when a cluster marker is clicked.
                 * @name MarkerClusterer#click
                 * @param {Cluster} c The cluster that was clicked.
                 * @event
                 */
                google.maps.event.trigger(mc, "click", this.cluster_);
                google.maps.event.trigger(mc, "clusterclick", this.cluster_); // deprecated name
                // The default click handler follows. Disable it by setting
                // the zoomOnClick property to false.
                if (mc.getZoomOnClick()) {
                    // Zoom into the cluster.
                    const mz = mc.getMaxZoom();
                    const theBounds = this.cluster_.getBounds();
                    mc.getMap().fitBounds(theBounds);
                    // There is a fix for Issue 170 here:
                    setTimeout(function () {
                        mc.getMap().fitBounds(theBounds);
                        // Don't zoom beyond the max zoom level
                        if (mz !== null && mc.getMap().getZoom() > mz) {
                            mc.getMap().setZoom(mz + 1);
                        }
                    }, 100);
                }
                // Prevent event propagation to the map:
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            }
        });
        google.maps.event.addDomListener(this.div_, "mouseover", () => {
            /**
             * This event is fired when the mouse moves over a cluster marker.
             * @name MarkerClusterer#mouseover
             * @param {Cluster} c The cluster that the mouse moved over.
             * @event
             */
            google.maps.event.trigger(mc, "mouseover", this.cluster_);
        });
        google.maps.event.addDomListener(this.div_, "mouseout", () => {
            /**
             * This event is fired when the mouse moves out of a cluster marker.
             * @name MarkerClusterer#mouseout
             * @param {Cluster} c The cluster that the mouse moved out of.
             * @event
             */
            google.maps.event.trigger(mc, "mouseout", this.cluster_);
        });
    }
    /**
     * Removes the icon from the DOM.
     */
    onRemove() {
        if (this.div_ && this.div_.parentNode) {
            this.hide();
            google.maps.event.removeListener(this.boundsChangedListener_);
            google.maps.event.clearInstanceListeners(this.div_);
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    }
    /**
     * Draws the icon.
     */
    draw() {
        if (this.visible_) {
            const pos = this.getPosFromLatLng_(this.center_);
            this.div_.style.top = pos.y + "px";
            this.div_.style.left = pos.x + "px";
        }
    }
    /**
     * Hides the icon.
     */
    hide() {
        if (this.div_) {
            this.div_.style.display = "none";
        }
        this.visible_ = false;
    }
    /**
     * Positions and shows the icon.
     */
    show() {
        if (this.div_) {
            this.div_.className = this.className_;
            this.div_.style.cssText = this.createCss_(this.getPosFromLatLng_(this.center_));
            this.div_.innerHTML =
                (this.style.url ? this.getImageElementHtml() : "") +
                    this.getLabelDivHtml();
            if (typeof this.sums_.title === "undefined" || this.sums_.title === "") {
                this.div_.title = this.cluster_.getMarkerClusterer().getTitle();
            }
            else {
                this.div_.title = this.sums_.title;
            }
            this.div_.style.display = "";
        }
        this.visible_ = true;
    }
    getLabelDivHtml() {
        const mc = this.cluster_.getMarkerClusterer();
        const ariaLabel = mc.ariaLabelFn(this.sums_.text);
        const divStyle = {
            position: "absolute",
            top: coercePixels(this.anchorText_[0]),
            left: coercePixels(this.anchorText_[1]),
            color: this.style.textColor,
            "font-size": coercePixels(this.style.textSize),
            "font-family": this.style.fontFamily,
            "font-weight": this.style.fontWeight,
            "font-style": this.style.fontStyle,
            "text-decoration": this.style.textDecoration,
            "text-align": "center",
            width: coercePixels(this.style.width),
            "line-height": coercePixels(this.style.textLineHeight)
        };
        return `
<div aria-label="${ariaLabel}" style="${toCssText(divStyle)}" tabindex="0">
  <span aria-hidden="true">${this.sums_.text}</span>
</div>
`;
    }
    getImageElementHtml() {
        // NOTE: values must be specified in px units
        const bp = (this.style.backgroundPosition || "0 0").split(" ");
        const spriteH = parseInt(bp[0].replace(/^\s+|\s+$/g, ""), 10);
        const spriteV = parseInt(bp[1].replace(/^\s+|\s+$/g, ""), 10);
        let dimensions = {};
        if (this.cluster_.getMarkerClusterer().getEnableRetinaIcons()) {
            dimensions = {
                width: coercePixels(this.style.width),
                height: coercePixels(this.style.height)
            };
        }
        else {
            const [Y1, X1, Y2, X2] = [
                -1 * spriteV,
                -1 * spriteH + this.style.width,
                -1 * spriteV + this.style.height,
                -1 * spriteH
            ];
            dimensions = {
                clip: `rect(${Y1}px, ${X1}px, ${Y2}px, ${X2}px)`
            };
        }
        const cssText = toCssText(Object.assign({ position: "absolute", top: coercePixels(spriteV), left: coercePixels(spriteH) }, dimensions));
        return `<img alt="${this.sums_.text}" aria-hidden="true" src="${this.style.url}" style="${cssText}"/>`;
    }
    /**
     * Sets the icon styles to the appropriate element in the styles array.
     *
     * @ignore
     * @param sums The icon label text and styles index.
     */
    useStyle(sums) {
        this.sums_ = sums;
        let index = Math.max(0, sums.index - 1);
        index = Math.min(this.styles_.length - 1, index);
        this.style = this.styles_[index];
        this.anchorText_ = this.style.anchorText || [0, 0];
        this.anchorIcon_ = this.style.anchorIcon || [
            Math.floor(this.style.height / 2),
            Math.floor(this.style.width / 2)
        ];
        this.className_ =
            this.cluster_.getMarkerClusterer().getClusterClass() +
                " " +
                (this.style.className || "cluster-" + index);
    }
    /**
     * Sets the position at which to center the icon.
     *
     * @param center The latlng to set as the center.
     */
    setCenter(center) {
        this.center_ = center;
    }
    /**
     * Creates the `cssText` style parameter based on the position of the icon.
     *
     * @param pos The position of the icon.
     * @return The CSS style text.
     */
    createCss_(pos) {
        return toCssText({
            "z-index": `${this.cluster_.getMarkerClusterer().getZIndex()}`,
            top: coercePixels(pos.y),
            left: coercePixels(pos.x),
            width: coercePixels(this.style.width),
            height: coercePixels(this.style.height),
            cursor: "pointer",
            position: "absolute",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-o-user-select": "none",
            "user-select": "none"
        });
    }
    /**
     * Returns the position at which to place the DIV depending on the latlng.
     *
     * @param latlng The position in latlng.
     * @return The position in pixels.
     */
    getPosFromLatLng_(latlng) {
        const pos = this.getProjection().fromLatLngToDivPixel(latlng);
        pos.x = Math.floor(pos.x - this.anchorIcon_[1]);
        pos.y = Math.floor(pos.y - this.anchorIcon_[0]);
        return pos;
    }
}

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
/**
 * Creates a single cluster that manages a group of proximate markers.
 *  Used internally, do not call this constructor directly.
 */
class Cluster {
    /**
     *
     * @param markerClusterer_ The `MarkerClusterer` object with which this
     *  cluster is associated.
     */
    constructor(markerClusterer_) {
        this.markerClusterer_ = markerClusterer_;
        this.map_ = this.markerClusterer_.getMap();
        this.minClusterSize_ = this.markerClusterer_.getMinimumClusterSize();
        this.averageCenter_ = this.markerClusterer_.getAverageCenter();
        this.markers_ = []; // TODO: type;
        this.center_ = null;
        this.bounds_ = null;
        this.clusterIcon_ = new ClusterIcon(this, this.markerClusterer_.getStyles());
    }
    /**
     * Returns the number of markers managed by the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
     *
     * @return The number of markers in the cluster.
     */
    getSize() {
        return this.markers_.length;
    }
    /**
     * Returns the array of markers managed by the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler for the `MarkerClusterer` object.
     *
     * @return The array of markers in the cluster.
     */
    getMarkers() {
        return this.markers_;
    }
    /**
     * Returns the center of the cluster. You can call this from
     * a `click`, `mouseover`, or `mouseout` event handler
     * for the `MarkerClusterer` object.
     *
     * @return The center of the cluster.
     */
    getCenter() {
        return this.center_;
    }
    /**
     * Returns the map with which the cluster is associated.
     *
     * @return The map.
     * @ignore
     */
    getMap() {
        return this.map_;
    }
    /**
     * Returns the `MarkerClusterer` object with which the cluster is associated.
     *
     * @return The associated marker clusterer.
     * @ignore
     */
    getMarkerClusterer() {
        return this.markerClusterer_;
    }
    /**
     * Returns the bounds of the cluster.
     *
     * @return the cluster bounds.
     * @ignore
     */
    getBounds() {
        const bounds = new google.maps.LatLngBounds(this.center_, this.center_);
        const markers = this.getMarkers();
        for (let i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        return bounds;
    }
    /**
     * Removes the cluster from the map.
     *
     * @ignore
     */
    remove() {
        this.clusterIcon_.setMap(null);
        this.markers_ = [];
        delete this.markers_;
    }
    /**
     * Adds a marker to the cluster.
     *
     * @param marker The marker to be added.
     * @return True if the marker was added.
     * @ignore
     */
    addMarker(marker) {
        if (this.isMarkerAlreadyAdded_(marker)) {
            return false;
        }
        if (!this.center_) {
            this.center_ = marker.getPosition();
            this.calculateBounds_();
        }
        else {
            if (this.averageCenter_) {
                const l = this.markers_.length + 1;
                const lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
                const lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
                this.center_ = new google.maps.LatLng(lat, lng);
                this.calculateBounds_();
            }
        }
        marker.isAdded = true;
        this.markers_.push(marker);
        const mCount = this.markers_.length;
        const mz = this.markerClusterer_.getMaxZoom();
        if (mz !== null && this.map_.getZoom() > mz) {
            // Zoomed in past max zoom, so show the marker.
            if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
            }
        }
        else if (mCount < this.minClusterSize_) {
            // Min cluster size not reached so show the marker.
            if (marker.getMap() !== this.map_) {
                marker.setMap(this.map_);
            }
        }
        else if (mCount === this.minClusterSize_) {
            // Hide the markers that were showing.
            for (let i = 0; i < mCount; i++) {
                this.markers_[i].setMap(null);
            }
        }
        else {
            marker.setMap(null);
        }
        return true;
    }
    /**
     * Determines if a marker lies within the cluster's bounds.
     *
     * @param marker The marker to check.
     * @return True if the marker lies in the bounds.
     * @ignore
     */
    isMarkerInClusterBounds(marker) {
        return this.bounds_.contains(marker.getPosition());
    }
    /**
     * Calculates the extended bounds of the cluster with the grid.
     */
    calculateBounds_() {
        const bounds = new google.maps.LatLngBounds(this.center_, this.center_);
        this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
    }
    /**
     * Updates the cluster icon.
     */
    updateIcon() {
        const mCount = this.markers_.length;
        const mz = this.markerClusterer_.getMaxZoom();
        if (mz !== null && this.map_.getZoom() > mz) {
            this.clusterIcon_.hide();
            return;
        }
        if (mCount < this.minClusterSize_) {
            // Min cluster size not yet reached.
            this.clusterIcon_.hide();
            return;
        }
        const numStyles = this.markerClusterer_.getStyles().length;
        const sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
        this.clusterIcon_.setCenter(this.center_);
        this.clusterIcon_.useStyle(sums);
        this.clusterIcon_.show();
    }
    /**
     * Determines if a marker has already been added to the cluster.
     *
     * @param marker The marker to check.
     * @return True if the marker has already been added.
     */
    isMarkerAlreadyAdded_(marker) {
        if (this.markers_.indexOf) {
            return this.markers_.indexOf(marker) !== -1;
        }
        else {
            for (let i = 0; i < this.markers_.length; i++) {
                if (marker === this.markers_[i]) {
                    return true;
                }
            }
        }
        return false;
    }
}

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
/**
 * @ignore
 */
const getOption = (options, prop, def) => {
    if (options[prop] !== undefined) {
        return options[prop];
    }
    else {
        return def;
    }
};
class MarkerClusterer extends OverlayViewSafe {
    /**
     * Creates a MarkerClusterer object with the options specified in {@link MarkerClustererOptions}.
     * @param map The Google map to attach to.
     * @param markers The markers to be added to the cluster.
     * @param options The optional parameters.
     */
    constructor(map, markers = [], options = {}) {
        super();
        this.options = options;
        this.markers_ = [];
        this.clusters_ = [];
        this.listeners_ = [];
        this.activeMap_ = null;
        this.ready_ = false;
        this.ariaLabelFn = this.options.ariaLabelFn || (() => "");
        this.zIndex_ = this.options.zIndex || google.maps.Marker.MAX_ZINDEX + 1;
        this.gridSize_ = this.options.gridSize || 60;
        this.minClusterSize_ = this.options.minimumClusterSize || 2;
        this.maxZoom_ = this.options.maxZoom || null;
        this.styles_ = this.options.styles || [];
        this.title_ = this.options.title || "";
        this.zoomOnClick_ = getOption(this.options, "zoomOnClick", true);
        this.averageCenter_ = getOption(this.options, "averageCenter", false);
        this.ignoreHidden_ = getOption(this.options, "ignoreHidden", false);
        this.enableRetinaIcons_ = getOption(this.options, "enableRetinaIcons", false);
        this.imagePath_ = this.options.imagePath || MarkerClusterer.IMAGE_PATH;
        this.imageExtension_ = this.options.imageExtension || MarkerClusterer.IMAGE_EXTENSION;
        this.imageSizes_ = this.options.imageSizes || MarkerClusterer.IMAGE_SIZES;
        this.calculator_ = this.options.calculator || MarkerClusterer.CALCULATOR;
        this.batchSize_ = this.options.batchSize || MarkerClusterer.BATCH_SIZE;
        this.batchSizeIE_ = this.options.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE;
        this.clusterClass_ = this.options.clusterClass || "cluster";
        if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) {
            // Try to avoid IE timeout when processing a huge number of markers:
            this.batchSize_ = this.batchSizeIE_;
        }
        this.setupStyles_();
        this.addMarkers(markers, true);
        this.setMap(map); // Note: this causes onAdd to be called
    }
    /**
     * Implementation of the onAdd interface method.
     * @ignore
     */
    onAdd() {
        this.activeMap_ = this.getMap();
        this.ready_ = true;
        this.repaint();
        this.prevZoom_ = this.getMap().getZoom();
        // Add the map event listeners
        this.listeners_ = [
            google.maps.event.addListener(this.getMap(), "zoom_changed", () => {
                const map = this.getMap(); // eslint-disable-line @typescript-eslint/no-explicit-any
                // Fix for bug #407
                // Determines map type and prevents illegal zoom levels
                const minZoom = map.minZoom || 0;
                const maxZoom = Math.min(map.maxZoom || 100, map.mapTypes[map.getMapTypeId()].maxZoom);
                const zoom = Math.min(Math.max(this.getMap().getZoom(), minZoom), maxZoom);
                if (this.prevZoom_ != zoom) {
                    this.prevZoom_ = zoom;
                    this.resetViewport_(false);
                }
            }),
            google.maps.event.addListener(this.getMap(), "idle", () => {
                this.redraw_();
            })
        ];
    }
    /**
     * Implementation of the onRemove interface method.
     * Removes map event listeners and all cluster icons from the DOM.
     * All managed markers are also put back on the map.
     * @ignore
     */
    onRemove() {
        // Put all the managed markers back on the map:
        for (let i = 0; i < this.markers_.length; i++) {
            if (this.markers_[i].getMap() !== this.activeMap_) {
                this.markers_[i].setMap(this.activeMap_);
            }
        }
        // Remove all clusters:
        for (let i = 0; i < this.clusters_.length; i++) {
            this.clusters_[i].remove();
        }
        this.clusters_ = [];
        // Remove map event listeners:
        for (let i = 0; i < this.listeners_.length; i++) {
            google.maps.event.removeListener(this.listeners_[i]);
        }
        this.listeners_ = [];
        this.activeMap_ = null;
        this.ready_ = false;
    }
    /**
     * Implementation of the draw interface method.
     * @ignore
     */
    draw() { }
    /**
     * Sets up the styles object.
     */
    setupStyles_() {
        if (this.styles_.length > 0) {
            return;
        }
        for (let i = 0; i < this.imageSizes_.length; i++) {
            const size = this.imageSizes_[i];
            this.styles_.push(MarkerClusterer.withDefaultStyle({
                url: this.imagePath_ + (i + 1) + "." + this.imageExtension_,
                height: size,
                width: size
            }));
        }
    }
    /**
     *  Fits the map to the bounds of the markers managed by the clusterer.
     */
    fitMapToMarkers(padding) {
        const markers = this.getMarkers();
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < markers.length; i++) {
            // March 3, 2018: Bug fix -- honor the ignoreHidden property
            if (markers[i].getVisible() || !this.getIgnoreHidden()) {
                bounds.extend(markers[i].getPosition());
            }
        }
        this.getMap().fitBounds(bounds, padding);
    }
    /**
     * Returns the value of the `gridSize` property.
     *
     * @return The grid size.
     */
    getGridSize() {
        return this.gridSize_;
    }
    /**
     * Sets the value of the `gridSize` property.
     *
     * @param gridSize The grid size.
     */
    setGridSize(gridSize) {
        this.gridSize_ = gridSize;
    }
    /**
     * Returns the value of the `minimumClusterSize` property.
     *
     * @return The minimum cluster size.
     */
    getMinimumClusterSize() {
        return this.minClusterSize_;
    }
    /**
     * Sets the value of the `minimumClusterSize` property.
     *
     * @param minimumClusterSize The minimum cluster size.
     */
    setMinimumClusterSize(minimumClusterSize) {
        this.minClusterSize_ = minimumClusterSize;
    }
    /**
     *  Returns the value of the `maxZoom` property.
     *
     *  @return The maximum zoom level.
     */
    getMaxZoom() {
        return this.maxZoom_;
    }
    /**
     *  Sets the value of the `maxZoom` property.
     *
     *  @param maxZoom The maximum zoom level.
     */
    setMaxZoom(maxZoom) {
        this.maxZoom_ = maxZoom;
    }
    getZIndex() {
        return this.zIndex_;
    }
    setZIndex(zIndex) {
        this.zIndex_ = zIndex;
    }
    /**
     *  Returns the value of the `styles` property.
     *
     *  @return The array of styles defining the cluster markers to be used.
     */
    getStyles() {
        return this.styles_;
    }
    /**
     *  Sets the value of the `styles` property.
     *
     *  @param styles The array of styles to use.
     */
    setStyles(styles) {
        this.styles_ = styles;
    }
    /**
     * Returns the value of the `title` property.
     *
     * @return The content of the title text.
     */
    getTitle() {
        return this.title_;
    }
    /**
     *  Sets the value of the `title` property.
     *
     *  @param title The value of the title property.
     */
    setTitle(title) {
        this.title_ = title;
    }
    /**
     * Returns the value of the `zoomOnClick` property.
     *
     * @return True if zoomOnClick property is set.
     */
    getZoomOnClick() {
        return this.zoomOnClick_;
    }
    /**
     *  Sets the value of the `zoomOnClick` property.
     *
     *  @param zoomOnClick The value of the zoomOnClick property.
     */
    setZoomOnClick(zoomOnClick) {
        this.zoomOnClick_ = zoomOnClick;
    }
    /**
     * Returns the value of the `averageCenter` property.
     *
     * @return True if averageCenter property is set.
     */
    getAverageCenter() {
        return this.averageCenter_;
    }
    /**
     *  Sets the value of the `averageCenter` property.
     *
     *  @param averageCenter The value of the averageCenter property.
     */
    setAverageCenter(averageCenter) {
        this.averageCenter_ = averageCenter;
    }
    /**
     * Returns the value of the `ignoreHidden` property.
     *
     * @return True if ignoreHidden property is set.
     */
    getIgnoreHidden() {
        return this.ignoreHidden_;
    }
    /**
     *  Sets the value of the `ignoreHidden` property.
     *
     *  @param ignoreHidden The value of the ignoreHidden property.
     */
    setIgnoreHidden(ignoreHidden) {
        this.ignoreHidden_ = ignoreHidden;
    }
    /**
     * Returns the value of the `enableRetinaIcons` property.
     *
     * @return True if enableRetinaIcons property is set.
     */
    getEnableRetinaIcons() {
        return this.enableRetinaIcons_;
    }
    /**
     *  Sets the value of the `enableRetinaIcons` property.
     *
     *  @param enableRetinaIcons The value of the enableRetinaIcons property.
     */
    setEnableRetinaIcons(enableRetinaIcons) {
        this.enableRetinaIcons_ = enableRetinaIcons;
    }
    /**
     * Returns the value of the `imageExtension` property.
     *
     * @return The value of the imageExtension property.
     */
    getImageExtension() {
        return this.imageExtension_;
    }
    /**
     *  Sets the value of the `imageExtension` property.
     *
     *  @param imageExtension The value of the imageExtension property.
     */
    setImageExtension(imageExtension) {
        this.imageExtension_ = imageExtension;
    }
    /**
     * Returns the value of the `imagePath` property.
     *
     * @return The value of the imagePath property.
     */
    getImagePath() {
        return this.imagePath_;
    }
    /**
     *  Sets the value of the `imagePath` property.
     *
     *  @param imagePath The value of the imagePath property.
     */
    setImagePath(imagePath) {
        this.imagePath_ = imagePath;
    }
    /**
     * Returns the value of the `imageSizes` property.
     *
     * @return The value of the imageSizes property.
     */
    getImageSizes() {
        return this.imageSizes_;
    }
    /**
     *  Sets the value of the `imageSizes` property.
     *
     *  @param imageSizes The value of the imageSizes property.
     */
    setImageSizes(imageSizes) {
        this.imageSizes_ = imageSizes;
    }
    /**
     * Returns the value of the `calculator` property.
     *
     * @return the value of the calculator property.
     */
    getCalculator() {
        return this.calculator_;
    }
    /**
     * Sets the value of the `calculator` property.
     *
     * @param calculator The value of the calculator property.
     */
    setCalculator(calculator) {
        this.calculator_ = calculator;
    }
    /**
     * Returns the value of the `batchSizeIE` property.
     *
     * @return the value of the batchSizeIE property.
     */
    getBatchSizeIE() {
        return this.batchSizeIE_;
    }
    /**
     * Sets the value of the `batchSizeIE` property.
     *
     *  @param batchSizeIE The value of the batchSizeIE property.
     */
    setBatchSizeIE(batchSizeIE) {
        this.batchSizeIE_ = batchSizeIE;
    }
    /**
     * Returns the value of the `clusterClass` property.
     *
     * @return the value of the clusterClass property.
     */
    getClusterClass() {
        return this.clusterClass_;
    }
    /**
     * Sets the value of the `clusterClass` property.
     *
     *  @param clusterClass The value of the clusterClass property.
     */
    setClusterClass(clusterClass) {
        this.clusterClass_ = clusterClass;
    }
    /**
     *  Returns the array of markers managed by the clusterer.
     *
     *  @return The array of markers managed by the clusterer.
     */
    getMarkers() {
        return this.markers_;
    }
    /**
     *  Returns the number of markers managed by the clusterer.
     *
     *  @return The number of markers.
     */
    getTotalMarkers() {
        return this.markers_.length;
    }
    /**
     * Returns the current array of clusters formed by the clusterer.
     *
     * @return The array of clusters formed by the clusterer.
     */
    getClusters() {
        return this.clusters_;
    }
    /**
     * Returns the number of clusters formed by the clusterer.
     *
     * @return The number of clusters formed by the clusterer.
     */
    getTotalClusters() {
        return this.clusters_.length;
    }
    /**
     * Adds a marker to the clusterer. The clusters are redrawn unless
     *  `nodraw` is set to `true`.
     *
     * @param marker The marker to add.
     * @param nodraw Set to `true` to prevent redrawing.
     */
    addMarker(marker, nodraw) {
        this.pushMarkerTo_(marker);
        if (!nodraw) {
            this.redraw_();
        }
    }
    /**
     * Adds an array of markers to the clusterer. The clusters are redrawn unless
     *  `nodraw` is set to `true`.
     *
     * @param markers The markers to add.
     * @param nodraw Set to `true` to prevent redrawing.
     */
    addMarkers(markers, nodraw) {
        for (const key in markers) {
            if (Object.prototype.hasOwnProperty.call(markers, key)) {
                this.pushMarkerTo_(markers[key]);
            }
        }
        if (!nodraw) {
            this.redraw_();
        }
    }
    /**
     * Pushes a marker to the clusterer.
     *
     * @param marker The marker to add.
     */
    pushMarkerTo_(marker) {
        // If the marker is draggable add a listener so we can update the clusters on the dragend:
        if (marker.getDraggable()) {
            google.maps.event.addListener(marker, "dragend", () => {
                if (this.ready_) {
                    marker.isAdded = false;
                    this.repaint();
                }
            });
        }
        marker.isAdded = false;
        this.markers_.push(marker);
    }
    /**
     * Removes a marker from the cluster.  The clusters are redrawn unless
     *  `nodraw` is set to `true`. Returns `true` if the
     *  marker was removed from the clusterer.
     *
     * @param marker The marker to remove.
     * @param nodraw Set to `true` to prevent redrawing.
     * @return True if the marker was removed from the clusterer.
     */
    removeMarker(marker, nodraw) {
        const removed = this.removeMarker_(marker);
        if (!nodraw && removed) {
            this.repaint();
        }
        return removed;
    }
    /**
     * Removes an array of markers from the cluster. The clusters are redrawn unless
     *  `nodraw` is set to `true`. Returns `true` if markers were removed from the clusterer.
     *
     * @param markers The markers to remove.
     * @param nodraw Set to `true` to prevent redrawing.
     * @return True if markers were removed from the clusterer.
     */
    removeMarkers(markers, nodraw) {
        let removed = false;
        for (let i = 0; i < markers.length; i++) {
            const r = this.removeMarker_(markers[i]);
            removed = removed || r;
        }
        if (!nodraw && removed) {
            this.repaint();
        }
        return removed;
    }
    /**
     * Removes a marker and returns true if removed, false if not.
     *
     * @param marker The marker to remove
     * @return Whether the marker was removed or not
     */
    removeMarker_(marker) {
        let index = -1;
        if (this.markers_.indexOf) {
            index = this.markers_.indexOf(marker);
        }
        else {
            for (let i = 0; i < this.markers_.length; i++) {
                if (marker === this.markers_[i]) {
                    index = i;
                    break;
                }
            }
        }
        if (index === -1) {
            // Marker is not in our list of markers, so do nothing:
            return false;
        }
        marker.setMap(null);
        this.markers_.splice(index, 1); // Remove the marker from the list of managed markers
        return true;
    }
    /**
     * Removes all clusters and markers from the map and also removes all markers
     *  managed by the clusterer.
     */
    clearMarkers() {
        this.resetViewport_(true);
        this.markers_ = [];
    }
    /**
     * Recalculates and redraws all the marker clusters from scratch.
     *  Call this after changing any properties.
     */
    repaint() {
        const oldClusters = this.clusters_.slice();
        this.clusters_ = [];
        this.resetViewport_(false);
        this.redraw_();
        // Remove the old clusters.
        // Do it in a timeout to prevent blinking effect.
        setTimeout(function () {
            for (let i = 0; i < oldClusters.length; i++) {
                oldClusters[i].remove();
            }
        }, 0);
    }
    /**
     * Returns the current bounds extended by the grid size.
     *
     * @param bounds The bounds to extend.
     * @return The extended bounds.
     * @ignore
     */
    getExtendedBounds(bounds) {
        const projection = this.getProjection();
        // Turn the bounds into latlng.
        const tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
        const bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());
        // Convert the points to pixels and the extend out by the grid size.
        const trPix = projection.fromLatLngToDivPixel(tr);
        trPix.x += this.gridSize_;
        trPix.y -= this.gridSize_;
        const blPix = projection.fromLatLngToDivPixel(bl);
        blPix.x -= this.gridSize_;
        blPix.y += this.gridSize_;
        // Convert the pixel points back to LatLng
        const ne = projection.fromDivPixelToLatLng(trPix);
        const sw = projection.fromDivPixelToLatLng(blPix);
        // Extend the bounds to contain the new bounds.
        bounds.extend(ne);
        bounds.extend(sw);
        return bounds;
    }
    /**
     * Redraws all the clusters.
     */
    redraw_() {
        this.createClusters_(0);
    }
    /**
     * Removes all clusters from the map. The markers are also removed from the map
     *  if `hide` is set to `true`.
     *
     * @param hide Set to `true` to also remove the markers from the map.
     */
    resetViewport_(hide) {
        // Remove all the clusters
        for (let i = 0; i < this.clusters_.length; i++) {
            this.clusters_[i].remove();
        }
        this.clusters_ = [];
        // Reset the markers to not be added and to be removed from the map.
        for (let i = 0; i < this.markers_.length; i++) {
            const marker = this.markers_[i];
            marker.isAdded = false;
            if (hide) {
                marker.setMap(null);
            }
        }
    }
    /**
     * Calculates the distance between two latlng locations in km.
     *
     * @param p1 The first lat lng point.
     * @param p2 The second lat lng point.
     * @return The distance between the two points in km.
     * @link http://www.movable-type.co.uk/scripts/latlong.html
     */
    distanceBetweenPoints_(p1, p2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((p2.lat() - p1.lat()) * Math.PI) / 180;
        const dLon = ((p2.lng() - p1.lng()) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((p1.lat() * Math.PI) / 180) *
                Math.cos((p2.lat() * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    /**
     * Determines if a marker is contained in a bounds.
     *
     * @param marker The marker to check.
     * @param bounds The bounds to check against.
     * @return True if the marker is in the bounds.
     */
    isMarkerInBounds_(marker, bounds) {
        return bounds.contains(marker.getPosition());
    }
    /**
     * Adds a marker to a cluster, or creates a new cluster.
     *
     * @param marker The marker to add.
     */
    addToClosestCluster_(marker) {
        let distance = 40000; // Some large number
        let clusterToAddTo = null;
        for (let i = 0; i < this.clusters_.length; i++) {
            const cluster = this.clusters_[i];
            const center = cluster.getCenter();
            if (center) {
                const d = this.distanceBetweenPoints_(center, marker.getPosition());
                if (d < distance) {
                    distance = d;
                    clusterToAddTo = cluster;
                }
            }
        }
        if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
            clusterToAddTo.addMarker(marker);
        }
        else {
            const cluster = new Cluster(this);
            cluster.addMarker(marker);
            this.clusters_.push(cluster);
        }
    }
    /**
     * Creates the clusters. This is done in batches to avoid timeout errors
     *  in some browsers when there is a huge number of markers.
     *
     * @param iFirst The index of the first marker in the batch of
     *  markers to be added to clusters.
     */
    createClusters_(iFirst) {
        if (!this.ready_) {
            return;
        }
        // Cancel previous batch processing if we're working on the first batch:
        if (iFirst === 0) {
            google.maps.event.trigger(this, "clusteringbegin", this);
            if (typeof this.timerRefStatic !== "undefined") {
                clearTimeout(this.timerRefStatic);
                delete this.timerRefStatic;
            }
        }
        // Get our current map view bounds.
        // Create a new bounds object so we don't affect the map.
        //
        // See Comments 9 & 11 on Issue 3651 relating to this workaround for a Google Maps bug:
        let mapBounds;
        if (this.getMap().getZoom() > 3) {
            mapBounds = new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast());
        }
        else {
            mapBounds = new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
        }
        const bounds = this.getExtendedBounds(mapBounds);
        const iLast = Math.min(iFirst + this.batchSize_, this.markers_.length);
        for (let i = iFirst; i < iLast; i++) {
            const marker = this.markers_[i];
            if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
                if (!this.ignoreHidden_ ||
                    (this.ignoreHidden_ && marker.getVisible())) {
                    this.addToClosestCluster_(marker);
                }
            }
        }
        if (iLast < this.markers_.length) {
            this.timerRefStatic = window.setTimeout(() => {
                this.createClusters_(iLast);
            }, 0);
        }
        else {
            delete this.timerRefStatic;
            google.maps.event.trigger(this, "clusteringend", this);
            for (let i = 0; i < this.clusters_.length; i++) {
                this.clusters_[i].updateIcon();
            }
        }
    }
    /**
     * The default function for determining the label text and style
     * for a cluster icon.
     *
     * @param markers The array of markers represented by the cluster.
     * @param numStyles The number of marker styles available.
     * @return The information resource for the cluster.
     */
    static CALCULATOR(markers, numStyles) {
        let index = 0;
        const count = markers.length;
        let dv = count;
        while (dv !== 0) {
            dv = Math.floor(dv / 10);
            index++;
        }
        index = Math.min(index, numStyles);
        return {
            text: count.toString(),
            index: index,
            title: ""
        };
    }
    /**
     * Generates default styles augmented with user passed values.
     * Useful when you want to override some default values but keep untouched
     *
     * @param overrides override default values
     */
    static withDefaultStyle(overrides) {
        return Object.assign({ textColor: "black", textSize: 11, textDecoration: "none", textLineHeight: overrides.height, fontWeight: "bold", fontStyle: "normal", fontFamily: "Arial,sans-serif", backgroundPosition: "0 0" }, overrides);
    }
}
/**
 * The number of markers to process in one batch.
 */
MarkerClusterer.BATCH_SIZE = 2000;
/**
 * The number of markers to process in one batch (IE only).
 */
MarkerClusterer.BATCH_SIZE_IE = 500;
/**
 * The default root name for the marker cluster images.
 */
MarkerClusterer.IMAGE_PATH = "../images/m";
/**
 * The default extension name for the marker cluster images.
 */
MarkerClusterer.IMAGE_EXTENSION = "png";
/**
 * The default array of sizes for the marker cluster images.
 */
MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90];

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

export default MarkerClusterer;
//# sourceMappingURL=markerclustererplus.esm.js.map
