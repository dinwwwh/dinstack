import { authProcedure } from '@api/core/trpc'
import { Sessions } from '@api/database/schema'
import { and, eq, not } from 'drizzle-orm'

export const authLogoutOtherDevicesRoute = authProcedure.mutation(async ({ ctx }) => {
  await ctx.db
    .delete(Sessions)
    .where(
      and(
        eq(Sessions.userId, ctx.auth.session.userId),
        not(eq(Sessions.secretKey, ctx.auth.session.secretKey)),
      ),
    )
})
