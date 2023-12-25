import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useTurnstileStore = create(
  subscribeWithSelector<{
    token: string | null
    isShowChallenge: boolean
    instance: TurnstileInstance | null
  }>(() => ({
    token: null,
    isShowChallenge: false,
    instance: null,
  })),
)
