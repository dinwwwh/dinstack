import { chromeLocalStateStorage } from '@extension/lib/zustand'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { authStateSchema } from '@web/stores/auth'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const authStoreSchema = z.object({
  state: authStateSchema,
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
      name: '@extension/stores/auth',
      storage: createSuperJSONStorage(() => chromeLocalStateStorage, authStoreSchema),
    },
  ),
)
