import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const babelOptions = {
  extensions: [".js", ".ts"]
};

const terserOptions = {
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
    plugins: [
      typescript(),
      commonjs(),
      babel(babelOptions),
      terser(terserOptions)
    ],
    output: {
      file: "dist/markermanager.umd.js",
      format: "umd",
      name: "google.maps.plugins.markermanager",
      sourcemap: true
    }
  },
  {
    input: "src/index.ts",
    plugins: [
      typescript(),
      commonjs(),
      babel(babelOptions),
      terser(terserOptions)
    ],
    output: {
      file: "dist/markermanager.min.js",
      format: "iife",
      name: "google.maps.plugins.markermanager"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), commonjs(), babel(babelOptions)],
    output: {
      file: "dist/markermanager.dev.js",
      format: "iife",
      name: "google.maps.plugins.markermanager"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: {
      file: "dist/markermanager.esm.js",
      format: "esm",
      sourcemap: true
    }
  }
];
