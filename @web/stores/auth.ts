import {
  organizationMemberSchema,
  organizationSchema,
  subscriptionSchema,
  userSchema,
} from '@api/database/schema'
import { config } from '@web/lib/config'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const authStateSchema = z
  .object({
    jwt: z.string(),
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
  })
  .nullable()

const authStoreSchema = z.object({
  state: authStateSchema,
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
      state: null,
      oauthAuthorization: null,
      emailAuthorization: null,
    }),
    {
      version: 0,
      name: '@web/stores/auth',
      storage: createSuperJSONStorage(config.stores.auth.getStorage, authStoreSchema),
    },
  ),
)

export function useAuthedStore() {
  const authStore = useAuthStore()
  const session = authStore.state

  if (!session) {
    throw new Error('Requires user to be logged in')
  }

  return {
    ...authStore,
    session,
  }
}
