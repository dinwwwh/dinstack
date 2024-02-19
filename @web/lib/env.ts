import { z } from 'zod'

export const env = z
  .object({
    APP_NAME: z.string(),
    TURNSTILE_SITE_KEY: z.string(),
    PUBLIC_BUCKET_BASE_URL: z.string().url(),
    CLERK_PUBLISHABLE_KEY: z.string(),

    API_TRPC_BASE_URL: z.string().url(),
    CONTENT_BASE_URL: z.string().url(),
    EXTENSION_ID: z.string(),
    WEB_BASE_URL: z.string().url(),

    SUPPORT_EMAIL: z.string().email(),
    GITHUB_REPOSITORY_URL: z.string().url(),
    TWITTER_AUTHOR_PROFILE_URL: z.string().url(),

    POSTHOG_HOST: z.string().url(),
    POSTHOG_API_KEY: z.string(),

    KNOCK_PUBLIC_API_KEY: z.string(),
    KNOCK_FEED_CHANNEL_ID: z.string(),

    LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID: z.coerce.number(),
    LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID: z.coerce.number(),
  })
  .parse({
    APP_NAME: import.meta.env.VITE_APP_NAME,
    PUBLIC_BUCKET_BASE_URL: import.meta.env.VITE_PUBLIC_BUCKET_BASE_URL,
    TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,

    API_TRPC_BASE_URL: import.meta.env.VITE_API_TRPC_BASE_URL,
    CONTENT_BASE_URL: import.meta.env.VITE_CONTENT_BASE_URL,
    WEB_BASE_URL: import.meta.env.VITE_WEB_BASE_URL,
    EXTENSION_ID: import.meta.env.VITE_EXTENSION_ID,

    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL,
    GITHUB_REPOSITORY_URL: import.meta.env.VITE_GITHUB_REPOSITORY_URL,
    TWITTER_AUTHOR_PROFILE_URL: import.meta.env.VITE_TWITTER_AUTHOR_PROFILE_URL,

    POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
    POSTHOG_API_KEY: import.meta.env.VITE_POSTHOG_API_KEY,

    KNOCK_PUBLIC_API_KEY: import.meta.env.VITE_KNOCK_PUBLIC_API_KEY,
    KNOCK_FEED_CHANNEL_ID: import.meta.env.VITE_KNOCK_FEED_CHANNEL_ID,

    LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID: import.meta.env
      .VITE_LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID,
    LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID: import.meta.env
      .VITE_LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID,
  })
