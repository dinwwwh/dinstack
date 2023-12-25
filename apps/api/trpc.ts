import type { Context } from './context'
import { Db } from '@db/lib/db'
import { TRPCError, experimental_standaloneMiddleware, initTRPC } from '@trpc/server'
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
  const bearer = ctx.request.headers.get('Authorization')
  if (!bearer) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
  const sessionSecretKey = bearer.replace(/^Bearer /, '')
  const session = await ctx.db.query.Sessions.findFirst({
    with: {
      organizationMember: {
        columns: {
          organizationId: true,
          role: true,
          createdAt: true,
        },
      },
    },
    where(t, { eq }) {
      return eq(t.secretKey, sessionSecretKey)
    },
  })
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        session,
      },
    },
  })
})

export const authProcedure = procedure.use(authMiddleware)

export const organizationMemberMiddleware = experimental_standaloneMiddleware<{
  ctx: { auth: { session: { userId: string } }; db: Db }
  input: { organizationId: string } | { organization: { id: string } }
}>().create(async ({ ctx, next, input }) => {
  const organizationId = 'organizationId' in input ? input.organizationId : input.organization.id

  const organizationMember = await ctx.db.query.OrganizationMembers.findFirst({
    where(t, { and, eq }) {
      return and(eq(t.organizationId, organizationId), eq(t.userId, ctx.auth.session.userId))
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
  ctx: { auth: { session: { userId: string } }; db: Db }
  input: { organizationId: string } | { organization: { id: string } }
}>().create(async ({ ctx, next, input }) => {
  const organizationId = 'organizationId' in input ? input.organizationId : input.organization.id

  const organizationMember = await ctx.db.query.OrganizationMembers.findFirst({
    where(t, { and, eq }) {
      return and(
        eq(t.organizationId, organizationId),
        eq(t.userId, ctx.auth.session.userId),
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
