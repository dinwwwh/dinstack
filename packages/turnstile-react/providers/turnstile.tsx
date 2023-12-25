'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
import * as Portal from '@radix-ui/react-portal'
import { useTurnstileStore } from '@turnstile-react/stores/turnstile'
import { useIsRendered } from '@ui/hooks/use-is-rendered'
import { cn } from '@ui/lib/utils'
import { useId, useRef } from 'react'

export function TurnstileProvider(props: {
  theme: 'dark' | 'light' | 'auto'
  turnstileSiteKey: string
  children: React.ReactNode
}) {
  const turnstileStore = useTurnstileStore()
  const turnstileRef = useRef<TurnstileInstance>(null)
  const id = useId()
  const isRendered = useIsRendered()

  return (
    <>
      {props.children}
      {isRendered && (
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
              siteKey={props.turnstileSiteKey}
              options={{
                theme: props.theme,
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
      )}
    </>
  )
}
