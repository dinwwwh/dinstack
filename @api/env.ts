import { z } from 'zod'

export const envSchema = z.object({
  WORKER_ENV: z.enum(['development', 'production']).default('production'),
  WEB_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
