import { OrganizationMembers, Organizations, Sessions, Users } from '@db/schema'
import { createSuperJSONStorage } from '@shared-react/lib/zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist<{
    session:
      | (typeof Sessions.$inferSelect & {
          user: typeof Users.$inferSelect
          organization: typeof Organizations.$inferSelect & {
            members: (typeof OrganizationMembers.$inferSelect)[]
          }
          organizationMember: typeof OrganizationMembers.$inferSelect
        })
      | null
    oauthAuthorization: {
      redirectUrl: URL
      codeVerifier: string
      state: string
    } | null
    emailAuthorization: {
      email: string
      at: Date
    } | null
  }>(
    () => ({
      session: null,
      oauthAuthorization: null,
      emailAuthorization: null,
    }),
    {
      version: 0,
      name: '@auth-react/stores/auth',
      storage: createSuperJSONStorage(() => localStorage),
    },
  ),
)

export function useAuthedStore() {
  const auth = useAuthStore()
  const session = auth.session
  if (!session) {
    throw new Error('Requires user to be logged in')
  }

  return {
    ...auth,
    session,
  }
}
