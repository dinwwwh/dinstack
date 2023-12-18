import { authClientSchema } from '@shared/schemas/auth'
import { z } from 'zod'
import { atomWithLocalStorage } from './_helpers'

export const authAtom = atomWithLocalStorage('auth-atom', authClientSchema.nullable(), null)

export const stateAtom = atomWithLocalStorage('state-atom', z.string().nullable(), null)
export const codeVerifierAtom = atomWithLocalStorage('code-verifier-atom', z.string().nullable(), null)

export const loginRequestFromAtom = atomWithLocalStorage(
  'login-request-from-atom',
  z.object({
    pathname: z.string(),
    searchParams: z.string(),
  }),
  {
    pathname: '',
    searchParams: '',
  },
)
