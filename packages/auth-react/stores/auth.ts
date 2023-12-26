import { OrganizationMembers, Organizations, Sessions, Users } from '@db/schema'
import { createSuperJSONStorage } from '@shared-react/lib/zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist<{
    session:
      | (typeof Sessions.$inferSelect & {
          user: typeof Users.$inferSelect
          organization: typeof Organizations.$inferSelect
          organizationMember: typeof OrganizationMembers.$inferSelect
        })
      | null
  }>(
    () => ({
      session: null,
    }),
    {
      version: 0,
      name: '@auth-react/stores/auth',
      storage: createSuperJSONStorage(() => localStorage),
    },
  ),
)
