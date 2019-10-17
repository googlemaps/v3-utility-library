Load for Google Maps v3
==================================

## Description
Load the Google Maps V3 script with dynamically.

## NPM

Available via NPM as the package `@google-maps/loader`

## Example

```
import { Loader } from '@google-maps/loader';

const loader = new Loader({
  apiKey: "",
  version: "weekly",
  libraries: ["places"]
});

const init = e => {
  new google.maps.Map(document.getElementById("map"), mapOptions);
};

// Promise
loader.load().then(init);

// Callback
loader.loadCallback(init);

```

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/packages/loader/CONTRIB.md
