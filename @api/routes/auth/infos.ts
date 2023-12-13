import { authProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'

export const authInfosRoute = authProcedure.query(async ({ ctx }) => {
  const findSession = ctx.db.query.Sessions.findFirst({
    where(t, { eq }) {
      return eq(t.id, ctx.auth.session.id)
    },
    with: {
      organizationMember: {
        with: {
          organization: {
            with: {
              members: true,
            },
          },
          user: true,
        },
      },
    },
  })

  const findOauthAccounts = ctx.db.query.OauthAccounts.findMany({
    where(t, { eq }) {
      return eq(t.userId, ctx.auth.session.userId)
    },
  })

  const [session, oauthAccounts] = await Promise.all([findSession, findOauthAccounts])

  if (!session) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to find session',
    })
  }

  return {
    session,
    oauthAccounts,
  }
})
