import {
  OrganizationMembers,
  OrganizationsInvitations,
  Sessions,
  organizationInvitationSelectSchema,
  organizationMemberSelectSchema,
  organizationSelectSchema,
} from '@api/database/schema'
import { generateOrganizationInvitationEmail } from '@api/emails/organization-invitation'
import { authProcedure, organizationAdminMiddleware, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberRouter = router({
  invite: authProcedure
    .input(
      organizationInvitationSelectSchema.pick({ email: true, role: true }).and(
        z.object({
          organizationId: organizationSelectSchema.shape.id,
        }),
      ),
    )
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      const createInvitation = ctx.db
        .insert(OrganizationsInvitations)
        .values({
          organizationId: input.organizationId,
          email: input.email,
          role: input.role,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .onConflictDoUpdate({
          target: [OrganizationsInvitations.organizationId, OrganizationsInvitations.email],
          set: {
            role: input.role,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        })
        .returning()

      const findUser = ctx.db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.id, ctx.auth.session.userId)
        },
      })

      const findOrganization = ctx.db.query.Organizations.findFirst({
        where(t, { eq }) {
          return eq(t.id, input.organizationId)
        },
      })

      const [[invitation], user, organization] = await Promise.all([createInvitation, findUser, findOrganization])

      if (!invitation) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invitation',
        })
      }

      if (!user || !organization) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user or organization',
        })
      }

      ctx.ec.waitUntil(
        (async () => {
          const invitationAcceptUrl = new URL(`/invitation-accept?secret-key=${invitation.secretKey}`, ctx.env.WEB_URL)
          const { subject, html } = generateOrganizationInvitationEmail({
            inviterName: user.name,
            organizationName: organization.name,
            invitationAcceptUrl: invitationAcceptUrl.toString(),
          })
          await ctx.email.send({
            to: [input.email],
            subject,
            html,
          })
        })(),
      )
    }),
  invitationInfo: authProcedure
    .input(
      z.object({
        invitationSecretKey: organizationInvitationSelectSchema.shape.secretKey,
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
    }),
  acceptInvitation: authProcedure
    .input(
      z.object({
        invitationSecretKey: organizationInvitationSelectSchema.shape.secretKey,
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

        await trx.delete(OrganizationsInvitations).where(eq(OrganizationsInvitations.secretKey, invitation.secretKey))
      })

      await ctx.db
        .update(Sessions)
        .set({
          organizationId: invitation.organizationId,
        })
        .where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
    }),
  remove: authProcedure
    .input(organizationMemberSelectSchema.pick({ organizationId: true, userId: true }))
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.auth.session.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You cannot remove yourself from the organization',
        })
      }

      await ctx.db.transaction(async (trx) => {
        await trx
          .delete(Sessions)
          .where(and(eq(Sessions.userId, input.userId), eq(Sessions.organizationId, input.organizationId)))

        await trx
          .delete(OrganizationMembers)
          .where(
            and(
              eq(OrganizationMembers.userId, input.userId),
              eq(OrganizationMembers.organizationId, input.organizationId),
            ),
          )
      })
    }),
})
