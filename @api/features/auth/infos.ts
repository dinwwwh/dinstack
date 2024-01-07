import { findSessionForAuth } from './helpers/find-session-for-auth'
import { authProcedure } from '@api/core/trpc'
import { signAuthJwt } from '@api/lib/auth'

export const authInfosRoute = authProcedure.query(async ({ ctx }) => {
  const session = await findSessionForAuth({ ctx, sessionSecretKey: ctx.auth.sessionSecretKey })

  return {
    auth: {
      ...session,
      jwt: await signAuthJwt({
        env: ctx.env,
        payload: {
          sessionSecretKey: session.secretKey,
          userId: session.user.id,
          organizationId: session.organizationMember.organizationId,
          organizationRole: session.organizationMember.role,
        },
      }),
    },
  }
})
