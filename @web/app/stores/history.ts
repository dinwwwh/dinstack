import type { Route } from 'next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist<{
    previousPathname: Route | null
    previousSearchParams: string | null
    previousLoginEmail: string | null
    previousLoginEmailAt: number | null
    setPreviousPathname: (pathname: Route) => void
    setPreviousSearchParams: (searchParams: string) => void
    setPreviousLoginEmail: (email: string | null) => void
    setPreviousLoginEmailAt: (date: number | null) => void
  }>(
    (set) => ({
      previousPathname: null,
      previousSearchParams: null,
      previousLoginEmail: null,
      previousLoginEmailAt: null,
      setPreviousPathname(previousPathname) {
        set(() => ({ previousPathname }))
      },
      setPreviousSearchParams(previousSearchParams) {
        set(() => ({ previousSearchParams }))
      },
      setPreviousLoginEmail(previousLoginEmail) {
        set(() => ({ previousLoginEmail }))
      },
      setPreviousLoginEmailAt(previousLoginEmailAt) {
        set(() => ({ previousLoginEmailAt }))
      },
    }),
    {
      name: 'history-store',
      version: 0,
    },
  ),
)
