import {
  organizationMemberSchema,
  organizationSchema,
  sessionSchema,
  userSchema,
} from '@api/database/schema'
import { z } from 'zod'
import { atomWithLocalStorage } from '../lib/jotai'

export const sessionAtom = atomWithLocalStorage(
  'session-atom',
  sessionSchema
    .pick({
      secretKey: true,
    })
    .and(
      z.object({
        organizationMember: z.object({
          role: organizationMemberSchema.shape.role,
          user: userSchema,
          organization: organizationSchema.and(
            z.object({
              members: z.array(
                z.object({
                  user: userSchema,
                }),
              ),
            }),
          ),
        }),
      }),
    )
    .nullable(),
  null,
)

export const stateAtom = atomWithLocalStorage('state-atom', z.string().nullable(), null)
export const codeVerifierAtom = atomWithLocalStorage(
  'code-verifier-atom',
  z.string().nullable(),
  null,
)

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
