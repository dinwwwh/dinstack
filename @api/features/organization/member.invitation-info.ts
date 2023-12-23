import { organizationInvitationSchema } from '+db/schema'
import { authProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationMemberInvitationInfoRoute = authProcedure
  .input(
    z.object({
      invitationSecretKey: organizationInvitationSchema.shape.secretKey,
    }),
  )
  .query(async ({ ctx, input }) => {
    const invitation = await ctx.db.query.OrganizationsInvitations.findFirst({
      where(t, { eq }) {
        return eq(t.secretKey, input.invitationSecretKey)
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
