import type {
  OrganizationMembers,
  Organizations,
  Sessions,
  Subscriptions,
  Users,
} from '@api/database/schema'
import {
  organizationMemberSchema,
  organizationSchema,
  sessionSchema,
  subscriptionSchema,
  userSchema,
} from '@api/database/schema'
import type { Env } from '@api/lib/env'
import { GitHub, Google } from 'arctic'
import { SignJWT, decodeJwt, jwtVerify } from 'jose'
import { z } from 'zod'

const encoder = new TextEncoder()

export const AUTH_JWT_ALGORITHM = 'HS256'
export const AUTH_JWT_LIVE_TIME_IN_SECONDS = 60 * 60

const jwtPayloadSchema = z.object({
  ssk: sessionSchema.shape.secretKey,
  ui: userSchema.shape.id,
  oi: organizationSchema.shape.id,
  or: organizationMemberSchema.shape.role,
  asvi: z.array(subscriptionSchema.shape.variantId),
})

type InteractionAuth = {
  sessionSecretKey: (typeof Sessions.$inferSelect)['secretKey']
  userId: (typeof Users.$inferSelect)['id']
  organizationId: (typeof Organizations.$inferSelect)['id']
  organizationRole: (typeof OrganizationMembers.$inferSelect)['role']
  activeSubscriptionVariantIds: (typeof Subscriptions.$inferSelect)['variantId'][]
}

export async function signAuthJwt(opts: { env: Env; payload: InteractionAuth }) {
  const payload = {
    ssk: opts.payload.sessionSecretKey,
    ui: opts.payload.userId,
    oi: opts.payload.organizationId,
    or: opts.payload.organizationRole,
    asvi: opts.payload.activeSubscriptionVariantIds,
  } satisfies z.infer<typeof jwtPayloadSchema>

  return await new SignJWT(jwtPayloadSchema.parse(payload))
    .setProtectedHeader({ alg: AUTH_JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000) + AUTH_JWT_LIVE_TIME_IN_SECONDS)
    .sign(encoder.encode(opts.env.AUTH_SECRET))
}

export function decodeAuthJwt(opts: { jwt: string }) {
  const payload = jwtPayloadSchema.parse(decodeJwt(opts.jwt))
  return {
    sessionSecretKey: payload.ssk,
    userId: payload.ui,
    organizationId: payload.oi,
    organizationRole: payload.or,
    activeSubscriptionVariantIds: payload.asvi,
  } satisfies InteractionAuth
}

export async function verifyAuthJwt(opts: { jwt: string; env: Env }) {
  const payload = jwtPayloadSchema.parse(
    (await jwtVerify(opts.jwt, encoder.encode(opts.env.AUTH_SECRET))).payload,
  )

  return {
    sessionSecretKey: payload.ssk,
    userId: payload.ui,
    organizationId: payload.oi,
    organizationRole: payload.or,
    activeSubscriptionVariantIds: payload.asvi,
  } satisfies InteractionAuth
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
