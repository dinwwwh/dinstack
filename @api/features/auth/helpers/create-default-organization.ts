import { OrganizationMembers, Organizations } from '@api/database/schema'
import type { Db } from '@api/lib/db'
import { generateFallbackLogoUrl } from '@api/lib/utils'
import { TRPCError } from '@trpc/server'

export async function createDefaultOrganization(opts: { db: Db; userId: string }) {
  return await opts.db.transaction(async (trx) => {
    const [organization] = await trx
      .insert(Organizations)
      .values({
        name: 'Default',
        logoUrl: generateFallbackLogoUrl({ name: 'Default' }),
      })
      .returning()

    if (!organization) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not create organization',
      })
    }

    const [organizationMember] = await trx
      .insert(OrganizationMembers)
      .values({
        userId: opts.userId,
        organizationId: organization.id,
        role: 'admin',
      })
      .returning()

    if (!organizationMember) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not create organization member',
      })
    }

    return { organization, organizationMember }
  })
}
