import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";

var terserOptions = {
  mangle: {
    properties: {
      regex: /^_/
    }
  },
  compress: {
    passes: 2,
    ecma: 6
  },
  module: true,
  output: { comments: "" }
};

export default [
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs(), terser(terserOptions)],
    output: {
      file: "dist/jest-mocks.umd.js",
      format: "umd",
      name: "google.maps.plugins.jest-mocks",
      sourcemap: true
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), terser(terserOptions), commonjs()],
    output: {
      file: "dist/jest-mocks.min.js",
      format: "iife",
      name: "google.maps.plugins.jest-mocks"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs()],
    output: {
      file: "dist/jest-mocks.dev.js",
      format: "iife",
      name: "google.maps.plugins.jest-mocks"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: {
      file: "dist/jest-mocks.esm.js",
      format: "esm",
      sourcemap: true
    }
  }
];
