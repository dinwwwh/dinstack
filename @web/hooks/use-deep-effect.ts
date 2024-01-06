import { useEffect } from 'react'

export function useDeepEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  useEffect(effect, deps ? [JSON.stringify(deps)] : undefined)
}
