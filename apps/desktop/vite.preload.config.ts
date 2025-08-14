import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'node18',
    rollupOptions: {
      input: resolve(__dirname, 'src/preload.ts'),
      output: {
        entryFileNames: 'preload.js'
      },
      external: ['electron'],
    }
  }
});