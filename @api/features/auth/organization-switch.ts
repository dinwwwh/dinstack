import { findSessionForAuth } from './helpers/find-session-for-auth'
import { authProcedure } from '@api/core/trpc'
import { Sessions, organizationSchema } from '@api/database/schema'
import { signAuthJwt } from '@api/lib/auth'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOrganizationSwitchRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationSchema.shape.id,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(Sessions)
      .set({ organizationId: input.organizationId })
      .where(eq(Sessions.secretKey, ctx.auth.sessionSecretKey))

    const session = await findSessionForAuth({ ctx, sessionSecretKey: ctx.auth.sessionSecretKey })

    return {
      auth: {
        ...session,
        jwt: await signAuthJwt({
          env: ctx.env,
          payload: {
            sessionSecretKey: session.secretKey,
            userId: session.user.id,
            organizationId: session.organizationMember.organizationId,
            organizationRole: session.organizationMember.role,
          },
        }),
      },
    }
  })
