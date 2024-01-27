/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import * as _A from '../node_modules/hono/dist/types/context'
import { appRouter } from './router'
import { handleWebhookRequest } from '@api/features/billing/webhook'
import type { Context } from '@api/lib/context'
import { createContext } from '@api/lib/context'
import { type Env, envSchema } from '@api/lib/env'
import { Clerk } from '@clerk/backend'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

type ClerkAuth = Awaited<ReturnType<ReturnType<typeof Clerk>['authenticateRequest']>>['toAuth']

type Variables = {
  context: Context
  clerk: ReturnType<typeof Clerk>
  clerkAuth: ReturnType<ClerkAuth>
}

const app = new Hono<{ Variables: Variables; Bindings: Env }>()
  .use('*', cors())
  .use('*', async (c, next) => {
    // VALIDATE ENV FOR ENSURE
    const env = envSchema.parse(c.env)
    const context = createContext({ env, ec: c.executionCtx })

    c.set('context', context)

    await next()

    c.executionCtx.waitUntil(context.ph.shutdownAsync())
  })
  .use('*', async (c, next) => {
    const ctx = c.get('context')
    const start = Date.now()

    const requestState = await ctx.clerk.authenticateRequest({
      request: c.req.raw,
    })

    c.set('clerkAuth', requestState.toAuth())

    console.log('-===--=-=-=: ' + (Date.now() - start))
    console.log(c.get('clerkAuth'))

    await next()
  })
  .all('/trpc/*', async (c) => {
    return await fetchRequestHandler({
      endpoint: '/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext: () => ({ ...c.get('context'), request: c.req.raw }),
      onError({ error }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') console.error(error)
      },
    })
  })
  .post('/billing/webhook', async (c) => {
    return await handleWebhookRequest({ ...c.get('context'), request: c.req.raw })
  })
  .get('/public/:objectName{.+}', async (c) => {
    const object = await c.env.PUBLIC_BUCKET.get(c.req.param('objectName'))

    if (object) {
      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)

      return new Response(object.body, {
        headers,
      })
    }
  })

export default {
  fetch: app.fetch,
}
