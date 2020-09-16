import path from 'path'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import compiler from '@ampproject/rollup-plugin-closure-compiler'
import commonjs from '@rollup/plugin-commonjs'

const root = process.platform === 'win32' ? path.resolve('/') : '/'
const external = (id) => {
  if (['react', 'react-reconciler', 'scheduler', 'prop-types', 'object-assign'].some((name) => id.startsWith(name)))
    return false
  return !id.startsWith('.') && !id.startsWith(root)
}
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']

const getBabelOptions = ({ useESModules }, targets) => ({
  babelrc: false,
  extensions,
  exclude: '**/node_modules/**',
  babelHelpers: 'runtime',
  presets: [
    ['@babel/preset-env', { loose: true, modules: false, targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/transform-runtime', { regenerator: false, useESModules }]],
})

export default [
  {
    input: `./src/index.js`,
    output: { file: `dist/index.js`, format: 'esm' },
    external,
    plugins: [
      json(),
      babel(getBabelOptions({ useESModules: true }, 'node')),
      commonjs(),
      resolve({ extensions }),
      compiler({ compilation_level: 'SIMPLE', jscomp_off: 'checkVars' }),
      sizeSnapshot(),
    ],
  },
  {
    input: `./src/index.js`,
    output: { file: `dist/index.cjs.js`, format: 'cjs' },
    external,
    plugins: [
      json(),
      babel(getBabelOptions({ useESModules: false })),
      commonjs(),
      sizeSnapshot(),
      resolve({ extensions }),
      terser(),
    ],
  },
]
