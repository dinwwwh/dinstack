import { findSessionForAuth } from './helpers/find-session-for-auth'
import { authProcedure } from '@api/core/trpc'

export const authInfosRoute = authProcedure.query(async ({ ctx }) => {
  const session = await findSessionForAuth({ ctx, sessionSecretKey: ctx.auth.session.secretKey })

  return {
    session,
  }
})
