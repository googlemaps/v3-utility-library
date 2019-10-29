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
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface LoaderOptions {
  apiKey: string;
  version?: string;
  libraries?: string[];
  channel?: string;
  language?: string;
  clientId?: string;
  region?: string;
}

export class Loader {
  public version: string;
  public apiKey: string;
  public libraries: string[];
  public channel: string;
  public language: string;
  public clientId: string;
  public region: string;

  private CALLBACK = "__google_maps_callback";
  private URL = "https://maps.googleapis.com/maps/api/js";
  private callbacks: Array<(e: Event) => any> = [];
  private done = false;
  private loading = false;
  private onerrorEvent: Event;

  constructor({
    apiKey,
    libraries = [],
    channel,
    language,
    clientId,
    region,
    version
  }: LoaderOptions) {
    this.version = version;
    this.apiKey = apiKey;
    this.libraries = libraries;
    this.channel = channel;
    this.language = language;
    this.clientId = clientId;
    this.region = region;
  }

  public createUrl(): string {
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

  public load(): Promise<void> {
    return this.loadPromise();
  }

  public loadPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadCallback((err: Event) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public loadCallback(fn: (e: Event) => any): void {
    this.callbacks.push(fn);
    this.execute();
  }

  private setScript(): void {
    const url = this.createUrl();
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
    script.onerror = this.loadErrorCallback;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  }

  private loadErrorCallback(e: Event): void {
    this.onerrorEvent = e;
    this.callback();
  }

  private setCallback(): void {
    (window as any)[this.CALLBACK] = this.callback.bind(this);
  }

  private callback(): void {
    this.done = true;
    this.loading = false;

    this.callbacks.forEach(cb => {
      cb(this.onerrorEvent);
    });

    this.callbacks = [];
  }

  private execute(): void {
    if (this.done) {
      this.callback();
    } else {
      if (this.loading) {
        // do nothing but wait
      } else {
        this.loading = true;
        this.setCallback();
        this.setScript();
      }
    }
  }
}
