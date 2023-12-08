'use client'

import { LoginScreen } from '@web/components/login-screen'
import { useAuthStore } from '@web/stores/auth'

export function RequireAuthedWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()

  if (!auth.user) {
    return (
      <div className="fixed inset-0 z-50">
        <LoginScreen />
      </div>
    )
  }

  return <>{children}</>
}
