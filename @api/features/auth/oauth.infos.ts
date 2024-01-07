import { authProcedure } from '@api/core/trpc'

export const authOauthInfosRoute = authProcedure.query(async ({ ctx }) => {
  const oauthAccounts = await ctx.db.query.OauthAccounts.findMany({
    where(t, { eq }) {
      return eq(t.userId, ctx.auth.userId)
    },
  })

  return {
    oauthAccounts,
  }
})
