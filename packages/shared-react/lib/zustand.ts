import SuperJSON from 'superjson'
import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware'

export function createSuperJSONStorage<S>(
  getStorage: () => StateStorage,
): PersistStorage<S> | undefined {
  let storage: StateStorage | undefined
  try {
    storage = getStorage()
  } catch (e) {
    // prevent error if the storage is not defined (e.g. when server side rendering a page)
    return
  }
  const persistStorage: PersistStorage<S> = {
    getItem: (name) => {
      const parse = (str: string | null) => {
        if (str === null) {
          return null
        }
        return SuperJSON.parse(str) as StorageValue<S>
      }
      const str = (storage as StateStorage).getItem(name) ?? null
      if (str instanceof Promise) {
        return str.then(parse)
      }
      return parse(str)
    },
    setItem: (name, newValue) =>
      (storage as StateStorage).setItem(name, SuperJSON.stringify(newValue)),
    removeItem: (name) => (storage as StateStorage).removeItem(name),
  }
  return persistStorage
}
