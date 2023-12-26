import { TurnstileProvider as BaseProvider } from '@turnstile-react/providers/turnstile'
import { env } from '@web/lib/env'

export function TurnstileProvider(props: { children: React.ReactNode }) {
  return (
    <BaseProvider theme="auto" turnstileSiteKey={env.TURNSTILE_SITE_KEY}>
      {props.children}
    </BaseProvider>
  )
}
