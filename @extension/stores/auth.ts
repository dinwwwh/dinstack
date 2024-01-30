import { config } from '@web/lib/config'
import { extensionAuthStateSchema } from '@web/lib/extension'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const authStoreSchema = z.object({
  state: extensionAuthStateSchema,
})

export type AuthStoreSchema = z.infer<typeof authStoreSchema>

export const useAuthStore = create(
  persist<AuthStoreSchema>(
    () => ({
      state: null,
    }),
    {
      version: 0,
      name: '@extension/stores/auth',
      storage: createSuperJSONStorage(config.getPersistStorage, authStoreSchema),
    },
  ),
)
