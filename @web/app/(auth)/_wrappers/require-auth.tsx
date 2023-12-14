'use client'

import { authAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { useAtom } from 'jotai'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export function RequireAuthWrapper({ children }: { children: React.ReactNode }) {
  const [auth] = useAtom(authAtom)
  const isRendered = useIsRendered()

  if (!isRendered) {
    return null
  }

  if (!auth) {
    return (
      <div className="h-full">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
