import * as vite from 'vite'
import * as path from 'node:path'

export default vite.defineConfig({
  resolve: {
    alias: {
      'react-nil': path.resolve(__dirname, 'src/index.tsx'),
    },
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    lib: {
      formats: ['cjs', 'es'],
      entry: 'src/index.tsx',
      fileName: '[name]',
    },
    rollupOptions: {
      external: (id: string) => !id.startsWith('.') && !path.isAbsolute(id),
      output: {
        sourcemapExcludeSources: true,
      },
    },
  },
  plugins: [
    {
      name: 'vite-tsc',
      generateBundle(options) {
        const ext = options.format === 'cjs' ? 'cts' : 'ts'
        this.emitFile({ type: 'asset', fileName: `index.d.${ext}`, source: `export * from '../src/index.tsx'` })
      },
    },
    {
      name: 'vite-minify',
      renderChunk: {
        order: 'post',
        async handler(code, { fileName }) {
          // Preserve pure annotations, but remove all other comments and whitespace
          code = code.replaceAll('/* @__PURE__ */', '__PURE__ || ')
          const result = await vite.transformWithEsbuild(code, fileName, { minify: true, target: 'es2020' })
          result.code = result.code.replaceAll('__PURE__||', '/*@__PURE__*/')
          return result
        },
      },
    },
  ],
})
