import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { generateState } from 'arctic'
import { z } from 'zod'

export const authGithubRouter = router({
  loginUrl: procedure.mutation(async ({ ctx }) => {
    const state = generateState()
    const url = await ctx.authGithub.createAuthorizationURL(state)

    return { url }
  }),
  validate: procedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tokens = await ctx.authGithub.validateAuthorizationCode(input.code)
      const githubUser = await ctx.authGithub.getUser(tokens.accessToken)

      if (!githubUser.email) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email not found on GitHub account' })

      // TODO: database implementation

      tokens.accessToken
    }),
})
