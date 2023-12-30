import react from '@vitejs/plugin-react-swc'
import { CodeInspectorPlugin } from 'code-inspector-plugin'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    CodeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  resolve: {
    alias: {
      '@web': resolve(__dirname, './'),
      '@api': resolve(__dirname, '../@api'),
    },
  },
})
