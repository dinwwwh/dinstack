import {
  organizationMemberSchema,
  organizationSchema,
  sessionSchema,
  subscriptionSchema,
  userSchema,
} from '@api/database/schema'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const authStoreSchema = z.object({
  session: sessionSchema
    .and(
      z.object({
        user: userSchema.and(
          z.object({
            subscriptions: z.array(subscriptionSchema),
          }),
        ),
        organization: organizationSchema.and(
          z.object({
            members: z.array(organizationMemberSchema),
          }),
        ),
        organizationMember: organizationMemberSchema,
      }),
    )
    .nullable(),
  oauthAuthorization: z
    .object({
      redirectUrl: z.custom<URL>((url) => url instanceof URL),
      codeVerifier: z.string(),
      state: z.string(),
    })
    .nullable(),
  emailAuthorization: z
    .object({
      email: z.string().email(),
      at: z.date(),
    })
    .nullable(),
})

export const useAuthStore = create(
  persist<z.infer<typeof authStoreSchema>>(
    () => ({
      session: null,
      oauthAuthorization: null,
      emailAuthorization: null,
    }),
    {
      version: 0,
      name: '@web/stores/auth',
      storage: createSuperJSONStorage(() => localStorage, authStoreSchema),
    },
  ),
)

export function useAuthedStore() {
  const authStore = useAuthStore()
  const session = authStore.session

  if (!session) {
    throw new Error('Requires user to be logged in')
  }

  return {
    ...authStore,
    session,
  }
}
