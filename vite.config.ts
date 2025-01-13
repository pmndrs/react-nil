import * as path from 'node:path'
import { defineConfig } from 'vite'

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
  ],
})
