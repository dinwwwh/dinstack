import { useTenant } from '@web/lib/auth'
import { env } from '@web/lib/env'
import { match } from 'ts-pattern'

export function useLifetimeAccessSubscription() {
  const tenant = useTenant()

  return match(tenant.type)
    .with('user', () => {
      return tenant.publicMetadata.subscriptions.find(
        (s) =>
          s.variantId === env.LEMONSQUEEZY_PERSONAL_LIFETIME_ACCESS_VARIANT_ID &&
          s.expiresAt === null,
      )
    })
    .with('organization', () => {
      return tenant.publicMetadata.subscriptions.find(
        (s) =>
          s.variantId === env.LEMONSQUEEZY_TEAM_LIFETIME_ACCESS_VARIANT_ID && s.expiresAt === null,
      )
    })
    .exhaustive()
}
