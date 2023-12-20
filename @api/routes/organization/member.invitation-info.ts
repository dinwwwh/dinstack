import { authProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationMemberInvitationInfoRoute = authProcedure
  .input(
    z.object({
      invitationId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const invitation = await ctx.db.query.OrganizationsInvitations.findFirst({
      where(t, { eq }) {
        return eq(t.secretKey, input.invitationId)
      },
      with: {
        organization: true,
      },
    })

    if (!invitation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    }

    if (invitation.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'This invitation has expired',
      })
    }

    return {
      invitation,
    }
  })
