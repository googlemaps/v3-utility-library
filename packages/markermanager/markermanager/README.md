MarkerManager v3
================

## Description

Marker manager is an interface between the map and the user, designed to manage adding and removing many points when the viewport changes. 

###How it Works:

The MarkerManager places its markers onto a grid, similar to the map tiles. When the user moves the viewport, it computes which grid cells have entered or left the viewport, and shows or hides all the markers in those cells. (If the users scrolls the viewport beyond the markers that are loaded, no markers will be visible until the EVENT_moveend triggers an update.) In practical consequences, this allows 10,000 markers to be distributed over a large area, and as long as only 100-200 are visible in any given viewport, the user will see good performance corresponding to the 100 visible markers, rather than poor performance corresponding to the total 10,000 markers. Note that some code is optimized for speed over space, with the goal of accommodating thousands of markers.

[Read more][more]

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
[contrib]: https://github.com/googlemaps/v3-utility-library/blob/master/markermanager/CONTRIB.md
[more]: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markermanager/docs/reference.html