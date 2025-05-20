/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
// @ts-ignore
import copy from 'vite-plugin-copy';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        // serviceWorker: path.resolve(__dirname, 'src/firebase-messaging-sw.js'),  // Asegúrate de incluir tu SW aquí
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})


