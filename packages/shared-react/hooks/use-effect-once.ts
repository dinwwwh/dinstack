import { useEffect, useRef } from 'react'

export function useEffectOnce(fn: React.EffectCallback) {
  const hasRun = useRef(false)
  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    return fn()
  }, [])
}
