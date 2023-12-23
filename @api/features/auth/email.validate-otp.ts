import { EmailOtps, emailOtpSchema } from '+db/schema'
import { createSession } from './helpers/create-session'
import { createUser } from './helpers/create-user'
import { findSessionForAuth } from './helpers/find-session-for-auth'
import { procedure } from '@api/core/trpc'
import { generateFallbackAvatarUrl } from '@api/lib/utils'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authEmailValidateOtpRoute = procedure
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
        organizationMembers: {
          with: {
            organization: true,
          },
          limit: 1,
        },
      },
      where(t, { eq }) {
        return eq(t.email, input.email)
      },
    })

    if (existingUser) {
      const organizationMember = existingUser.organizationMembers[0]

      if (!organizationMember) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to find organization member',
        })
      }

      const sessionSecretKey = (await createSession({ ctx, organizationMember })).secretKey

      const session = await findSessionForAuth({ ctx, sessionSecretKey })

      return {
        session,
      }
    }

    const userName = input.email.split('@')[0] || 'Unknown'
    const { organizationMember } = await createUser({
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

    const sessionSecretKey = (await createSession({ ctx, organizationMember })).secretKey

    const session = await findSessionForAuth({ ctx, sessionSecretKey })

    return {
      session,
    }
  })
