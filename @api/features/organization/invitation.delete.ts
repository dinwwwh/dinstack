import { authProcedure, organizationAdminMiddleware } from '@api/core/trpc'
import { OrganizationInvitations } from '@api/database/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationInvitationDeleteRoute = authProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
      invitationEmail: z.string().email().toLowerCase(),
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(OrganizationInvitations)
      .where(eq(OrganizationInvitations.email, input.invitationEmail))
  })
