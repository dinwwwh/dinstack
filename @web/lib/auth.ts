import {
  tenantPublicMetadataSchema,
  type Tenant as BaseTenant,
  type TenantPublicMetadata,
} from '@api/lib/tenant'
import { useAuth, useOrganization, useUser } from '@clerk/clerk-react'
import { match } from 'ts-pattern'

export function useAuthedUser() {
  const result = useUser()

  if (!result.isSignedIn) {
    throw new Error('This session require user to be authenticated.')
  }

  return result
}

export type Tenant = BaseTenant & {
  createdAt: Date | null | undefined
  publicMetadata: TenantPublicMetadata
}

export function useTenant(): Tenant {
  const { user } = useAuthedUser()
  const { organization } = useOrganization()
  const auth = useAuth()

  if (!auth.isLoaded) throw new Error('Something went wrong.')
  if (!auth.userId) throw new Error('This session require user to be authenticated.')

  if (auth.orgId) {
    return {
      type: 'organization',
      id: auth.orgId,
      role: match(auth.orgRole as 'org:admin' | 'org:member')
        .with('org:admin', () => 'admin' as const)
        .with('org:member', () => 'member' as const)
        .exhaustive(),
      createdAt: organization?.createdAt,
      publicMetadata: tenantPublicMetadataSchema.parse(organization?.publicMetadata),
    }
  }

  return {
    type: 'user',
    id: auth.userId,
    role: 'admin',
    createdAt: user.createdAt,
    publicMetadata: tenantPublicMetadataSchema.parse(user.publicMetadata),
  }
}
