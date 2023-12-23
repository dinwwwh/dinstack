import { procedure } from '@api/trpc'
import { oauthAccountSchema } from '@db/schema'
import { generateCodeVerifier, generateState } from 'arctic'
import { match } from 'ts-pattern'
import { z } from 'zod'

export const authOauthAuthorizationUrlRoute = procedure
  .input(
    z.object({
      provider: oauthAccountSchema.shape.provider,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    return await match(input.provider)
      .with('github', async () => {
        return {
          url: await ctx.auth.github.createAuthorizationURL(state),
          state,
          codeVerifier,
        }
      })
      .with('google', async () => {
        return {
          url: await ctx.auth.google.createAuthorizationURL(state, codeVerifier),
          state,
          codeVerifier,
        }
      })
      .exhaustive()
  })
