import { getActiveSubscriptionVariantIds } from '@api/features/auth/helpers/filter-and-map-active-subscription-variant-ids'
import { decodeAuthJwt, verifyAuthJwt } from '@api/lib/auth'
import type { Context } from '@api/lib/context'
import type { Db } from '@api/lib/db'
import { TRPCError, experimental_standaloneMiddleware, initTRPC } from '@trpc/server'
import { JWTExpired } from 'jose/errors'
import SuperJSON from 'superjson'

const t = initTRPC.context<Context & { request: Request }>().create({
  transformer: SuperJSON,
})

export const middleware = t.middleware
export const router = t.router

const turnstileMiddleware = middleware(async ({ ctx, next, type }) => {
  if (type === 'mutation') {
    const formData = new FormData()
    formData.append('secret', ctx.env.TURNSTILE_SECRET_KEY)
    formData.append('response', ctx.request.headers.get('X-Turnstile-Token'))
    formData.append('remoteip', ctx.request.headers.get('CF-Connecting-IP'))

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    })
    const outcome = (await res.json()) as { success: boolean }
    if (!outcome.success) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are behaving like an automated bot.',
      })
    }
  }

  return next({
    ctx,
  })
})

export const procedure = t.procedure.use(turnstileMiddleware)

const authMiddleware = middleware(async ({ ctx, next }) => {
  const jwt = ctx.request.headers.get('Authorization')?.replace(/^Bearer /, '')

  if (!jwt) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const auth: Awaited<ReturnType<typeof verifyAuthJwt>> | null = await (async () => {
    try {
      return await verifyAuthJwt({ env: ctx.env, jwt })
    } catch (e) {
      if (e instanceof JWTExpired) {
        const payload = decodeAuthJwt({ jwt })

        const session = await ctx.db.query.Sessions.findFirst({
          where(t, { eq }) {
            return eq(t.secretKey, payload.sessionSecretKey)
          },
          with: {
            organizationMember: {
              with: {
                user: {
                  with: {
                    subscriptions: true,
                  },
                },
              },
            },
          },
        })

        if (session) {
          return {
            sessionSecretKey: session.secretKey,
            userId: session.userId,
            organizationId: session.organizationId,
            organizationRole: session.organizationMember.role,
            activeSubscriptionVariantIds: getActiveSubscriptionVariantIds(
              session.organizationMember.user.subscriptions,
            ),
          }
        }
      }

      return null
    }
  })()

  if (!auth) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        ...auth,
      },
    },
  })
})

export const authProcedure = procedure.use(authMiddleware)

export const organizationMemberMiddleware = experimental_standaloneMiddleware<{
  ctx: { auth: { userId: string }; db: Db }
  input: { organizationId: string } | { organization: { id: string } }
}>().create(async ({ ctx, next, input }) => {
  const organizationId = 'organizationId' in input ? input.organizationId : input.organization.id

  const organizationMember = await ctx.db.query.OrganizationMembers.findFirst({
    where(t, { and, eq }) {
      return and(eq(t.organizationId, organizationId), eq(t.userId, ctx.auth.userId))
    },
  })

  if (!organizationMember)
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not a member of this organization.',
    })

  return next()
})

export const organizationAdminMiddleware = experimental_standaloneMiddleware<{
  ctx: { auth: { userId: string }; db: Db }
  input: { organizationId: string } | { organization: { id: string } }
}>().create(async ({ ctx, next, input }) => {
  const organizationId = 'organizationId' in input ? input.organizationId : input.organization.id

  const organizationMember = await ctx.db.query.OrganizationMembers.findFirst({
    where(t, { and, eq }) {
      return and(
        eq(t.organizationId, organizationId),
        eq(t.userId, ctx.auth.userId),
        eq(t.role, 'admin'),
      )
    },
  })

  if (!organizationMember)
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not an admin of this organization.',
    })

  return next()
})
