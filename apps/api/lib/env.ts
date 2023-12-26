import { z } from 'zod'

export const envSchema = z.object({
  WORKER_ENV: z.enum(['development', 'production']).default('production'),
  WEB_APP_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
  PUBLIC_BUCKET: z.custom<R2Bucket>((value) => {
    return typeof value === 'object' && value !== null
  }),
})

export type Env = z.infer<typeof envSchema>
