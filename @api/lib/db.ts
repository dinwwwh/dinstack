import * as schema from '../database/schema'
import type { Env } from '../env'
import { neon, neonConfig } from '@neondatabase/serverless'
import { TRPCError } from '@trpc/server'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { withReplicas } from 'drizzle-orm/pg-core'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

neonConfig.fetchConnectionCache = true

export function createDb({ env }: { env: Env }) {
  const write = drizzlePostgres(postgres(env.DATABASE_URL), {
    schema,
    logger: env.WORKER_ENV === 'development',
  })
  const read = drizzleNeon(neon(env.DATABASE_URL), {
    schema,
    logger: env.WORKER_ENV === 'development',
  })

  // @ts-expect-error TODO: fix type for withReplicas
  return withReplicas(write, [read])
}

export type Db = ReturnType<typeof createDb>

export async function createUser(ctx: {
  db: Db
  user: {
    email: string
    avatarUrl: string
    name: string
  }
  oauth?: {
    provider: (typeof schema.OauthAccounts.$inferInsert)['provider']
    providerUserId: string
    identifier: string
  }
}) {
  const lowerCaseEmail = ctx.user.email.toLocaleLowerCase()

  return await ctx.db.transaction(async (trx) => {
    const [user] = await trx
      .insert(schema.Users)
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
      .insert(schema.Organizations)
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
      .insert(schema.OrganizationMembers)
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
      await trx.insert(schema.OauthAccounts).values({
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
