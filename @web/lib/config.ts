import type { StateStorage } from 'zustand/middleware'

export type Config = {
  stores: {
    auth: {
      getStorage: () => StateStorage
    }
  }
}

export const config: Config = {
  stores: {
    auth: {
      getStorage: () => localStorage,
    },
  },
}
