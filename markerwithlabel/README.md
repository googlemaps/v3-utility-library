MarkerWithLabel for V3
======================

## Description

MarkerWithLabel extends the Google Maps JavaScript API V3 google.maps.Marker class.
MarkerWithLabel allows you to define markers with associated labels. As you would expect, if the marker is draggable, so too will be the label. In addition, a marker with a label responds to all mouse events in the same manner as a regular marker. It also fires mouse events and "property changed" events just as a regular marker would. Version 1.1 adds support for the raiseOnDrag feature introduced in API V3.3.

If you drag a marker by its label, you can cancel the drag and return the marker to its original position by pressing the Esc key. This doesn't work if you drag the marker itself because this feature is not (yet) supported in the google.maps.Marker class. 

[Read more][more]

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/markerwithlabel/CONTRIB.md
[more]: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerwithlabel/docs/reference.html