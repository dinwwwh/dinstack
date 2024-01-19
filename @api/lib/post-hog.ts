import type { Env } from './env'
import { PostHog } from 'posthog-node'

export function createPostHog({ env }: { env: Env }) {
  return new PostHog(env.POSTHOG_API_KEY, {
    host: env.POSTHOG_HOST,
    fetch(...args) {
      return fetch(...args)
    },
  })
}
