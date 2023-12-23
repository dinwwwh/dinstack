import { organizationMembersRoles } from '+db/schema'
import type { Env } from '@api/lib/env'
import { GitHub, Google } from 'arctic'
import { TimeSpan } from 'oslo'
import { createJWT, validateJWT } from 'oslo/jwt'
import { z } from 'zod'

export const AUTH_JWT_ALGORITHM = 'HS256'

export const authJwtPayloadSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
  }),
  organizationMember: z.object({
    role: z.enum(organizationMembersRoles.enumValues),
    organizationId: z.string().uuid(),
  }),
})

export function createCreateAuthJwtFn({ env }: { env: Env }) {
  return async (payload: z.infer<typeof authJwtPayloadSchema>) => {
    const key = new TextEncoder().encode(env.AUTH_SECRET)

    return createJWT(AUTH_JWT_ALGORITHM, key, authJwtPayloadSchema.parse(payload), {
      expiresIn: new TimeSpan(30, 'd'),
      includeIssuedTimestamp: true,
    })
  }
}

export function createValidateAuthJwtFn({ env }: { env: Env }) {
  return async (token: string) => {
    try {
      const key = new TextEncoder().encode(env.AUTH_SECRET)
      const jwt = await validateJWT(AUTH_JWT_ALGORITHM, key, token)

      return authJwtPayloadSchema.parse(jwt.payload)
    } catch {
      return null
    }
  }
}

export function createAuthGoogle({ env }: { env: Env }) {
  return new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URL, {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  })
}

export function createAuthGithub({ env }: { env: Env }) {
  return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
    scope: ['user:email'],
  })
}
