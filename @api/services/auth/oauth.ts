import { OauthAccounts, oauthAccountSelectSchema } from '@api/database/schema'
import { createUser } from '@api/lib/db'
import { uppercaseFirstLetter } from '@api/lib/utils'
import { authProcedure, procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createOauthAuthorizationUrl, createSession, getOauthUser } from './_utils'

export const authOauthRouter = router({
  authorizationUrl: procedure
    .input(oauthAccountSelectSchema.pick({ provider: true }))
    .mutation(async ({ ctx, input }) => {
      return await createOauthAuthorizationUrl({
        ...input,
        ctx,
      })
    }),
  login: procedure
    .input(
      oauthAccountSelectSchema.pick({ provider: true }).and(
        z.object({
          code: z.string(),
          codeVerifier: z.string(),
          state: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const oauthUser = await getOauthUser({
        ...input,
        ctx,
      })

      const oauthAccount = await ctx.db.query.OauthAccounts.findFirst({
        with: {
          organizationMembers: {
            with: {
              organization: true,
            },
            limit: 1,
          },
        },
        where(t, { eq, and }) {
          return and(eq(t.provider, input.provider), eq(t.providerUserId, oauthUser.id))
        },
      })

      if (oauthAccount) {
        const organizationMember = oauthAccount.organizationMembers[0]
        if (!organizationMember) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find organization member' })
        }

        return {
          sessionSecretKey: (await createSession({ ctx, organizationMember })).secretKey,
        }
      }

      const userByEmail = await ctx.db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.email, oauthUser.email)
        },
      })

      if (userByEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Please login with your email and link to your ${uppercaseFirstLetter(
            input.provider,
          )} account first`,
        })
      }

      const { organizationMember } = await createUser({
        db: ctx.db,
        user: {
          name: oauthUser.name,
          avatarUrl: oauthUser.avatarUrl,
          email: oauthUser.email,
        },
        oauth: {
          provider: input.provider,
          providerUserId: oauthUser.id,
          identifier: oauthUser.identifier,
        },
      })

      return {
        sessionSecretKey: (await createSession({ ctx, organizationMember })).secretKey,
      }
    }),
  connect: authProcedure
    .input(
      oauthAccountSelectSchema.pick({ provider: true }).and(
        z.object({
          code: z.string(),
          codeVerifier: z.string(),
          state: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const oauthUser = await getOauthUser({
        ...input,
        ctx,
      })

      const findOauthAccount = ctx.db.query.OauthAccounts.findFirst({
        where(t, { eq, and }) {
          return and(eq(t.provider, input.provider), eq(t.providerUserId, oauthUser.id))
        },
      })

      const findUserOauthAccount = ctx.db.query.OauthAccounts.findFirst({
        where(t, { eq, and }) {
          return and(eq(t.provider, input.provider), eq(t.userId, ctx.auth.session.userId))
        },
      })

      const [oauthAccount, userOauthAccount] = await Promise.all([findOauthAccount, findUserOauthAccount])

      if (oauthAccount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `This ${uppercaseFirstLetter(input.provider)} account is already linked to another user.`,
        })
      }

      if (userOauthAccount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `You have already established a connection to another ${uppercaseFirstLetter(
            input.provider,
          )} account.`,
        })
      }

      await ctx.db.insert(OauthAccounts).values({
        provider: input.provider,
        providerUserId: oauthUser.id,
        userId: ctx.auth.session.userId,
        identifier: oauthUser.identifier,
      })
    }),
  disconnect: authProcedure
    .input(oauthAccountSelectSchema.pick({ provider: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(OauthAccounts)
        .where(and(eq(OauthAccounts.provider, input.provider), eq(OauthAccounts.userId, ctx.auth.session.userId)))
    }),
})
