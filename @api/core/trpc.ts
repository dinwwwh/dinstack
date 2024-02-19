import type { ContextWithRequest } from '@api/lib/context'
import { TRPCError, initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

const t = initTRPC.context<ContextWithRequest>().create({
  transformer: SuperJSON,
})

export const middleware = t.middleware
export const router = t.router

// TODO: use this middleware when you not using @extension or turnstile support browser extension (not support for now 9-1-2024)
const _turnstileMiddleware = middleware(async ({ ctx, next, type }) => {
  if (type === 'mutation') {
    const formData = new FormData()
    formData.append('secret', ctx.env.TURNSTILE_SECRET_KEY)
    formData.append('response', ctx.request.headers.get('X-Turnstile-Token') || '')
    formData.append('remoteip', ctx.request.headers.get('CF-Connecting-IP') || '')

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    })
    const outcome = (await res.json()) as { success: boolean }
    if (!outcome.success) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are behaving like an automated bot',
      })
    }
  }

  return next({
    ctx,
  })
})

export const procedure = t.procedure.use(
  middleware(async ({ ctx, next, path, type }) => {
    const start = Date.now()
    const result = await next({ ctx })
    const executionTime = Date.now() - start

    if (type === 'query' && executionTime > 200) {
      ctx.ph.capture({
        distinctId: '__API__',
        event: 'trpc_slow_route',
        properties: {
          path,
          type,
          executionTime,
        },
      })
    }

    if (type === 'mutation' && executionTime > 400) {
      ctx.ph.capture({
        distinctId: '__API__',
        event: 'trpc_slow_route',
        properties: {
          path,
          type,
          executionTime,
        },
      })
    }

    return result
  }),
)

const authMiddleware = middleware(async ({ ctx, next }) => {
  const auth = ctx.auth

  if (!auth)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Please sign in and try again',
    })

  return next({
    ctx: {
      ...ctx,
      auth,
    },
  })
})

export const authProcedure = procedure.use(authMiddleware)
