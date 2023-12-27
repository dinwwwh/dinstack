import { authProcedure, organizationAdminMiddleware } from '@api/core/trpc'
import { OrganizationsInvitations, organizationInvitationSchema } from '@api/database/schema'
import { generateOrganizationInvitationEmail } from '@api/emails/organization-invitation'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationMemberInviteRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationInvitationSchema.shape.organizationId,
      email: organizationInvitationSchema.shape.email,
      role: organizationInvitationSchema.shape.role,
    }),
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

    const [[invitation], user, organization] = await Promise.all([
      createInvitation,
      findUser,
      findOrganization,
    ])

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
        const invitationAcceptUrl = new URL(
          `invitation-accept?secret-key=${invitation.secretKey}`,
          ctx.env.APP_BASE_URL,
        )
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
  })
