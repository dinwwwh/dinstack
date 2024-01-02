import { authProcedure } from '@api/core/trpc'
import { organizationSchema } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationDetailRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationSchema.shape.id,
    }),
  )
  .query(async ({ ctx, input }) => {
    const organization = await ctx.db.query.Organizations.findFirst({
      with: {
        members: {
          with: {
            user: true,
          },
        },
        invitations: {
          columns: {
            role: true,
            email: true,
            createdAt: true,
          },
          where(t, { gt }) {
            return gt(t.expiresAt, new Date())
          },
        },
      },
      where(t, { eq }) {
        return eq(t.id, input.organizationId)
      },
    })

    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      })
    }

    if (
      organization.members.find((member) => member.userId === ctx.auth.session.userId) === undefined
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this organization',
      })
    }

    return {
      organization,
    }
  })
