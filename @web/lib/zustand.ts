import SuperJSON from 'superjson'
import type { ZodSchema } from 'zod'
import { z } from 'zod'
import type { PersistStorage, StateStorage, StorageValue } from 'zustand/middleware'

export function createSuperJSONStorage<S>(
  getStorage: () => StateStorage,
  stateSchema: ZodSchema<S>,
): PersistStorage<S> | undefined {
  const storageValueSchema = z.object({
    state: stateSchema,
    version: z.number().optional(),
  })

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
        if (str === null) return null

        try {
          return storageValueSchema.parse(SuperJSON.parse(str)) as StorageValue<S>
        } catch {
          return null
        }
      }

      const str = (storage as StateStorage).getItem(name) ?? null
      if (str instanceof Promise) {
        return str.then(parse)
      }
      return parse(str)
    },
    setItem: (name, newValue) =>
      (storage as StateStorage).setItem(
        name,
        SuperJSON.stringify(storageValueSchema.parse(newValue)),
      ),
    removeItem: (name) => (storage as StateStorage).removeItem(name),
  }
  return persistStorage
}
