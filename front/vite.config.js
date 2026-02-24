import { fileURLToPath, URL } from 'node:url'
//import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    //tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'jgsw0c0ggggwsg4ss000skgc.72.62.179.60.sslip.io'
    ],
    port: 5173 // ou ton port actuel
  },
})

