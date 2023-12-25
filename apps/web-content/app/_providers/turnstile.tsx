'use client'

import { TurnstileProvider as BaseProvider } from '@turnstile-react/providers/turnstile'
import { env } from '@web-content/lib/env'
import { useTheme } from 'next-themes'
import { match } from 'ts-pattern'

export function TurnstileProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <BaseProvider
      turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      theme={match(theme)
        .with('dark', () => 'dark' as const)
        .with('light', () => 'light' as const)
        .otherwise(() => 'auto' as const)}
    >
      {children}
    </BaseProvider>
  )
}
