import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'
import ts from 'rollup-plugin-ts'
import dts from 'rollup-plugin-dts'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/selection.js',
        format: 'es'
      },
      {
        file: 'dist/selection.cjs',
        format: 'cjs'
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      ts(),
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }),
      terser()
    ]
  },
  {
    input: 'src/types.d.ts',
    output: [{ file: 'dist/types.d.ts', format: 'es' }],
    plugins: [dts()]
  }
])
