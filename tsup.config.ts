import { defineConfig } from 'tsup';

export default defineConfig({
  noExternal: ['neoqs'],
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
})
