import type * as _A from '../node_modules/hono/dist/types/context'
import { appRouter } from './router'
import { handleAuthWebhookRequest } from '@api/features/auth/webhook'
import { handleBillingWebhookRequest } from '@api/features/billing/webhook'
import type { ContextWithRequest } from '@api/lib/context'
import { createContextWithRequest } from '@api/lib/context'
import { type Env, envSchema } from '@api/lib/env'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Variables = {
  contextWithRequest: ContextWithRequest
}

const app = new Hono<{ Variables: Variables; Bindings: Env }>()
  .use('*', cors())
  .use('*', async (c, next) => {
    // VALIDATE ENV FOR ENSURE
    const env = envSchema.parse(c.env)
    const contextWithRequest = await createContextWithRequest({
      env,
      ec: c.executionCtx,
      request: c.req.raw,
    })

    c.set('contextWithRequest', contextWithRequest)

    await next()

    c.executionCtx.waitUntil(contextWithRequest.ph.shutdownAsync())
  })
  .all('/trpc/*', async (c) => {
    return await fetchRequestHandler({
      endpoint: '/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext: () => c.get('contextWithRequest'),
      onError({ error }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') console.error(error)
      },
    })
  })
  .post('/billing/webhook', async (c) => {
    return await handleBillingWebhookRequest(c.get('contextWithRequest'))
  })
  .post('/auth/webhook', async (c) => {
    return await handleAuthWebhookRequest(c.get('contextWithRequest'))
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
