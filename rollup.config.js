import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/jscada.min.js',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      replace({
        exclude: 'node_modules/**',
        ___ENV___: JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
      uglify(),
      commonjs({
        namedExports: {
          'node_modules/mqtt/dist/mqtt.min.js': [ 'connect' ],
        }
      }),
    ]
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/jscada.js',
        format: 'cjs',
        banner: '/* JScada */',
        footer: '/* https://github.com/noru */',
      }
    ],
    plugins: [
      typescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      replace({
        exclude: 'node_modules/**',
        ___ENV___: JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
      commonjs({
        namedExports: {
          'node_modules/mqtt/dist/mqtt.min.js': [ 'connect' ],
        }
      }),
    ]
  },
]
