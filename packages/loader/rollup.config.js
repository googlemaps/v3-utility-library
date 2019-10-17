import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";

var terserOptions = { output: { comments: "" } };

export default [
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs(), terser(terserOptions)],
    output: {
      file: "dist/loader.umd.js",
      format: "umd",
      name: "google.maps.plugins.loader",
      sourcemap: true
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs(), terser(terserOptions)],
    output: {
      file: "dist/loader.min.js",
      format: "iife",
      name: "google.maps.plugins.loader"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs()],
    output: {
      file: "dist/loader.dev.js",
      format: "iife",
      name: "google.maps.plugins.loader"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: {
      file: "dist/loader.esm.js",
      format: "esm",
      sourcemap: true
    }
  }
];
