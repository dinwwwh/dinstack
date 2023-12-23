'use client'

import { useIsRendered } from '+ui/hooks/use-is-rendered'
import { sessionAtom } from '@web-content/atoms/auth'
import { LoginScreen } from '@web-content/components/login-screen'
import { useAtom } from 'jotai'

export function RequireAuthWrapper({ children }: { children: React.ReactNode }) {
  const [session] = useAtom(sessionAtom)
  const isRendered = useIsRendered()

  if (!isRendered) {
    return null
  }

  if (!session) {
    return (
      <div className="h-full">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
