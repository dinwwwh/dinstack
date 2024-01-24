import type { StateStorage } from 'zustand/middleware'

type Config = {
  getPersistStorage: () => StateStorage
}

export const config: Config = {
  getPersistStorage: () => localStorage,
}
