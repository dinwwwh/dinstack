import { EmailOtps } from '@api/database/schema'
import { generateLoginEmail } from '@api/emails/login'
import { createUser } from '@api/lib/db'
import { generateFallbackAvatarUrl } from '@api/lib/utils'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { alphabet, generateRandomString } from 'oslo/random'
import { z } from 'zod'
import { authOutputSchema } from './_lib/output'
import { createSession } from './_lib/utils'

export const authEmailRouter = router({
  sendOtp: procedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: rate limit 2 times per hour

      const newOtp = generateRandomString(6, alphabet('a-z', '0-9'))

      await ctx.db
        .insert(EmailOtps)
        .values({
          code: newOtp,
          email: input.email,
          expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        })
        .onConflictDoUpdate({
          target: EmailOtps.email,
          set: {
            code: newOtp,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
          },
        })

      ctx.ec.waitUntil(
        (async () => {
          const { subject, html } = generateLoginEmail({ otp: newOtp.toUpperCase() })
          await ctx.email.send({
            to: [input.email],
            subject,
            html,
          })
        })(),
      )
    }),
  validateOtp: procedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
        otp: z.string().length(6).toLowerCase(),
      }),
    )
    .output(authOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: rate limit 10 times per 5 minutes

      const emailOtp = await ctx.db.query.EmailOtps.findFirst({
        where(t, { eq }) {
          return eq(t.email, input.email)
        },
      })

      if (!emailOtp || emailOtp.code !== input.otp || emailOtp.expiresAt < new Date()) {
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
            user: existingUser,
            organizationMember,
            session: await createSession({ ctx, organizationMember }),
          },
        }
      }

      const userName = input.email.split('@')[0] || 'Unknown'
      const { user, organizationMember } = await createUser({
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
          user: user,
          organizationMember,
          session: await createSession({ ctx, organizationMember }),
        },
      }
    }),
})
