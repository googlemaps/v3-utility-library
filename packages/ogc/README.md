OGC Plugin for Google Maps v3
=============================

## Description

Add a WmsMapType to Google Maps.

## NPM

Available via NPM as the package `@googlemaps/ogc`

## Documentation

The reference documentation can be found at this [link](https://googlemaps.github.io/v3-utility-library/modules/_googlemaps_ogc.html). 

## Examples

See the [WMS](https://googlemaps.github.io/v3-utility-library/packages/ogc/examples/wmslayer.html) example in action.


``` javascript
import { WmsMapType } from '@googlemaps/ogc';

map = new google.maps.Map(document.getElementById("map"), mapOptions);

landCoverMapType = WmsMapType({
    url: "https://www.mrlc.gov/geoserver/NLCD_Land_Cover/wms?",
    layers: "mrlc_display:NLCD_2016_Land_Cover_L48",
    name: "Land Cover",
    alt: "NLCD_2016_Land_Cover_L48",
    maxZoom: 18
});

map.mapTypes.set("landcover", landCoverMapType);
map.setMapTypeId("landcover");

// alternative as overlay
map.overlayMapTypes.push(landCoverMapType);
```

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
