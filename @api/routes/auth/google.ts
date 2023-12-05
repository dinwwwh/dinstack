import { Users } from '@api/database/schema'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { generateState, generateCodeVerifier } from 'arctic'
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

      const [user] = await ctx.db
        .insert(Users)
        .values({
          name: userGoogle.name,
          email: userGoogle.email,
          avatarUrl: userGoogle.picture,
        })
        .onConflictDoUpdate({
          target: Users.email,
          set: {
            name: userGoogle.name,
            avatarUrl: userGoogle.picture,
          },
        })
        .returning()

      if (!user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' })
      }

      const jwt = await ctx.auth.createJwt({ user: { id: user.id } })

      return {
        auth: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
          jwt,
        },
      }
    }),
})
