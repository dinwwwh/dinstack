import baseConfig from '../@web/tailwind.config'
import { resolve } from 'path'
import type { Config } from 'tailwindcss'

const config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    resolve(__dirname, './app/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
  ],
} satisfies Config

export default config
