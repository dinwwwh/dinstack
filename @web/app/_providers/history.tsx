'use client'

import type { Route } from 'next'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useHistoryStore } from '../stores/history'

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() as Route
  const searchParams = useSearchParams()

  useEffect(() => {
    useHistoryStore.getState().setPreviousPathname(pathname)
  }, [pathname])

  useEffect(() => {
    useHistoryStore.getState().setPreviousSearchParams(searchParams.toString())
  }, [searchParams])

  return <>{children}</>
}
