import type { Context } from '@api/context'
import type { OauthAccounts } from '@api/database/schema'
import { Sessions } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import type { GitHubUser } from 'arctic'
import { generateCodeVerifier, generateState } from 'arctic'
import { match } from 'ts-pattern'

export async function createSession({
  ctx,
  organizationMember,
}: {
  ctx: Context & { request: Request }
  organizationMember: {
    organizationId: string
    userId: string
  }
}) {
  const [session] = await ctx.db
    .insert(Sessions)
    .values({
      headers: Object.fromEntries(ctx.request.headers.entries()),
      userId: organizationMember.userId,
      organizationId: organizationMember.organizationId,
    })
    .returning()

  if (!session) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create session',
    })
  }

  return session
}

export async function createOauthAuthorizationUrl({
  ctx,
  provider,
}: {
  ctx: Context
  provider: (typeof OauthAccounts.$inferSelect)['provider']
}): Promise<{
  url: URL
  state: string
  codeVerifier: string
}> {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  return await match(provider)
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
}

export async function getOauthUser({
  ctx,
  provider,
  code,
  codeVerifier,
}: {
  ctx: Context
  provider: (typeof OauthAccounts.$inferSelect)['provider']
  code: string
  state: string
  codeVerifier: string
}): Promise<{
  id: string
  email: string
  name: string
  avatarUrl: string
  identifier: string
}> {
  return await match(provider)
    .with('github', async () => {
      const tokens = await ctx.auth.github.validateAuthorizationCode(code)
      // TODO: use arctic
      // const userGithub = await ctx.auth.github.getUser(tokens.accessToken)

      const userGithub = (await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'user-agent': 'arctic',
        },
      }).then((res) => res.json())) as GitHubUser

      if (!userGithub.email) throw new TRPCError({ code: 'BAD_REQUEST', message: 'This Github account has no email' })

      return {
        id: userGithub.id.toString(),
        email: userGithub.email.toLocaleLowerCase(),
        name: userGithub.name || userGithub.login,
        avatarUrl: userGithub.avatar_url,
        identifier: `@${userGithub.login}`,
      }
    })
    .with('google', async () => {
      const tokens = await ctx.auth.google.validateAuthorizationCode(code, codeVerifier)
      const userGoogle = await ctx.auth.google.getUser(tokens.accessToken)

      if (!userGoogle.email) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Google account has no email' })
      if (!userGoogle.email_verified)
        throw new TRPCError({ code: 'BAD_REQUEST', message: "This Google's email is not verified" })

      return {
        id: userGoogle.sub,
        email: userGoogle.email.toLocaleLowerCase(),
        name: userGoogle.name,
        avatarUrl: userGoogle.picture,
        identifier: userGoogle.email,
      }
    })
    .exhaustive()
}
