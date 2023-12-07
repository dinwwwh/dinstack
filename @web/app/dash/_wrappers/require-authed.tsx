'use client'

import { useAuthStore } from '@web/app/stores/auth'
import { LoginScreen } from '@web/components/login-screen'

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
