'use client'

import { useAuthStore } from '@web/stores/auth'
import { useHistoryStore } from '@web/stores/history'
import { useEffect } from 'react'

export function StoresProvider({ children }: { children: React.ReactNode }) {
  // TODO: fix when using store inside another useEffect
  useEffect(() => {
    useAuthStore.persist.rehydrate()
    useHistoryStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
