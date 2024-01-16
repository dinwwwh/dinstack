import { z } from 'zod'

export const env = z
  .object({
    API_TRPC_BASE_URL: z.string().url(),
    CONTENT_BASE_URL: z.string().url(),
    EXTENSION_ID: z.string(),
    WEB_BASE_URL: z.string().url(),

    SUPPORT_EMAIL: z.string().email(),
    TURNSTILE_SITE_KEY: z.string(),
    PUBLIC_BUCKET_BASE_URL: z.string().url(),
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: z.coerce.number(),
  })
  .parse({
    API_TRPC_BASE_URL: import.meta.env.PUBLIC_API_TRPC_BASE_URL,
    CONTENT_BASE_URL: import.meta.env.PUBLIC_CONTENT_BASE_URL,
    WEB_BASE_URL: import.meta.env.PUBLIC_WEB_BASE_URL,
    EXTENSION_ID: import.meta.env.PUBLIC_EXTENSION_ID,

    SUPPORT_EMAIL: import.meta.env.PUBLIC_SUPPORT_EMAIL,
    TURNSTILE_SITE_KEY: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
    PUBLIC_BUCKET_BASE_URL: import.meta.env.PUBLIC_PUBLIC_BUCKET_BASE_URL,
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: import.meta.env
      .PUBLIC_LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID,
  })
