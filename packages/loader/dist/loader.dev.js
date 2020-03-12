this.google = this.google || {};
this.google.maps = this.google.maps || {};
this.google.maps.plugins = this.google.maps.plugins || {};
this.google.maps.plugins.loader = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
  /// <reference types="@types/googlemaps" />
  var Loader = /*#__PURE__*/function () {
    function Loader(_ref) {
      var apiKey = _ref.apiKey,
          _ref$libraries = _ref.libraries,
          libraries = _ref$libraries === void 0 ? [] : _ref$libraries,
          channel = _ref.channel,
          language = _ref.language,
          clientId = _ref.clientId,
          region = _ref.region,
          version = _ref.version;

      _classCallCheck(this, Loader);

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

    _createClass(Loader, [{
      key: "createUrl",
      value: function createUrl() {
        var url = this.URL;
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
    }, {
      key: "load",
      value: function load() {
        return this.loadPromise();
      }
    }, {
      key: "loadPromise",
      value: function loadPromise() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          _this.loadCallback(function (err) {
            if (!err) {
              resolve();
            } else {
              reject(err);
            }
          });
        });
      }
    }, {
      key: "loadCallback",
      value: function loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
      }
    }, {
      key: "setScript",
      value: function setScript() {
        var url = this.createUrl();
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onerror = this.loadErrorCallback;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);
      }
    }, {
      key: "loadErrorCallback",
      value: function loadErrorCallback(e) {
        this.onerrorEvent = e;
        this.callback();
      }
    }, {
      key: "setCallback",
      value: function setCallback() {
        window[this.CALLBACK] = this.callback.bind(this);
      }
    }, {
      key: "callback",
      value: function callback() {
        var _this2 = this;

        this.done = true;
        this.loading = false;
        this.callbacks.forEach(function (cb) {
          cb(_this2.onerrorEvent);
        });
        this.callbacks = [];
      }
    }, {
      key: "execute",
      value: function execute() {
        if (this.done) {
          this.callback();
        } else {
          if (this.loading) ; else {
            this.loading = true;
            this.setCallback();
            this.setScript();
          }
        }
      }
    }]);

    return Loader;
  }();

  exports.Loader = Loader;

  return exports;

}({}));
