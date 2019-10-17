/// <reference types="@types/jest" />
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loader, LoaderOptions } from "./loader";

test.each([
  [
    {},
    "https://maps.googleapis.com/maps/api/js?callback=__google_maps_callback"
  ],
  [
    { apiKey: "foo" },
    "https://maps.googleapis.com/maps/api/js?callback=__google_maps_callback&key=foo"
  ]
])("createUrl is correct", (options: LoaderOptions, expected: string) => {
  const loader = new Loader(options);
  expect(loader.createUrl()).toEqual(expected);
});
