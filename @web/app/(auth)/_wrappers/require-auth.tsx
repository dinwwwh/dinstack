'use client'

import { LoginScreen } from '@web/components/login-screen'
import { sessionIdAtom } from '@web/services/auth/atoms'
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
