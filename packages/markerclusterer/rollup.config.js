import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/markerclusterer.js',
        plugins: [terser()],
        output: {
            file: 'dist/markerclusterer.umd.js',
            format: 'umd',
            name: 'MarkerClusterer',
            esModule: false
        }
    },
    {
        input: 'src/markerclusterer.js',
        plugins: [terser()],
        output: {
            file: 'dist/markerclusterer.min.js',
            format: 'iife',
            name: 'window',
            extend: true,
        }
    },
    {
        input: 'src/markerclusterer.js',
        output: {
            file: 'dist/markerclusterer.esm.js',
            format: 'esm'
        }
    },
    {
        input: 'src/markerclusterer.js',
        output: {
            file: 'dist/markerclusterer.common.js',
            format: 'cjs'
        }
    },
];