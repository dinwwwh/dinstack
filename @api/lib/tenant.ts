import type { Auth } from './auth'
import { subscriptionSchema } from './subscription'
import { match } from 'ts-pattern'
import { z } from 'zod'

export type Tenant = {
  type: 'organization' | 'user'
  id: string
  role: 'admin' | 'member'
}

export const tenantPublicMetadataSchema = z.object({
  subscriptions: z.array(subscriptionSchema).catch([]),
})

export type TenantPublicMetadata = z.infer<typeof tenantPublicMetadataSchema>

export async function authToTenant(opts: { auth: Auth }): Promise<Tenant> {
  return opts.auth.organizationId
    ? {
        type: 'organization' as const,
        id: opts.auth.organizationId,
        role: match(opts.auth.organizationRole)
          .with('org:admin', () => 'admin' as const)
          .with('org:member', () => 'member' as const)
          .exhaustive(),
      }
    : {
        type: 'user' as const,
        id: opts.auth.userId,
        role: 'admin' as const,
      }
}
