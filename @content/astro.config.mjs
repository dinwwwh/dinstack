import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  srcDir: './',
  output: 'hybrid',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    icon({
      iconDir: './icons',
    }),
  ],
  adapter: cloudflare(),
})
