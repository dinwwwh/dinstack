import { TRPCError, initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'
import type { Context } from './context'

const t = initTRPC.context<Context & { request: Request }>().create({
  transformer: SuperJSON,
})

export const middleware = t.middleware
export const router = t.router

export const procedure = t.procedure

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
      session,
    },
  })
})

export const authProcedure = procedure.use(authMiddleware)
