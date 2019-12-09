import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";

const babelOptions = {
  extensions: [".js", ".ts"],
  rootMode: "upward",
  presets: ["@babel/env"]
};

export default [
  {
    input: "src/markerclusterer.js",
    plugins: [babel(babelOptions), terser()],
    output: {
      file: "dist/markerclustererplus.umd.js",
      format: "umd",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    plugins: [babel(babelOptions), terser()],
    output: {
      file: "dist/markerclustererplus.min.js",
      format: "iife",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    plugins: [babel(babelOptions)],
    output: {
      file: "dist/markerclustererplus.dev.js",
      format: "iife",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    // Adding in a TS definition file. Should not impact the generation of the ESM package
    plugins: [
      typescript({
        tsconfig: "tsconfig.json"
      })
    ],
    output: {
      file: "dist/markerclustererplus.esm.js",
      format: "esm"
    }
  }
];
