import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import baseConfig from '../@ui/configs/tailwind.config'

export default {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        title: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Config
