'use client'

import { useAuthStore } from '@web/stores/auth'
import { useHistoryStore } from '@web/stores/history'
import { useMemo } from 'react'

export function StoresProvider({ children }: { children: React.ReactNode }) {
  useMemo(() => {
    useAuthStore.persist.rehydrate()
    useHistoryStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}
