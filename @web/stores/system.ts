import { config } from '@web/lib/config'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const systemStoreSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  sidebarSize: z.enum(['icon', 'default']),
})

export const useSystemStore = create(
  persist<z.infer<typeof systemStoreSchema>>(
    () => ({
      theme: 'system',
      sidebarSize: 'default',
    }),
    {
      name: '@web/stores/system',
      version: 0,
      storage: createSuperJSONStorage(config.getPersistStorage, systemStoreSchema),
    },
  ),
)
