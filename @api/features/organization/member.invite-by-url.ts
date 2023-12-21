import { generateInvitationAcceptUrl } from './helpers/generate-invitation-accept-url'
import { OrganizationInvitations, organizationInvitationSchema } from '@api/database/schema'
import { authProcedure, organizationAdminMiddleware } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationMemberInviteByUrlRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationInvitationSchema.shape.organizationId,
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    const [invitation] = await ctx.db
      .insert(OrganizationInvitations)
      .values({
        organizationId: input.organizationId,
        email: null,
        role: 'member',
        usageLimit: null,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
      .onConflictDoUpdate({
        target: [OrganizationInvitations.organizationId, OrganizationInvitations.email],
        set: {
          role: 'member',
          usageLimit: null,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      })
      .returning()

    if (!invitation) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create invitation',
      })
    }

    const url = generateInvitationAcceptUrl({ ctx, invitationSecretKey: invitation.secretKey })
    return {
      url,
    }
  })
