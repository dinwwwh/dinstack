import { authProcedure } from '@api/core/trpc'
import { Sessions, sessionSchema } from '@api/database/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authNotificationPushRegisterRoute = authProcedure
  .input(
    z.object({
      subscription: sessionSchema.shape.pushSubscription,
    }),
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.db
      .update(Sessions)
      .set({
        pushSubscription: input.subscription,
      })
      .where(eq(Sessions.secretKey, ctx.auth.sessionSecretKey))
  })
