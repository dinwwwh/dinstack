import baseConfig from '../@web/tailwind.config'
import { resolve } from 'path'
import type { Config } from 'tailwindcss'

const config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    resolve(__dirname, './layouts/**/*.{js,ts,jsx,tsx,astro}'),
    resolve(__dirname, './components/**/*.{js,ts,jsx,tsx,astro}'),
    resolve(__dirname, './pages/**/*.{js,ts,jsx,tsx,astro}'),
    resolve(__dirname, './content/**/*.{md,mdx}'),
    resolve(__dirname, './lib/**/*.{js,ts,jsx,tsx,astro}'),
  ],
} satisfies Config

export default config
