import manifest from './manifest.json'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      '@extension': resolve(__dirname, './'),
      '@api': resolve(__dirname, '../@api'),
      '@web': resolve(__dirname, '../@web'),
    },
  },
})
