import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'


const commonPlugins = [
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
export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/jscada.min.js',
        format: 'cjs',
      },
    ],
    plugins: [...commonPlugins, uglify()]
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
    plugins: commonPlugins
  },
  {
    input: './src/index.ts',
    output: [
      {
        name: 'JScada',
        file: './dist/jscada.iife.min.js',
        format: 'iife',
      }
    ],
    plugins: [ ...commonPlugins, uglify() ]
  },
]
