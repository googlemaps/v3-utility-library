import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

const babelOptions = {
  extensions: [".js", ".ts"],
  
  presets: ["@babel/env"]
};

export default [
  {
    input: "src/markerclusterer.js",
    plugins: [babel(babelOptions), terser()],
    output: {
      file: "dist/markerclusterer.umd.js",
      format: "umd",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    plugins: [babel(babelOptions), terser()],
    output: {
      file: "dist/markerclusterer.min.js",
      format: "iife",
      name: "MarkerClusterer"
    }
  },
  {
    input: "src/markerclusterer.js",
    output: {
      file: "dist/markerclusterer.esm.js",
      format: "esm"
    }
  }
];
