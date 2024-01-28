import { Auth } from './auth'
import { match } from 'ts-pattern'

type Tenant = {
  type: 'organization' | 'user'
  id: string
  role: 'admin' | 'member'
}

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
