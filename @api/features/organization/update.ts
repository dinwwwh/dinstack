import { Organizations, organizationSchema } from '+db/schema'
import { authProcedure, organizationAdminMiddleware } from '@api/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationUpdateRoute = authProcedure
  .input(
    z.object({
      organization: organizationSchema.pick({
        id: true,
        name: true,
      }),
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Organizations)
      .set({
        name: input.organization.name,
      })
      .where(eq(Organizations.id, input.organization.id))
  })
