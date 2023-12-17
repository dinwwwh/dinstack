import { OrganizationMembers, OrganizationsInvitations, organizationMembersRoles } from '@api/database/schema'
import { authProcedure, organizationAdminMiddleware, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberRouter = router({
  invite: authProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        email: z.string().email().toLowerCase(),
        role: z.enum(organizationMembersRoles.enumValues),
      }),
    )
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      const [invitation] = await ctx.db
        .insert(OrganizationsInvitations)
        .values({
          organizationId: input.organizationId,
          email: input.email,
          role: input.role,
        })
        .returning()

      if (!invitation) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invitation',
        })
      }

      const invitationAcceptUrl = new URL(`/accept-invitation?id=${invitation.id}`, ctx.env.WEB_URL)

      // TODO: send email
    }),
  invitationInfo: authProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.query.OrganizationsInvitations.findFirst({
        where(t, { eq }) {
          return eq(t.id, input.invitationId)
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

      return {
        invitation,
      }
    }),
  acceptInvitation: authProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.query.OrganizationsInvitations.findFirst({
        where(t, { eq }) {
          return eq(t.id, input.invitationId)
        },
      })

      if (!invitation) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invitation not found',
        })
      }

      const existingMember = await ctx.db.query.OrganizationMembers.findFirst({
        where(t, { and, eq }) {
          return and(eq(t.organizationId, invitation.organizationId), eq(t.userId, ctx.auth.session.userId))
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

        await trx.delete(OrganizationsInvitations).where(eq(OrganizationsInvitations.id, invitation.id))
      })
    }),
  remove: authProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.auth.session.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot remove yourself from the organization',
        })
      }

      await ctx.db
        .delete(OrganizationMembers)
        .where(
          and(
            eq(OrganizationMembers.userId, input.userId),
            eq(OrganizationMembers.organizationId, input.organizationId),
          ),
        )
        .execute()

      // TODO: handle related sessions
    }),
})
