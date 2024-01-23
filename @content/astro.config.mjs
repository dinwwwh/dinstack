import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import orama from '@orama/plugin-astro'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  srcDir: './',
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'github-dark-dimmed' },
      gfm: true,
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    icon({
      iconDir: './icons',
    }),
    orama({
      content: {
        pathMatcher: /(blog\/.+)|(docs)/,
        contentSelectors: ['article', 'main'],
      },
    }),
  ],
  vite: {
    envPrefix: ['VITE_', 'PUBLIC_'],
    ssr: {
      noExternal: ['react-use'],
    },
  },
})
