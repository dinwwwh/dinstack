import { atomWithLocalStorage } from '@web/lib/jotai'
import { z } from 'zod'

export const sidebarSizeHistoryAtom = atomWithLocalStorage(
  'app/(auth)/sidebar-size-history',
  z.enum(['default', 'icon']),
  'default',
)
