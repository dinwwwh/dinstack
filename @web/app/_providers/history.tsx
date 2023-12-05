'use client'

import type { Route } from 'next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useHistoryStore } from '../stores/history'

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() as Route
  const searchParams = useSearchParams()
  const historyStore = useHistoryStore()

  useEffect(() => {
    historyStore.setPreviousPathname(pathname)
  }, [pathname, historyStore])

  useEffect(() => {
    historyStore.setPreviousSearchParams(searchParams.toString())
  }, [searchParams, historyStore])

  return <>{children}</>
}
