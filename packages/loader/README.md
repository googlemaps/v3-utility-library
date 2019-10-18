Loader for Google Maps v3
==================================

## Description
Load the Google Maps V3 script dynamically. This takes inspiration from the [google-maps](https://www.npmjs.com/package/google-maps) npm package but updates it with ES6, Promises, and TypeScript.

## NPM

Available via NPM as the package `@googlemaps/loader`

## Example

``` javascript
import { Loader } from '@googlemaps/loader';

const loader = new Loader({
  apiKey: "",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

```
Using a promise for when the script has loaded.
``` javascript
// Promise
loader
  .load()
  .then(() => {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  })
  .catch(e => {
    // do something
  });
```

Alternatively, if you want to use a callback.
``` javascript
// Callback
loader.loadCallback(e => {
  if (e) {
    console.log(e);
  } else {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  }
});

```

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/packages/loader/CONTRIB.md
