import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/markerclusterer.js",
    plugins: [terser()],
    output: {
      file: "dist/markerclustererplus.umd.js",
      format: "umd",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    plugins: [terser()],
    output: {
      file: "dist/markerclustererplus.min.js",
      format: "iife",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    output: {
      file: "dist/markerclustererplus.esm.js",
      format: "esm"
    }
  }
];
