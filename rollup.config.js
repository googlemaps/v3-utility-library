import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

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
    // Adding in a TS definition file. Should not impact the generation of the ESM package
    plugins: [typescript({
      tsconfig: "tsconfig.json",
    })],
    output: {
      file: "dist/markerclustererplus.esm.js",
      format: "esm"
    }
  }
];
