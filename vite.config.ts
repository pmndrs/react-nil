import * as path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, transformWithEsbuild } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    target: 'es2020',
    lib: {
      formats: ['cjs', 'es'],
      entry: 'src/index.tsx',
      fileName: '[name]',
    },
    rollupOptions: {
      external: (id: string) => !id.startsWith('.') && !path.isAbsolute(id),
      treeshake: false,
      output: {
        preserveModules: true,
        sourcemapExcludeSources: true,
      },
    },
  },
  plugins: [
    react(),
    {
      name: 'vite-tsc',
      generateBundle(options) {
        const ext = options.format === 'cjs' ? 'cts' : 'ts'
        this.emitFile({ type: 'asset', fileName: `index.d.${ext}`, source: `export * from '../src'` })
      },
    },
    {
      name: 'vite-minify',
      renderChunk: {
        order: 'post',
        handler(code, { fileName }) {
          return transformWithEsbuild(code, fileName, { minify: true, target: 'es2018' })
        },
      },
    },
  ],
})
