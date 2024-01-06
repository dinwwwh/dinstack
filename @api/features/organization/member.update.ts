import { authProcedure, organizationAdminMiddleware } from '@api/core/trpc'
import { OrganizationMembers, organizationMemberSchema } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberUpdateRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationMemberSchema.shape.organizationId,
      userId: organizationMemberSchema.shape.userId,
      memberRole: organizationMemberSchema.shape.role,
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    if (input.userId === ctx.auth.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot update yourself from the organization',
      })
    }

    await ctx.db
      .update(OrganizationMembers)
      .set({
        role: input.memberRole,
      })
      .where(
        and(
          eq(OrganizationMembers.organizationId, input.organizationId),
          eq(OrganizationMembers.userId, input.userId),
        ),
      )
  })
