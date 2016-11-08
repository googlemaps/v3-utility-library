MarkerWithLabel for V3
======================

## Description

MarkerWithLabel extends the Google Maps JavaScript API V3 google.maps.Marker class.
MarkerWithLabel allows you to define markers with associated labels. As you would expect, if the marker is draggable, so too will be the label. In addition, a marker with a label responds to all mouse events in the same manner as a regular marker. It also fires mouse events and "property changed" events just as a regular marker would. Version 1.1 adds support for the raiseOnDrag feature introduced in API V3.3.

If you drag a marker by its label, you can cancel the drag and return the marker to its original position by pressing the Esc key. This doesn't work if you drag the marker itself because this feature is not (yet) supported in the google.maps.Marker class. 

###How it Works:

The MarkerManager places its markers onto a grid, similar to the map tiles. When the user moves the viewport, it computes which grid cells have entered or left the viewport, and shows or hides all the markers in those cells. (If the users scrolls the viewport beyond the markers that are loaded, no markers will be visible until the EVENT_moveend triggers an update.) In practical consequences, this allows 10,000 markers to be distributed over a large area, and as long as only 100-200 are visible in any given viewport, the user will see good performance corresponding to the 100 visible markers, rather than poor performance corresponding to the total 10,000 markers. Note that some code is optimized for speed over space, with the goal of accommodating thousands of markers.

[Read more][more]

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/markerwithlabel/CONTRIB.md
[more]: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerwithlabel/docs/reference.html