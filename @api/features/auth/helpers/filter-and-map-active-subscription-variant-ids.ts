import type { Subscriptions } from '@api/database/schema'

export function getActiveSubscriptionVariantIds(
  subscriptions: Pick<typeof Subscriptions.$inferSelect, 'variantId' | 'expiresAt'>[],
) {
  return subscriptions
    .filter((s) => s.expiresAt === null || s.expiresAt.getTime() > Date.now())
    .map((s) => s.variantId)
}
