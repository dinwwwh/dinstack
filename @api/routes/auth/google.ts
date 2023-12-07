import { OauthAccounts, Users } from '@api/database/schema'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { generateState, generateCodeVerifier } from 'arctic'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authGoogleRouter = router({
  loginUrl: procedure.mutation(async ({ ctx }) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const url = await ctx.auth.google.createAuthorizationURL(state, codeVerifier)

    return { url, state, codeVerifier }
  }),
  validate: procedure
    .input(
      z.object({
        code: z.string(),
        codeVerifier: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tokens = await ctx.auth.google.validateAuthorizationCode(input.code, input.codeVerifier)
      const userGoogle = await ctx.auth.google.getUser(tokens.accessToken)

      if (!userGoogle.email) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Google account has no email' })
      if (!userGoogle.email_verified)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Google account email is not verified' })

      const googleUserId = userGoogle.sub
      const googleEmail = userGoogle.email.toLocaleLowerCase()
      const googleName = userGoogle.name
      const googleAvatarUrl = userGoogle.picture

      const oauthAccount = await ctx.db.query.OauthAccounts.findFirst({
        where(t, { eq, and }) {
          return and(eq(t.provider, 'google'), eq(t.providerUserId, googleUserId))
        },
      })

      if (oauthAccount) {
        ctx.ec.waitUntil(
          (async () => {
            await ctx.db
              .update(Users)
              .set({
                name: googleName,
                avatarUrl: googleAvatarUrl,
              })
              .where(eq(Users.id, oauthAccount.userId))
          })(),
        )

        return {
          auth: {
            user: {
              id: oauthAccount.userId,
              name: googleName,
              email: googleEmail,
              avatarUrl: googleAvatarUrl,
            },
            jwt: await ctx.auth.createJwt({ user: { id: oauthAccount.userId } }),
          },
        }
      }

      const userByEmail = await ctx.db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.email, googleEmail)
        },
      })

      if (userByEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please login with your email and link to your Google account first',
        })
      }

      const user = await ctx.db.transaction(async (trx) => {
        const [user] = await trx
          .insert(Users)
          .values({
            email: googleEmail,
            name: userGoogle.name,
            avatarUrl: userGoogle.picture,
          })
          .returning()

        if (!user) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' })
        }

        await trx.insert(OauthAccounts).values({
          provider: 'google',
          providerUserId: googleUserId,
          userId: user.id,
        })

        return user
      })

      return {
        auth: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
          jwt: await ctx.auth.createJwt({ user: { id: user.id } }),
        },
      }
    }),
})
