import { Db } from '@db/lib/db'
import { OauthAccounts, OrganizationMembers, Organizations, Users } from '@db/schema'
import { TRPCError } from '@trpc/server'

export async function createUser(ctx: {
  db: Db
  user: {
    email: string
    avatarUrl: string
    name: string
  }
  oauth?: {
    provider: (typeof OauthAccounts.$inferInsert)['provider']
    providerUserId: string
    identifier: string
  }
}) {
  const lowerCaseEmail = ctx.user.email.toLocaleLowerCase()
  return await ctx.db.transaction(async (trx) => {
    const [user] = await trx
      .insert(Users)
      .values({
        email: lowerCaseEmail,
        name: ctx.user.name,
        avatarUrl: ctx.user.avatarUrl,
      })
      .returning()

    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user',
      })
    }

    const [organization] = await ctx.db
      .insert(Organizations)
      .values({
        name: `${user.name}'s Organization`,
        logoUrl: ctx.user.avatarUrl,
      })
      .returning()

    if (!organization) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create organization',
      })
    }

    const [organizationMember] = await trx
      .insert(OrganizationMembers)
      .values({
        organizationId: organization.id,
        userId: user.id,
        role: 'admin',
      })
      .returning()

    if (!organizationMember) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create organization member',
      })
    }

    if (ctx.oauth) {
      await trx.insert(OauthAccounts).values({
        provider: ctx.oauth.provider,
        providerUserId: ctx.oauth.providerUserId,
        userId: user.id,
        identifier: ctx.oauth.identifier,
      })
    }

    return {
      user,
      organization: organization,
      organizationMember: {
        ...organizationMember,
        organization,
      },
    }
  })
}
