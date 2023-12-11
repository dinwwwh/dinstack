import { useAtom } from 'jotai'
import { z } from 'zod'
import { atomWithLocalStorage } from './_helpers'

export const authAtom = atomWithLocalStorage(
  'auth-atom',
  z
    .object({
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        avatarUrl: z.string(),
      }),
      organizationMember: z.object({
        role: z.enum(['admin', 'member']),
        organization: z.object({
          id: z.string(),
          name: z.string(),
          logoUrl: z.string(),
        }),
      }),
      session: z.object({
        id: z.string(),
      }),
    })
    .or(
      z.object({
        user: z.null(),
        organizationMember: z.null(),
        session: z.null(),
      }),
    ),
  {
    user: null,
    organizationMember: null,
    session: null,
  },
)

export function useAuthedAtom() {
  const [auth, ...rest] = useAtom(authAtom)

  if (!auth.user) {
    throw new Error('Require session to be authenticated')
  }
  return [auth, ...rest] as const
}

export const stateAtom = atomWithLocalStorage('state-atom', z.string().nullable(), null)
export const codeVerifierAtom = atomWithLocalStorage('code-verifier-atom', z.string().nullable(), null)
