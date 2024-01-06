import { z } from 'zod'

export const env = z
  .object({
    SUPPORT_EMAIL: z.string().email(),
    API_TRPC_BASE_URL: z.string().url(),
    TURNSTILE_SITE_KEY: z.string(),
    PUBLIC_BUCKET_BASE_URL: z.string().url(),
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: z.coerce.number(),
  })
  .parse({
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL,
    API_TRPC_BASE_URL: import.meta.env.VITE_API_TRPC_BASE_URL,
    TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    PUBLIC_BUCKET_BASE_URL: import.meta.env.VITE_PUBLIC_BUCKET_BASE_URL,
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: import.meta.env
      .VITE_LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID,
  })
