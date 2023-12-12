import { TRPCError, initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'
import type { Context } from './context'

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
  const sessionId = bearer.replace(/^Bearer /, '')
  const session = await ctx.db.query.Sessions.findFirst({
    columns: {
      id: true,
      createdAt: true,
      userId: true,
    },
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
      return eq(t.id, sessionId)
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
