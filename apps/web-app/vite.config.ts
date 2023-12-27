import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@web-app': resolve(__dirname, './'),
      '@ui/_/..': resolve(__dirname, '../../packages/ui'),
      '@ui': resolve(__dirname, '../../packages/ui'),
      '@shared': resolve(__dirname, '../../packages/shared'),
      '@shared-react': resolve(__dirname, '../../packages/shared-react'),
      '@turnstile-react': resolve(__dirname, '../../packages/turnstile-react'),
      '@auth-react': resolve(__dirname, '../../packages/auth-react'),
    },
  },
})
