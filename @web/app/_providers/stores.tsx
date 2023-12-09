'use client'

import { useAuthStore } from '@web/stores/auth'
import { useHistoryStore } from '@web/stores/history'
import { useEffect } from 'react'

export function StoresProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.persist.rehydrate()
    useHistoryStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
