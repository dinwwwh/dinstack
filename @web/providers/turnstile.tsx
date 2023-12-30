import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
import * as Portal from '@radix-ui/react-portal'
import { env } from '@web/lib/env'
import { cn } from '@web/lib/utils'
import { useSystemStore } from '@web/stores/system'
import { useTurnstileStore } from '@web/stores/turnstile'
import { useId, useRef } from 'react'

export function TurnstileProvider(props: { children: React.ReactNode }) {
  const turnstileStore = useTurnstileStore()
  const turnstileRef = useRef<TurnstileInstance>(null)
  const id = useId()
  const systemStore = useSystemStore()

  return (
    <>
      {props.children}
      <Portal.Root
        className={cn(
          'pointer-events-auto fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-background/80',
          {
            'top-[100%] bottom-[-100%]': !turnstileStore.isShowChallenge,
          },
        )}
      >
        <Turnstile
          ref={turnstileRef}
          id={id}
          siteKey={env.TURNSTILE_SITE_KEY}
          options={{
            theme: systemStore.theme === 'system' ? 'auto' : systemStore.theme,
          }}
          onSuccess={(token) => {
            useTurnstileStore.setState(() => ({
              token,
              instance: turnstileRef.current,
            }))
          }}
          onError={() => {
            useTurnstileStore.setState(() => ({
              token: null,
              instance: turnstileRef.current,
            }))
            turnstileRef.current?.reset()
          }}
          onExpire={() => {
            useTurnstileStore.setState(() => ({
              token: null,
              instance: turnstileRef.current,
            }))
            turnstileRef.current?.reset()
          }}
        />
      </Portal.Root>
    </>
  )
}
