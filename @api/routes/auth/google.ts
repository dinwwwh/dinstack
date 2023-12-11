import { Users } from '@api/database/schema'
import { createUser } from '@api/lib/db'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { generateState, generateCodeVerifier } from 'arctic'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { authOutputSchema } from './_lib/output'

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
    .output(authOutputSchema)
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
        with: {
          organizationMembers: {
            with: {
              organization: true,
            },
            limit: 1,
          },
        },
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

        const organizationMember = oauthAccount.organizationMembers[0]
        if (!organizationMember) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find organization member' })
        }

        return {
          auth: {
            user: {
              id: oauthAccount.userId,
              name: googleName,
              email: googleEmail,
              avatarUrl: googleAvatarUrl,
            },
            organizationMember,
            jwt: await ctx.auth.createJwt({
              user: {
                id: oauthAccount.userId,
              },
              organizationMember,
            }),
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

      const { user, organizationMember } = await createUser({
        db: ctx.db,
        user: {
          name: googleName,
          avatarUrl: googleAvatarUrl,
          email: googleEmail,
        },
        oauth: {
          provider: 'google',
          providerUserId: googleUserId,
        },
      })

      return {
        auth: {
          user,
          organizationMember,
          jwt: await ctx.auth.createJwt({
            user,
            organizationMember,
          }),
        },
      }
    }),
})
