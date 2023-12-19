'use client'

import { sessionSecretKeyAtom } from '@web/services/auth/atoms'
import { LoginScreen } from '@web/services/auth/login-screen'
import { useAtom } from 'jotai'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export function RequireAuthWrapper({ children }: { children: React.ReactNode }) {
  const [sessionSecretKey] = useAtom(sessionSecretKeyAtom)
  const isRendered = useIsRendered()

  if (!isRendered) {
    return null
  }

  if (!sessionSecretKey) {
    return (
      <div className="h-full">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
