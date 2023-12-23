import { EmailOtps, emailOtpSchema } from '+db/schema'
import { generateLoginEmail } from '@api/emails/login'
import { procedure } from '@api/trpc'
import { alphabet, generateRandomString } from 'oslo/random'
import { z } from 'zod'

export const authEmailSendOtpRoute = procedure
  .input(
    z.object({
      email: emailOtpSchema.shape.email,
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
  })
