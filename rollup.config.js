import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: ['postcss'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        esModule: false,
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      babel({
        exclude: /node_modules/,
        sourceMaps: true,
        presets: [
          '@babel/preset-react'
        ]
      }),
    ]
  },
];
