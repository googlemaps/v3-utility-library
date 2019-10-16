/// <reference types="@types/googlemaps" />

interface Options {
    apiKey: string;
    version?: string;
    libraries?: Array<string>;
    channel?: string;
    language?: string;
    client?: string;
    region?: string;
}

export class Loader {
    readonly WINDOW_CALLBACK_NAME: string = "__@google-maps/loader_callback";
    readonly URL: string = "https://maps.googleapis.com/maps/api/js";

    version: string;
    apiKey: string;
    libraries: Array<string>;
    channel: string;
    language: string;
    client: string;
    region: string;

    _callbacks: Array<() => any>;
    _done: boolean = false;

    constructor({ apiKey, libraries, channel, language, client, region, version }: Options) {
        this.version = version;
        this.apiKey = apiKey;
        this.libraries = libraries;
        this.channel = channel;
        this.language = language;
        this.client = client;
        this.region = region;
    }

    createUrl(): string {
        let url = this.URL;

        url += '?callback=' + this.WINDOW_CALLBACK_NAME;

        if (this.apiKey) {
            url += '&key=' + this.apiKey;
        }

        if (this.libraries.length > 0) {
            url += '&libraries=' + this.libraries.join(',');
        }

        if (this.client) {
            url += '&client=' + this.client;
        }

        if (this.channel) {
            url += '&channel=' + this.channel;
        }

        if (this.language) {
            url += '&language=' + this.language;
        }

        if (this.region) {
            url += '&region=' + this.region;
        }

        if (this.version) {
            url += '&v=' + this.version;
        }

        return url;
    }

    load(): Promise<void> {
        return this.loadPromise();
    }

    loadPromise(): Promise<any> {
        return new Promise((resolve) => {
            this.loadCallback(() => {
                resolve()
            })
        });
    }

    loadCallback(fn: () => any): void {
        this._callbacks.push(fn)
        this._load()
    }

    _setScript() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.createUrl();

        document.body.appendChild(script);
    }
    _setLoadEventCallback() {
        document.addEventListener("load", this._loadEventCallback)
    }
    _loadEventCallback() {
        // TODO
    }

    _setCallback() {
        window[this.WINDOW_CALLBACK_NAME] = function () {
            this._callback();
        };
    }
    _callback() {
        this._done = true;

        for (let i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i]();
        }

        this._callbacks = [];
    }

    _load() {
        if (this._done) {
            this._callback();
        } else {
            this._setCallback();
            this._setLoadEventCallback();
            this._setScript();
        }
    }
}