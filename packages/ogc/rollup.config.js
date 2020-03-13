import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const babelOptions = {
  extensions: [".js", ".ts"]
};

export default [
  {
    input: "src/index.ts",
    plugins: [
      typescript(),
      resolve(),
      babel(babelOptions),
      commonjs(),
      terser({ output: { comments: "" } })
    ],
    output: {
      file: "dist/ogc.umd.js",
      format: "umd",
      name: "google.maps.plugins.ogc",
      sourcemap: true
    }
  },
  {
    input: "src/index.ts",
    plugins: [
      typescript(),
      resolve(),
      babel(babelOptions),
      commonjs(),
      terser({ output: { comments: "" } })
    ],
    output: {
      file: "dist/ogc.min.js",
      format: "iife",
      name: "google.maps.plugins.ogc"
    }
  },
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: {
      file: "dist/ogc.esm.js",
      format: "esm",
      sourcemap: true
    }
  }
];
