import {
  OrganizationMembers,
  OrganizationsInvitations,
  Sessions,
  organizationInvitationSchema,
} from '+db/schema'
import { authProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberAcceptInvitationRoute = authProcedure
  .input(
    z.object({
      invitationSecretKey: organizationInvitationSchema.shape.secretKey,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const invitation = await ctx.db.query.OrganizationsInvitations.findFirst({
      where(t, { eq }) {
        return eq(t.secretKey, input.invitationSecretKey)
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

    const existingMember = await ctx.db.query.OrganizationMembers.findFirst({
      where(t, { and, eq }) {
        return and(
          eq(t.organizationId, invitation.organizationId),
          eq(t.userId, ctx.auth.session.userId),
        )
      },
    })

    if (existingMember) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are already a member of this organization',
      })
    }

    await ctx.db.transaction(async (trx) => {
      await trx.insert(OrganizationMembers).values({
        organizationId: invitation.organizationId,
        userId: ctx.auth.session.userId,
        role: invitation.role,
      })

      await trx
        .delete(OrganizationsInvitations)
        .where(eq(OrganizationsInvitations.secretKey, invitation.secretKey))
    })

    await ctx.db
      .update(Sessions)
      .set({
        organizationId: invitation.organizationId,
      })
      .where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
  })
