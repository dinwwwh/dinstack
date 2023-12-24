'use client'

import { jotaiStore } from '@web/lib/jotai'
import { Provider } from 'jotai'

export default function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={jotaiStore}>{children}</Provider>
}
