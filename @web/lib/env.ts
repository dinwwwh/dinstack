import { z } from 'zod'

export const env = z
  .object({
    APP_NAME: z.string(),

    API_TRPC_BASE_URL: z.string().url(),
    CONTENT_BASE_URL: z.string().url(),
    EXTENSION_ID: z.string(),
    WEB_BASE_URL: z.string().url(),

    SUPPORT_EMAIL: z.string().email(),
    GITHUB_REPOSITORY_URL: z.string().url(),
    TWITTER_AUTHOR_PROFILE_URL: z.string().url(),

    POSTHOG_HOST: z.string().url(),
    POSTHOG_API_KEY: z.string(),

    TURNSTILE_SITE_KEY: z.string(),
    PUBLIC_BUCKET_BASE_URL: z.string().url(),
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: z.coerce.number(),
  })
  .parse({
    APP_NAME: import.meta.env.PUBLIC_APP_NAME,

    API_TRPC_BASE_URL: import.meta.env.PUBLIC_API_TRPC_BASE_URL,
    CONTENT_BASE_URL: import.meta.env.PUBLIC_CONTENT_BASE_URL,
    WEB_BASE_URL: import.meta.env.PUBLIC_WEB_BASE_URL,
    EXTENSION_ID: import.meta.env.PUBLIC_EXTENSION_ID,

    SUPPORT_EMAIL: import.meta.env.PUBLIC_SUPPORT_EMAIL,
    GITHUB_REPOSITORY_URL: import.meta.env.PUBLIC_GITHUB_REPOSITORY_URL,
    TWITTER_AUTHOR_PROFILE_URL: import.meta.env.PUBLIC_TWITTER_AUTHOR_PROFILE_URL,

    POSTHOG_HOST: import.meta.env.PUBLIC_POSTHOG_HOST,
    POSTHOG_API_KEY: import.meta.env.PUBLIC_POSTHOG_API_KEY,

    TURNSTILE_SITE_KEY: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
    PUBLIC_BUCKET_BASE_URL: import.meta.env.PUBLIC_PUBLIC_BUCKET_BASE_URL,
    LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID: import.meta.env
      .PUBLIC_LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID,
  })
