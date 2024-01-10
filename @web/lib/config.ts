import type { StateStorage } from 'zustand/middleware'

export type Config = {
  getPersistStorage: () => StateStorage
}

export const config: Config = {
  getPersistStorage: () => localStorage,
}
