import { z } from 'zod'

export const env = z
  .object({
    API_TRPC_BASE_URL: z.string().url(),
    TURNSTILE_SITE_KEY: z.string(),
    PUBLIC_BUCKET_BASE_URL: z.string().url(),
  })
  .parse({
    API_TRPC_BASE_URL: import.meta.env.VITE_API_TRPC_BASE_URL,
    TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    PUBLIC_BUCKET_BASE_URL: import.meta.env.VITE_PUBLIC_BUCKET_BASE_URL,
  })
