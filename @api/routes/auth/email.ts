import { UserLoginOtps, Users } from '@api/database/schema'
import { generateFallbackAvatarUrl } from '@api/lib/utils'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { lte } from 'drizzle-orm'
import { alphabet, generateRandomString } from 'oslo/random'
import { z } from 'zod'

export const authEmailRouter = router({
  sendOtp: procedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .insert(Users)
        .values({
          email: input.email,
          avatarUrl: generateFallbackAvatarUrl({ name: '', email: input.email }),
          name: input.email.split('@')[0]!,
        })
        .onConflictDoNothing()
        .returning()

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })
      }

      const newOtp = generateRandomString(6, alphabet('a-z', '0-9'))
      const [otp] = await ctx.db
        .insert(UserLoginOtps)
        .values({
          userId: user.id,
          code: newOtp,
        })
        .onConflictDoUpdate({
          target: UserLoginOtps.userId,
          set: {
            code: newOtp,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
          },
          where: lte(UserLoginOtps.expiresAt, new Date(Date.now() - 1000 * 60)),
        })
        .returning()

      if (!otp) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create OTP',
        })
      }

      if (otp.code === newOtp) {
        // TODO: Send email
      }
    }),
  validateOtp: procedure
    .input(
      z.object({
        email: z.string().email().toLowerCase(),
        otp: z.string().length(6).toLowerCase(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.Users.findFirst({
        with: {
          loginOtp: true,
        },
        where(t, { eq }) {
          return eq(t.email, input.email)
        },
      })

      if (!user || !user.loginOtp || user.loginOtp.code !== input.otp || user.loginOtp.expiresAt < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid OTP',
        })
      }

      const jwt = await ctx.auth.createJwt({ user: { id: user.id } })

      return {
        auth: {
          user: {
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            email: user.email,
          },
          jwt,
        },
      }
    }),
})
