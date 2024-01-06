import { authProcedure, organizationAdminMiddleware } from '@api/core/trpc'
import { OrganizationMembers, Organizations, Sessions } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationDeleteRoute = authProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    if (ctx.auth.organizationId === input.organizationId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please switch to another organization before deleting this one.',
      })
    }

    await ctx.db.transaction(async (trx) => {
      await trx.delete(Sessions).where(eq(Sessions.organizationId, input.organizationId))

      await trx
        .delete(OrganizationMembers)
        .where(eq(OrganizationMembers.organizationId, input.organizationId))

      await trx.delete(Organizations).where(eq(Organizations.id, input.organizationId))
    })
  })
