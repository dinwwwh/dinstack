import { Organizations, organizationSelectSchema } from '@api/database/schema'
import { authProcedure, organizationMemberMiddleware } from '@api/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationUpdateRoute = authProcedure
  .input(
    z.object({
      organization: organizationSelectSchema.pick({ id: true, name: true }),
    }),
  )
  .use(organizationMemberMiddleware)
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Organizations)
      .set({
        name: input.organization.name,
      })
      .where(eq(Organizations.id, input.organization.id))
  })
