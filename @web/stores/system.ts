import { config } from '@web/lib/config'
import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

const systemStoreSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
  sidebarSize: z.enum(['icon', 'default']),
  dismissedPushNotificationAlertAt: z.date().nullable(),
})

export const useSystemStore = create(
  subscribeWithSelector(
    persist<z.infer<typeof systemStoreSchema>>(
      () => ({
        theme: 'system',
        sidebarSize: 'default',
        dismissedPushNotificationAlertAt: null,
      }),
      {
        name: '@web/stores/system',
        version: 0,
        storage: createSuperJSONStorage(config.getPersistStorage, systemStoreSchema),
      },
    ),
  ),
)
