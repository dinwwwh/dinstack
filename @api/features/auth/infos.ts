import { findSessionForAuth } from './helpers/find-session-for-auth'
import { authProcedure } from '@api/trpc'

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
