import { Sessions, organizationSelectSchema } from '@api/database/schema'
import { authProcedure, organizationMemberMiddleware } from '@api/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOrganizationSwitchRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationSelectSchema.shape.id,
    }),
  )
  .use(organizationMemberMiddleware)
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Sessions)
      .set({ organizationId: input.organizationId })
      .where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
  })
