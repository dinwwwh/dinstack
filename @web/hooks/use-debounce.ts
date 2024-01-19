import { useTimeoutFn } from './use-timeout-fn'
import type { DependencyList } from 'react'
import { useEffect } from 'react'

export type UseDebounceReturn = [() => boolean | null, () => void]

export function useDebounce(
  fn: () => void | Promise<void>,
  ms: number = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms)

  useEffect(reset, deps)

  return [isReady, cancel]
}
