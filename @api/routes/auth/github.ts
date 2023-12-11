import { Users } from '@api/database/schema'
import { createUser } from '@api/lib/db'
import { procedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import type { GitHubUser } from 'arctic'
import { generateState } from 'arctic'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { authOutputSchema } from './_lib/output'

export const authGithubRouter = router({
  loginUrl: procedure.mutation(async ({ ctx }) => {
    const state = generateState()
    const url = await ctx.auth.github.createAuthorizationURL(state)

    return { url, state }
  }),
  validate: procedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .output(authOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const tokens = await ctx.auth.github.validateAuthorizationCode(input.code)
      // TODO: use arctic
      // const userGithub = await ctx.auth.github.getUser(tokens.accessToken)

      const userGithub = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'user-agent': 'arctic',
        },
      }).then((res) => res.json())) as GitHubUser

      if (!userGithub.email)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please make sure your Github account has an email' })

      const githubUserId = userGithub.id.toString()
      const githubEmail = userGithub.email.toLocaleLowerCase()
      const githubName = userGithub.name || userGithub.login
      const githubAvatarUrl = userGithub.avatar_url

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
          return and(eq(t.provider, 'github'), eq(t.providerUserId, githubUserId))
        },
      })

      if (oauthAccount) {
        ctx.ec.waitUntil(
          (async () => {
            await ctx.db
              .update(Users)
              .set({
                name: githubName,
                avatarUrl: githubAvatarUrl,
              })
              .where(eq(Users.id, githubUserId))
          })(),
        )

        const organizationMember = oauthAccount.organizationMembers[0]

        if (!organizationMember) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to find organization member',
          })
        }

        return {
          auth: {
            user: {
              id: githubUserId,
              name: githubName,
              email: githubEmail,
              avatarUrl: githubAvatarUrl,
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
          return eq(t.email, githubEmail)
        },
      })

      if (userByEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please login with your email and link to your Github account first',
        })
      }

      const { user, organizationMember } = await createUser({
        db: ctx.db,
        user: {
          name: githubName,
          avatarUrl: githubAvatarUrl,
          email: githubEmail,
        },
        oauth: {
          provider: 'github',
          providerUserId: githubUserId,
        },
      })

      return {
        auth: {
          user: user,
          organizationMember,
          jwt: await ctx.auth.createJwt({
            user,
            organizationMember,
          }),
        },
      }
    }),
})
