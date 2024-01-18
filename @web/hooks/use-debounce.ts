import { useTimeoutFn } from './use-timeout-fn'
import { DependencyList, useEffect } from 'react'

export type UseDebounceReturn = [() => boolean | null, () => void]

export function useDebounce(
  fn: Function,
  ms: number = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms)

  useEffect(reset, deps)

  return [isReady, cancel]
}
