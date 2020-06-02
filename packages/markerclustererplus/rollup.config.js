import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const babelOptions = {
  extensions: ['.js', '.ts'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: '> 0.5%, ie >= 11',
        },
        modules: false,
        spec: true,
        useBuiltIns: "usage",
        forceAllTransforms: true,
        corejs: {
          version: 3,
          proposals: false,
        },
      },
    ],
  ],
};

const terserOptions = {output: {comments: ''}};

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript(),
      babel(babelOptions),
      commonjs(),
      terser(terserOptions)
    ],
    output: [
      {
        file: 'dist/markerclustererplus.umd.js',
        format: 'umd',
        sourcemap: true,
        exports: 'default',
        name: 'MarkerClusterer',
      },
      {
        file: 'dist/markerclustererplus.min.js',
        format: 'iife',
        sourcemap: true,
        exports: 'default',
        name: 'MarkerClusterer',
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [
      typescript(),
      babel(babelOptions),
      terser(terserOptions)
    ],
    output: {
      file: 'dist/markerclustererplus.esm.js',
      format: 'esm',
      sourcemap: true,
      name: 'MarkerClusterer',
    },
  },
];
