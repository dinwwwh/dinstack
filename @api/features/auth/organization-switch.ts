import { Sessions, organizationSchema } from '+db/schema'
import { authProcedure } from '@api/core/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOrganizationSwitchRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationSchema.shape.id,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Sessions)
      .set({ organizationId: input.organizationId })
      .where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
  })
