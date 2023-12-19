import { Organizations } from '@api/database/schema'
import { authProcedure, organizationMemberMiddleware } from '@api/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationUpdateRoute = authProcedure
  .input(
    z.object({
      organization: z.object({
        id: z.string().uuid(),
        name: z.string(),
      }),
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
