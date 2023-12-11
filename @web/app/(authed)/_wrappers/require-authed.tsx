'use client'

import { authAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { useAtom } from 'jotai'

export function RequireAuthedWrapper({ children }: { children: React.ReactNode }) {
  const [auth] = useAtom(authAtom)

  if (!auth) {
    return (
      <div className="fixed inset-0 z-50">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
