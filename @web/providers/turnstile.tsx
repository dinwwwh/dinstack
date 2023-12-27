import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
import * as Portal from '@radix-ui/react-portal'
import { env } from '@web/lib/env'
import { cn } from '@web/lib/utils'
import { useTurnstileStore } from '@web/stores/turnstile'
import { useId, useRef } from 'react'

export function TurnstileProvider(props: { children: React.ReactNode }) {
  const turnstileStore = useTurnstileStore()
  const turnstileRef = useRef<TurnstileInstance>(null)
  const id = useId()

  return (
    <>
      {props.children}
      <Portal.Root>
        <div
          className={cn(
            'fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-background/80',
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
              // TODO: implement dark mode
              theme: 'auto',
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
            }}
            onExpire={() => {
              useTurnstileStore.setState(() => ({
                token: null,
                instance: turnstileRef.current,
              }))
              turnstileRef.current?.reset()
            }}
          />
        </div>
      </Portal.Root>
    </>
  )
}
