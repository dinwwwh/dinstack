import { TRPCError, initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'
import type { Context } from './context'

const t = initTRPC.context<Context & { request: Request }>().create({
  transformer: SuperJSON,
})

export const middleware = t.middleware
export const router = t.router

export const procedure = t.procedure

const authedMiddleware = middleware(async ({ ctx, next }) => {
  const bearer = ctx.request.headers.get('Authorization')
  if (!bearer) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
  const token = bearer.replace(/^Bearer /, '')
  const authData = await ctx.auth.validateJwt(token)
  if (!authData) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' })

  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        ...authData,
      },
    },
  })
})

export const authedProcedure = procedure.use(authedMiddleware)
