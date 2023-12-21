import { Sessions } from '@api/database/schema'
import { authProcedure } from '@api/trpc'
import { eq } from 'drizzle-orm'

export const authLogoutRoute = authProcedure.mutation(async ({ ctx }) => {
  await ctx.db.delete(Sessions).where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
})
