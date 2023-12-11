import { z } from 'zod'
import { atomWithLocalStorage } from './_helpers'

export const sessionAtom = atomWithLocalStorage(
  'session-atom',
  z
    .object({
      id: z.string(),
    })
    .nullable(),
  null,
)

export const stateAtom = atomWithLocalStorage('state-atom', z.string().nullable(), null)
export const codeVerifierAtom = atomWithLocalStorage('code-verifier-atom', z.string().nullable(), null)
