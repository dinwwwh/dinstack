import { OauthAccounts, Users } from '@api/database/schema'
import type { Db } from '@api/lib/db'
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
    }
  })
}
