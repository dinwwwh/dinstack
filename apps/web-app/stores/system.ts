import { createSuperJSONStorage } from '@shared-react/lib/zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSystemStore = create(
  persist<{
    theme: 'dark' | 'light' | 'system'
  }>(
    () => ({
      theme: 'system',
    }),
    {
      name: '@web-app/stores/system',
      version: 0,
      storage: createSuperJSONStorage(() => localStorage),
    },
  ),
)
