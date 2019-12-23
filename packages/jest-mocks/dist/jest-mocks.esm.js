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
class LatLng {
    constructor(literal, noWrap) {
        this.equals = jest
            .fn()
            .mockImplementation((other) => false);
        this.lat = jest.fn().mockImplementation(() => 0);
        this.lng = jest.fn().mockImplementation(() => 0);
        this.toString = jest.fn().mockImplementation(() => "");
        this.toUrlValue = jest.fn().mockImplementation((precision) => "");
        this.toJSON = jest.fn().mockImplementation(() => {
            return { lat: 0, lng: 0 };
        });
    }
}
class LatLngBounds {
    constructor(sw, ne) {
        this.contains = jest
            .fn()
            .mockImplementation((latLng) => false);
        this.equals = jest
            .fn()
            .mockImplementation((other) => false);
        this.extend = jest
            .fn()
            .mockImplementation((point) => this);
        this.getCenter = jest
            .fn()
            .mockImplementation(() => new google.maps.LatLng({ lat: 0, lng: 0 }));
        this.getNorthEast = jest
            .fn()
            .mockImplementation(() => new google.maps.LatLng({ lat: 0, lng: 0 }));
        this.getSouthWest = jest
            .fn()
            .mockImplementation(() => new google.maps.LatLng({ lat: 0, lng: 0 }));
        this.intersects = jest
            .fn()
            .mockImplementation((other) => false);
        this.isEmpty = jest.fn().mockImplementation(() => false);
        this.toJSON = jest.fn().mockImplementation(() => {
            return { east: 0, north: 0, south: 0, west: 0 };
        });
        this.toSpan = jest
            .fn()
            .mockImplementation(() => new google.maps.LatLng({ lat: 0, lng: 0 }));
        this.toString = jest.fn().mockImplementation(() => "");
        this.toUrlValue = jest.fn().mockImplementation((precision) => "");
        this.union = jest
            .fn()
            .mockImplementation((other) => this);
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
/* eslint-disable @typescript-eslint/no-explicit-any */
class MVCObject {
    constructor() {
        this.addListener = jest
            .fn()
            .mockImplementation((eventName, handler) => { });
        this.bindTo = jest
            .fn()
            .mockImplementation((key, target, targetKey, noNotify) => { });
        this.changed = jest.fn().mockImplementation((key) => { });
        this.get = jest.fn().mockImplementation((key) => { });
        this.notify = jest.fn().mockImplementation((key) => { });
        this.set = jest.fn().mockImplementation((key, value) => { });
        this.setValues = jest.fn().mockImplementation((values) => { });
        this.unbind = jest.fn().mockImplementation((key) => { });
        this.unbindAll = jest.fn().mockImplementation(() => { });
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
// eslint-disable-next-line @typescript-eslint/class-name-casing
class Map_ extends MVCObject {
    constructor(mapDiv, opts) {
        super();
        this.fitBounds = jest
            .fn()
            .mockImplementation((bounds, padding) => { });
        this.getBounds = jest
            .fn()
            .mockImplementation(() => null);
        this.getCenter = jest
            .fn()
            .mockImplementation(() => new LatLng({ lat: 0, lng: 0 }));
        this.getDiv = jest.fn().mockImplementation(() => {
            return jest.fn();
        });
        this.getHeading = jest.fn().mockImplementation(() => 0);
        this.getMapTypeId = jest
            .fn()
            .mockImplementation(() => google.maps.MapTypeId.ROADMAP);
        this.getProjection = jest
            .fn()
            .mockImplementation(() => jest.fn());
        this.getStreetView = jest
            .fn()
            .mockImplementation(() => jest.fn());
        this.getTilt = jest.fn().mockImplementation(() => 0);
        this.getZoom = jest.fn().mockImplementation(() => 0);
        this.panBy = jest.fn().mockImplementation((x, y) => { });
        this.panTo = jest
            .fn()
            .mockImplementation((latLng) => { });
        this.panToBounds = jest
            .fn()
            .mockImplementation((latLngBounds, padding) => { });
        this.setCenter = jest
            .fn()
            .mockImplementation((latlng) => { });
        this.setHeading = jest.fn().mockImplementation((heading) => { });
        this.setMapTypeId = jest
            .fn()
            .mockImplementation((mapTypeId) => { });
        this.setOptions = jest
            .fn()
            .mockImplementation((options) => { });
        this.setStreetView = jest
            .fn()
            .mockImplementation((panorama) => { });
        this.setTilt = jest.fn().mockImplementation((tilt) => { });
        this.setZoom = jest.fn().mockImplementation((zoom) => { });
        this.setClickableIcons = jest
            .fn()
            .mockImplementation((clickable) => { });
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
class Marker extends MVCObject {
    constructor(opts) {
        super();
        this.getAnimation = jest
            .fn()
            .mockImplementation(() => null);
        this.getClickable = jest.fn().mockImplementation(() => null);
        this.getCursor = jest
            .fn()
            .mockImplementation(() => null);
        this.getDraggable = jest
            .fn()
            .mockImplementation(() => null);
        this.getIcon = jest
            .fn()
            .mockImplementation(() => null);
        this.getLabel = jest
            .fn()
            .mockImplementation(() => null);
        this.getMap = jest
            .fn()
            .mockImplementation(() => null);
        this.getOpacity = jest
            .fn()
            .mockImplementation(() => null);
        this.getPosition = jest
            .fn()
            .mockImplementation(() => new LatLng({ lat: 0, lng: 0 }));
        this.getShape = jest
            .fn()
            .mockImplementation(() => null);
        this.getTitle = jest
            .fn()
            .mockImplementation(() => null);
        this.getVisible = jest.fn().mockImplementation(() => null);
        this.getZIndex = jest
            .fn()
            .mockImplementation(() => null);
        this.setAnimation = jest
            .fn()
            .mockImplementation((animation) => { });
        this.setClickable = jest.fn().mockImplementation((flag) => { });
        this.setCursor = jest.fn().mockImplementation((cursor) => { });
        this.setDraggable = jest
            .fn()
            .mockImplementation((flag) => { });
        this.setIcon = jest
            .fn()
            .mockImplementation((icon) => { });
        this.setLabel = jest
            .fn()
            .mockImplementation((label) => { });
        this.setMap = jest
            .fn()
            .mockImplementation((map) => { });
        this.setOpacity = jest
            .fn()
            .mockImplementation((opacity) => { });
        this.setOptions = jest
            .fn()
            .mockImplementation((options) => { });
        this.setPosition = jest
            .fn()
            .mockImplementation((latlng) => { });
        this.setShape = jest
            .fn()
            .mockImplementation((shape) => { });
        this.setTitle = jest.fn().mockImplementation((title) => { });
        this.setVisible = jest.fn().mockImplementation((visible) => { });
        this.setZIndex = jest.fn().mockImplementation((zIndex) => { });
        this.addListener = jest
            .fn()
            .mockImplementation((eventName, handler) => jest.fn());
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
class Point {
    constructor(x, y) {
        this.toString = jest.fn().mockImplementation(() => {
            return "";
        });
        this.x = x;
        this.y = y;
    }
    equals(other) {
        return other.x === this.x && other.y === this.y;
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
class Size {
    constructor(width, height, widthUnit, heightUnit) {
        this.toString = jest.fn().mockImplementation(() => {
            return "";
        });
        this.width = width;
        this.height = height;
    }
    equals(other) {
        return other.height === this.height && other.width === this.width;
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
const initialize = function () {
    global.google = {
        maps: {
            ImageMapType: jest.fn(),
            Marker: Marker,
            Map: Map_,
            Point: Point,
            Size: Size,
            MVCObject: MVCObject,
            LatLng: LatLng,
            LatLngBounds: LatLngBounds,
            event: {
                addListener: jest.fn(),
                addListenerOnce: jest.fn(),
                addDomListerner: jest.fn(),
                addDomListernerOnce: jest.fn(),
                clearInstanceListeners: jest.fn(),
                clearListeners: jest.fn(),
                removeListener: jest.fn(),
                trigger: jest.fn()
            }
        }
    };
};

export { LatLng, LatLngBounds, MVCObject, Map_ as Map, Marker, Size, initialize };
//# sourceMappingURL=jest-mocks.esm.js.map
