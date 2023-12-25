'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Turnstile } from '@marsidev/react-turnstile'
import * as Portal from '@radix-ui/react-portal'
import { useIsRendered } from '@ui/hooks/use-is-rendered'
import { cn } from '@ui/utils/cn'
import { env } from '@web/lib/env'
import { atom, useAtom } from 'jotai'
import { useTheme } from 'next-themes'
import { useId, useRef } from 'react'
import { match } from 'ts-pattern'

export const turnstileTokenAtom = atom<string | null>(null)

export const showTurnstileAtom = atom(false)

export const turnstileRefAtom = atom<TurnstileInstance | null>(null)

export default function TurnstileProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [, setTurnstileToken] = useAtom(turnstileTokenAtom)
  const [showTurnstile] = useAtom(showTurnstileAtom)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const id = useId()
  const isRendered = useIsRendered()
  const [, _setTurnstileRef] = useAtom(turnstileRefAtom)

  return (
    <>
      {children}
      {isRendered && (
        <Portal.Root>
          <div
            className={cn(
              'fixed top-0 left-0 right-0 bottom-0 z-[99999] flex items-center justify-center bg-background/80',
              {
                'top-[100%] bottom-[-100%]': !showTurnstile,
              },
            )}
          >
            <Turnstile
              ref={turnstileRef}
              id={id}
              siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              options={{
                theme: match(theme)
                  .with('dark', () => 'dark' as const)
                  .with('light', () => 'light' as const)
                  .otherwise(() => 'auto' as const),
              }}
              onSuccess={(token) => {
                _setTurnstileRef(turnstileRef.current)
                setTurnstileToken(token)
              }}
              onError={() => setTurnstileToken(null)}
              onExpire={() => {
                setTurnstileToken(null)
                turnstileRef.current?.reset()
              }}
            />
          </div>
        </Portal.Root>
      )}
    </>
  )
}
