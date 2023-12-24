import type { Context } from '@api/context'
import { TRPCError } from '@trpc/server'

export async function findSessionForAuth({
  ctx,
  sessionSecretKey,
}: {
  ctx: Context
  sessionSecretKey: string
}) {
  const session = await ctx.db.query.Sessions.findFirst({
    where(t, { eq }) {
      return eq(t.secretKey, sessionSecretKey)
    },
    with: {
      organizationMember: {
        with: {
          organization: {
            with: {
              members: {
                with: {
                  user: true,
                },
              },
            },
          },
          user: true,
        },
      },
    },
  })

  if (!session) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to find session',
    })
  }

  return session
}
