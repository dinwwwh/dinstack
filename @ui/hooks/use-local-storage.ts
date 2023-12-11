'use client'

import { useState, useLayoutEffect } from 'react'
import SuperJSON from 'superjson'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue)

  useLayoutEffect(() => {
    const item = window.localStorage.getItem(key)
    if (item) {
      setStoredValue(SuperJSON.parse(item))
    }
  }, [key])

  function setValue(value: T) {
    setStoredValue(value)
    window.localStorage.setItem(key, SuperJSON.stringify(value))
  }

  return [storedValue, setValue]
}
