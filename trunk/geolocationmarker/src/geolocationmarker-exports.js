/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @name GeolocationMarker Exports
 * @author Chad Killingsworth [chadkillingsworth at missouristate.edu]
 * Copyright 2012 Missouri State University
 * @fileoverview
 * Exports for compiling the GeolocationMarker library with Closure-compiler
 * for use in external code. When compiling the library with other user
 * scripts, these exports are not needed. 
 */

GeolocationMarker.prototype['getAccuracy'] = GeolocationMarker.prototype.getAccuracy;
GeolocationMarker.prototype['getBounds'] = GeolocationMarker.prototype.getBounds;
GeolocationMarker.prototype['getMap'] = GeolocationMarker.prototype.getMap;
GeolocationMarker.prototype['getPosition'] = GeolocationMarker.prototype.getPosition;
GeolocationMarker.prototype['setCircleOptions'] = GeolocationMarker.prototype.setCircleOptions;
GeolocationMarker.prototype['setMap'] = GeolocationMarker.prototype.setMap;
GeolocationMarker.prototype['setMarkerOptions'] = GeolocationMarker.prototype.setMarkerOptions;

window['GeolocationMarker'] = GeolocationMarker;
