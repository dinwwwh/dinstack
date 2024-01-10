import baseConfig from '../@web/tailwind.config'
import { resolve } from 'path'
import type { Config } from 'tailwindcss'

const config = {
  ...baseConfig,
  content: [
    ...baseConfig.content,
    resolve(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './content/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './lib/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './popup/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './providers/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './sidepanel/**/*.{js,ts,jsx,tsx}'),
    resolve(__dirname, './layouts/**/*.{js,ts,jsx,tsx}'),
  ],
} satisfies Config

export default config
