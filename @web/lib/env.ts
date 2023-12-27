import { z } from 'zod'

export const env = z
  .object({
    API_TRPC_BASE_URL: z.string().url(),
    TURNSTILE_SITE_KEY: z.string(),
  })
  .parse({
    API_TRPC_BASE_URL: import.meta.env.VITE_API_TRPC_BASE_URL,
    TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  })
