Jest Mocks for Google Maps v3
=============================

## Description

Jest mocks for Google Maps in TypeScript. 

**Note:** Currently this is a partial set of mocks/stubs.

## NPM

Available via NPM as the package `@googlemaps/jest-mocks`

## Example

```typescript
import { initialize } from "@googlemaps/jest-mocks";

beforeEach(() => {
  initialize();
});

```

## Support

This library is community supported. We're comfortable enough with the stability and features of
the library that we want you to build real production applications on it.

If you find a bug, or have a feature suggestion, please [log an issue][issues]. If you'd like to
contribute, please read [How to Contribute][contrib].

[issues]: https://github.com/googlemaps/v3-utility-library/issues
