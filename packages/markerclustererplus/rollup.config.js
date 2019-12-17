import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

const babelOptions = {
  extensions: ['.js', '.ts'],

  presets: ['@babel/env'],
};

const terserOptions = {output: {comments: ''}};

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript(),
      babel(babelOptions),
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
    ],
    output: {
      file: 'dist/markerclustererplus.esm.js',
      format: 'esm',
      sourcemap: true,
      name: 'MarkerClusterer',
    },
  },
];
