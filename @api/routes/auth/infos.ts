import { authProcedure } from '@api/trpc'
import { findSessionForAuth } from './_find-session-for-auth'

export const authInfosRoute = authProcedure.query(async ({ ctx }) => {
  const findSession = findSessionForAuth({ ctx, sessionSecretKey: ctx.auth.session.secretKey })

  const findOauthAccounts = ctx.db.query.OauthAccounts.findMany({
    where(t, { eq }) {
      return eq(t.userId, ctx.auth.session.userId)
    },
  })

  const [session, oauthAccounts] = await Promise.all([findSession, findOauthAccounts])

  return {
    session,
    oauthAccounts,
  }
})
