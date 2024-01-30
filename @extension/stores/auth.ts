import { config } from '@web/lib/config'
import { extensionAuthStateSchema } from '@web/lib/extension'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { parseJWT } from 'oslo/jwt'
import { z } from 'zod'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

const authStoreSchema = z.object({
  state: extensionAuthStateSchema,
})

type AuthStoreSchema = z.infer<typeof authStoreSchema>

export const useAuthStore = create(
  subscribeWithSelector(
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
  ),
)

let id: number | null = null

useAuthStore.subscribe(
  (auth) => auth.state,
  (auth) => {
    if (id) {
      self.clearTimeout(id)
      id = null
    }

    if (!auth) return

    const jwt = parseJWT(auth.token)

    if (!jwt?.expiresAt) return

    id = self.setTimeout(() => {
      useAuthStore.setState({ state: null })
    }, jwt.expiresAt.getTime() - Date.now())
  },
)
