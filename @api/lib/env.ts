import { z } from 'zod'

export const envSchema = z.object({
  WORKER_ENV: z.enum(['development', 'production']).default('production'),
  WEB_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  TURNSTILE_SECRET_KEY: z.string(),
  PUBLIC_BUCKET: z.custom<R2Bucket>((value) => {
    return typeof value === 'object' && value !== null
  }),
  SUPPORT_EMAIL: z.string().email(),
  KNOCK_API_KEY: z.string(),

  LEMONSQUEEZY_API_KEY: z.string(),
  LEMONSQUEEZY_STORE_ID: z.number(),
  LEMONSQUEEZY_WEBHOOK_SIGNING_SECRET: z.string(),
  LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID: z.number(),
  LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID: z.number(),

  POSTHOG_HOST: z.string().url(),
  POSTHOG_API_KEY: z.string(),

  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
})

export type Env = z.infer<typeof envSchema>
