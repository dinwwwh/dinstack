import { atom, createStore } from 'jotai'
import { RESET } from 'jotai/utils'
import SuperJSON from 'superjson'
import type { z } from 'zod'

type SetStateActionClosureWithReset<V> = (prev: V) => V | typeof RESET
type SetStateActionWithReset<V> = V | typeof RESET | SetStateActionClosureWithReset<V>

export const jotaiStore = createStore()

export function atomWithLocalStorage<T extends z.Schema>(
  key: string,
  schema: T,
  _initialValue: z.infer<T>,
) {
  type V = z.infer<T>
  const parse = (v: unknown): V => schema.parse(v)
  const initialValue = parse(_initialValue)

  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ;(async () => {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsedData = schema.safeParse(SuperJSON.parse(raw))

        if (parsedData.success) {
          setValue(parsedData.data)
        }
      }
    })()
  }

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateActionWithReset<V | Promise<V>>) => {
      const nextValue = (() => {
        if (update === RESET) {
          return initialValue
        }
        if (typeof update === 'function') {
          return (update as SetStateActionClosureWithReset<V | Promise<V>>)(get(baseAtom))
        }
        return update
      })()

      if (nextValue === RESET) {
        set(baseAtom, initialValue)
        localStorage.removeItem(key)
        return
      }

      if (nextValue instanceof Promise) {
        nextValue.then((value) => {
          const parsedValue = parse(value)
          set(baseAtom, parsedValue)
          localStorage.setItem(key, SuperJSON.stringify(parsedValue))
        })
        return
      }
      const parsedValue = parse(nextValue)

      set(baseAtom, parsedValue)
      localStorage.setItem(key, SuperJSON.stringify(parsedValue))
    },
  )
  return derivedAtom
}
