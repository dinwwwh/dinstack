import { atomWithLocalStorage } from '../lib/jotai'
import { z } from 'zod'

export const loginWithEmailHistoryAtom = atomWithLocalStorage(
  'login-with-email-history-atom',
  z.object({
    previousLoginEmail: z.string().email().nullable(),
    previousLoginEmailAt: z.date().nullable(),
  }),
  {
    previousLoginEmail: null,
    previousLoginEmailAt: null,
  },
)

export const sidebarSizeHistoryAtom = atomWithLocalStorage(
  'sidebar-size-history-atom',
  z.enum(['default', 'icon']),
  'default',
)
