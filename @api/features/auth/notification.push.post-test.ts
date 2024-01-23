import { authProcedure } from '@api/core/trpc'
import { buildPushPayload } from '@block65/webcrypto-web-push'
import { TRPCError } from '@trpc/server'

export const authNotificationPushPostTestRoute = authProcedure.mutation(async ({ ctx }) => {
  const session = await ctx.db.query.Sessions.findFirst({
    where(t, { eq }) {
      return eq(t.secretKey, ctx.auth.sessionSecretKey)
    },
  })

  if (!session) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Fail to find session',
    })
  }

  if (!session.pushSubscription) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This session does not register push notification yet',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 10_000))

  const payload = await buildPushPayload(
    {
      data: "You've got mail!",
    },
    session.pushSubscription,
    {
      subject: `mailto:${ctx.env.SUPPORT_EMAIL}`,
      publicKey: ctx.env.VAPID_PUBLIC_KEY,
      privateKey: ctx.env.VAPID_PRIVATE_KEY,
    },
  )

  await fetch(session.pushSubscription.endpoint, payload)
})
