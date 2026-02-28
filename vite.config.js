import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'extension-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'content_script.js'),
      output: {
        format: 'iife',
        entryFileNames: 'content_script.js',
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'icons', dest: '.' },
      ],
    }),
  ],
});
