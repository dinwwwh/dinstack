import { authedProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authOutputSchema } from './_lib/output'

export const authOrganizationSwitchRoute = authedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    }),
  )
  .output(authOutputSchema)
  .mutation(async ({ ctx, input }) => {
    // TODO: use session id for issue new jwt, does not use jwt to issue new jwt

    const organizationMember = await ctx.db.query.OrganizationMembers.findFirst({
      with: {
        user: true,
        organization: true,
      },
      where(t, { and, eq }) {
        return and(eq(t.organizationId, input.organizationId), eq(t.userId, ctx.auth.user.id))
      },
    })

    if (!organizationMember) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this organization',
      })
    }

    return {
      auth: {
        user: organizationMember.user,
        organizationMember,
        jwt: await ctx.auth.createJwt({
          user: organizationMember.user,
          organizationMember,
        }),
      },
    }
  })
