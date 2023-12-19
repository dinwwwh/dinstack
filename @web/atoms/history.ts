import { atomWithLocalStorage } from '@web/lib/jotai'
import { z } from 'zod'

export const sidebarSizeHistoryAtom = atomWithLocalStorage(
  'sidebar-size-history-atom',
  z.enum(['default', 'icon']),
  'default',
)
