# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.1](https://github.com/googlemaps/v3-utility-library/compare/@google/markerclustererplus@5.0.0...@google/markerclustererplus@5.0.1) (2020-02-11)


### Bug Fixes

* **markerclustererplus:** re-render icons on end of clustering cycle ([#613](https://github.com/googlemaps/v3-utility-library/issues/613)) ([6e73676](https://github.com/googlemaps/v3-utility-library/commit/6e736768cb7dd2f645cdaa8cb5684967b6bc78f8))





# [5.0.0](https://github.com/googlemaps/v3-utility-library/compare/@google/markerclustererplus@4.0.1...@google/markerclustererplus@5.0.0) (2020-02-10)


### Bug Fixes

* **@google/markerclustererplus:** remove src/* from npm ([#603](https://github.com/googlemaps/v3-utility-library/issues/603)) ([3e5690b](https://github.com/googlemaps/v3-utility-library/commit/3e5690be4bc85e4695f263e116c20a61c8e8ee59))


### Features

* **markerclustererplus:** add `className` property for ClusterIconStyle ([#607](https://github.com/googlemaps/v3-utility-library/issues/607)) ([88d221b](https://github.com/googlemaps/v3-utility-library/commit/88d221bf624cc8ab4b66ac68c1e3b41e8468c378))


### BREAKING CHANGES

* **markerclustererplus:** When `MarkerClustererOptions.style` is passed to constructor,
it completely replaces defaults and does not extend defaults as before.

  If you want to override only some values, but not replace whole styles use `MarkerClusterer.withDefaultStyle()` function (see [`examples/events_example.html`](https://github.com/googlemaps/v3-utility-library/blob/master/packages/markerclustererplus/examples/events_example.html) for usage examples).

  Overriding whole styles is useful when `ClusterIconStyle.className` is used and styling
  is performed using external CSS styles (which is recommended way).





## [4.0.1](https://github.com/googlemaps/v3-utility-library/compare/@google/markerclustererplus@4.0.0...@google/markerclustererplus@4.0.1) (2019-12-23)

**Note:** Version bump only for package @google/markerclustererplus





# [4.0.0](https://github.com/googlemaps/v3-utility-library/compare/@google/markerclustererplus@3.0.6...@google/markerclustererplus@4.0.0) (2019-12-17)


* refactor(@google/markerclustererplus)!: rewrite source to typescript (#590) ([0d2b57d](https://github.com/googlemaps/v3-utility-library/commit/0d2b57dbc76265b8abda51cc006ff1222e5e8baf)), closes [#590](https://github.com/googlemaps/v3-utility-library/issues/590)


### BREAKING CHANGES

* Type of ClusterIconStyle.anchorText and ClusterIconStyle.anchorIcon changed from number[] to tuple [number, number].





## [3.0.6](https://github.com/googlemaps/v3-utility-library/compare/@google/markerclustererplus@3.0.5...@google/markerclustererplus@3.0.6) (2019-12-09)


### Bug Fixes

* transpile code for iife and umd outputs ([#586](https://github.com/googlemaps/v3-utility-library/issues/586)) ([fb9ad06](https://github.com/googlemaps/v3-utility-library/commit/fb9ad066cbf5d87cffcda2c435196ad20fed56f1))





## 2.1.13 (2019-10-04)

**Note:** Version bump only for package @google/markerclustererplus





## 2.1.12 (2019-10-04)

**Note:** Version bump only for package @google/markerclustererplus
