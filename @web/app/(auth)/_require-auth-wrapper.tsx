'use client'

import { sessionIdAtom } from '@web/services/auth/atoms'
import { LoginScreen } from '@web/services/auth/login-screen'
import { useAtom } from 'jotai'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export function RequireAuthWrapper({ children }: { children: React.ReactNode }) {
  const [sessionId] = useAtom(sessionIdAtom)
  const isRendered = useIsRendered()

  if (!isRendered) {
    return null
  }

  if (!sessionId) {
    return (
      <div className="h-full">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
