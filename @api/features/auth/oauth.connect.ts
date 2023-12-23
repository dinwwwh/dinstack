import { OauthAccounts, oauthAccountSchema } from '+db/schema'
import { uppercaseFirstLetter } from '+shared/lib/utils'
import { getOauthUser } from './helpers/get-oauth-user'
import { authProcedure } from '@api/core/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const authOauthConnectRoute = authProcedure
  .input(
    z.object({
      provider: oauthAccountSchema.shape.provider,
      code: z.string(),
      codeVerifier: z.string(),
      state: z.string(),
    }),
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

    const [oauthAccount, userOauthAccount] = await Promise.all([
      findOauthAccount,
      findUserOauthAccount,
    ])

    if (oauthAccount) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `This ${uppercaseFirstLetter(
          input.provider,
        )} account is already linked to another user.`,
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
  })
