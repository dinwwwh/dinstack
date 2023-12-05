import type { Route } from 'next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist<{
    previousPathname: Route | null
    previousSearchParams: string | null
    setPreviousPathname: (pathname: Route) => void
    setPreviousSearchParams: (searchParams: string) => void
  }>(
    (set) => ({
      previousPathname: null,
      previousSearchParams: null,
      setPreviousPathname(previousPathname) {
        set(() => ({ previousPathname }))
      },
      setPreviousSearchParams(previousSearchParams) {
        set(() => ({ previousSearchParams }))
      },
    }),
    {
      name: 'history-store',
      version: 0,
    },
  ),
)
