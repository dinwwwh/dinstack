import { z } from 'zod'

export const env = z
  .object({
    API_TRPC_BASE_URL: z.string().url(),
  })
  .parse({
    API_TRPC_BASE_URL: import.meta.env.VITE_API_TRPC_BASE_URL,
  })
