import { OauthAccounts } from '@api/database/schema'
import { authProcedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { GitHubUser } from 'arctic'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOauthRouter = router({
  disconnect: authProcedure
    .input(
      z.object({
        provider: z.enum(['github', 'google']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(OauthAccounts)
        .where(and(eq(OauthAccounts.provider, input.provider), eq(OauthAccounts.userId, ctx.auth.session.userId)))
    }),
})
