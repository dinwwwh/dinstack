import { z } from 'zod'

export const envSchema = z.object({
  WORKER_ENV: z.enum(['development', 'production']).default('production'),
  WEB_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  TURNSTILE_SECRET_KEY: z.string(),
  PUBLIC_BUCKET: z.custom<R2Bucket>((value) => {
    return typeof value === 'object' && value !== null
  }),
  LEMONSQUEEZY_API_KEY: z.string(),
  LEMONSQUEEZY_STORE_ID: z.number(),
  LEMONSQUEEZY_WEBHOOK_SIGNING_SECRET: z.string(),
  LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: z.number(),
  POSTHOG_HOST: z.string().url(),
  POSTHOG_API_KEY: z.string(),
  SUPPORT_EMAIL: z.string().email(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
  KNOCK_API_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
