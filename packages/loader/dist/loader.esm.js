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
class Loader {
    constructor({ apiKey, libraries = [], channel, language, clientId, region, version }) {
        this.CALLBACK = "__google_maps_callback";
        this.URL = "https://maps.googleapis.com/maps/api/js";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.version = version;
        this.apiKey = apiKey;
        this.libraries = libraries;
        this.channel = channel;
        this.language = language;
        this.clientId = clientId;
        this.region = region;
    }
    createUrl() {
        let url = this.URL;
        url += "?callback=" + this.CALLBACK;
        if (this.apiKey) {
            url += "&key=" + this.apiKey;
        }
        if (this.libraries.length > 0) {
            url += "&libraries=" + this.libraries.join(",");
        }
        if (this.clientId) {
            url += "&client=" + this.clientId;
        }
        if (this.channel) {
            url += "&channel=" + this.channel;
        }
        if (this.language) {
            url += "&language=" + this.language;
        }
        if (this.region) {
            url += "&region=" + this.region;
        }
        if (this.version) {
            url += "&v=" + this.version;
        }
        return url;
    }
    load() {
        return this.loadPromise();
    }
    loadPromise() {
        return new Promise((resolve, reject) => {
            this.loadCallback((err) => {
                if (!err) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    }
    loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
    }
    setScript() {
        const url = this.createUrl();
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onerror = this.loadErrorCallback;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);
    }
    loadErrorCallback(e) {
        this.onerrorEvent = e;
        this.callback();
    }
    setCallback() {
        window[this.CALLBACK] = this.callback.bind(this);
    }
    callback() {
        this.done = true;
        this.loading = false;
        this.callbacks.forEach(cb => {
            cb(this.onerrorEvent);
        });
        this.callbacks = [];
    }
    execute() {
        if (this.done) {
            this.callback();
        }
        else {
            if (this.loading) ;
            else {
                this.loading = true;
                this.setCallback();
                this.setScript();
            }
        }
    }
}

export { Loader };
//# sourceMappingURL=loader.esm.js.map
