import { OrganizationMembers, Organizations } from '@api/database/schema'
import { generateFallbackLogoUrl } from '@api/lib/utils'
import { authProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationCreateRoute = authProcedure
  .input(
    z.object({
      organization: z.object({
        name: z.string(),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // TODO: limit

    const { organization, organizationMember } = await ctx.db.transaction(async (trx) => {
      const [organization] = await trx
        .insert(Organizations)
        .values({
          name: input.organization.name,
          logoUrl: generateFallbackLogoUrl({ name: input.organization.name }),
        })
        .returning()

      if (!organization) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create organization',
        })
      }

      const [organizationMember] = await trx
        .insert(OrganizationMembers)
        .values({
          organizationId: organization.id,
          userId: ctx.auth.session.userId,
          role: 'admin',
        })
        .returning()

      return {
        organization,
        organizationMember,
      }
    })

    return {
      organization: {
        ...organization,
        members: [organizationMember],
      },
    }
  })
