import { EmailOtps, emailOtpSchema } from '@api/database/schema'
import { createUser } from '@api/lib/db'
import { generateFallbackAvatarUrl } from '@api/lib/utils'
import { procedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { createSession } from './_create-session'

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

      return {
        auth: {
          session: await createSession({ ctx, organizationMember }),
        },
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

    return {
      auth: {
        session: await createSession({ ctx, organizationMember }),
      },
    }
  })
