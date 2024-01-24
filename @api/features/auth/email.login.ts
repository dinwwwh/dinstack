import { createDefaultOrganization } from './helpers/create-default-organization'
import { createSession } from './helpers/create-session'
import { createUser } from './helpers/create-user'
import { getActiveSubscriptionVariantIds } from './helpers/filter-and-map-active-subscription-variant-ids'
import { procedure } from '@api/core/trpc'
import { EmailOtps, emailOtpSchema } from '@api/database/schema'
import { signAuthJwt } from '@api/lib/auth'
import { generateFallbackAvatarUrl } from '@api/lib/utils'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authEmailLoginRoute = procedure
  .input(
    z.object({
      email: emailOtpSchema.shape.email,
      code: emailOtpSchema.shape.code,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // TODO: rate limit 10 times per 5 minutes

    const emailOtp = await ctx.db.query.EmailOtps.findFirst({
      where(t, { eq }) {
        return eq(t.email, input.email)
      },
    })

    if (!emailOtp || emailOtp.code !== input.code || emailOtp.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid OTP',
      })
    }

    ctx.ec.waitUntil(
      (async () => {
        await ctx.db.delete(EmailOtps).where(eq(EmailOtps.email, input.email))
      })(),
    )

    const existingUser = await ctx.db.query.Users.findFirst({
      with: {
        subscriptions: true,
        organizationMembers: {
          with: {
            organization: {
              with: {
                members: true,
              },
            },
          },
          limit: 1,
        },
      },
      where(t, { eq }) {
        return eq(t.email, input.email)
      },
    })

    if (existingUser) {
      const organizationMember = await (async () => {
        if (existingUser.organizationMembers[0]) return existingUser.organizationMembers[0]

        const { organization, organizationMember } = await createDefaultOrganization({
          db: ctx.db,
          userId: existingUser.id,
        })

        return {
          ...organizationMember,
          organization: {
            ...organization,
            members: [organizationMember],
          },
        }
      })()

      const session = await createSession({ ctx, organizationMember })
      const jwt = await signAuthJwt({
        env: ctx.env,
        payload: {
          sessionSecretKey: session.secretKey,
          userId: existingUser.id,
          organizationId: organizationMember.organizationId,
          organizationRole: organizationMember.role,
          activeSubscriptionVariantIds: getActiveSubscriptionVariantIds(existingUser.subscriptions),
        },
      })

      return {
        auth: {
          jwt,
          session,
          user: existingUser,
          organization: organizationMember.organization,
          organizationMember,
        },
      }
    }

    const userName = input.email.split('@')[0] || 'Unknown'
    const { user } = await createUser({
      db: ctx.db,
      user: {
        avatarUrl: generateFallbackAvatarUrl({
          name: userName,
          email: input.email,
        }),
        email: input.email,
        name: userName,
      },
    })
    const { organization, organizationMember } = await createDefaultOrganization({
      db: ctx.db,
      userId: user.id,
    })

    const session = await createSession({ ctx, organizationMember })
    const jwt = await signAuthJwt({
      env: ctx.env,
      payload: {
        sessionSecretKey: session.secretKey,
        userId: user.id,
        organizationId: organizationMember.organizationId,
        organizationRole: organizationMember.role,
        activeSubscriptionVariantIds: [],
      },
    })

    return {
      auth: {
        jwt,
        session,
        user: {
          ...user,
          subscriptions: [],
        },
        organization: {
          ...organization,
          members: [organizationMember],
        },
        organizationMember,
      },
    }
  })
