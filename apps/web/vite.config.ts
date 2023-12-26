import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@web': resolve(__dirname, './'),
      '@ui': resolve(__dirname, '../../packages/ui'),
      '@ui/_/../ui': resolve(__dirname, '../../packages/ui/ui'),
      '@shared-react': resolve(__dirname, '../../packages/shared-react'),
      '@turnstile-react': resolve(__dirname, '../../packages/turnstile-react'),
    },
  },
})
