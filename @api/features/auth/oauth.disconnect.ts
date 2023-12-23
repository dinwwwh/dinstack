import { OauthAccounts, oauthAccountSchema } from '+db/schema'
import { authProcedure } from '@api/trpc'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOauthDisconnectRoute = authProcedure
  .input(
    z.object({
      provider: oauthAccountSchema.shape.provider,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(OauthAccounts)
      .where(
        and(
          eq(OauthAccounts.provider, input.provider),
          eq(OauthAccounts.userId, ctx.auth.session.userId),
        ),
      )
  })
