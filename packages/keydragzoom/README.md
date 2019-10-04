KeyDragZoom for V3
===================

## Description

This library adds a drag zoom capability to a V3 Google map. When drag zoom is enabled, holding down a designated hot key (shift | ctrl | alt) while dragging a box around an area of interest will zoom the map in to that area when the mouse button is released. Optionally, a visual control can also be supplied for turning a drag zoom operation on and off. Only one line of code is needed: google.maps.Map.enableKeyDragZoom();

NOTE: Do not use Ctrl as the hot key with Google Maps JavaScript API V3 since, unlike with V2, it causes a context menu to appear when running on the Macintosh.
Note that if the map's container has a border around it, the border widths must be specified in pixel units (or as thin, medium, or thick). This is required because of an MSIE limitation.

[Read more][more]

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/keydragzoom/CONTRIB.md
[more]: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/keydragzoom/docs/reference.html