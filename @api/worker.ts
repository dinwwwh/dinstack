/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { createContext } from './context'
import { envSchema } from './env'
import { appRouter } from './router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export default {
  async fetch(request: Request, unvalidatedEnv: unknown, ec: ExecutionContext) {
    const env = envSchema.parse(unvalidatedEnv)
    const context = createContext({ env, ec, request })
    const url = new URL(request.url)

    let response: Response | undefined

    if (request.method === 'OPTIONS') response = new Response()

    if (!response && url.pathname.startsWith('/trpc')) {
      response = await fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: appRouter,
        createContext: () => ({ ...context, request }),
        onError({ error }) {
          if (error.code === 'INTERNAL_SERVER_ERROR') console.error(error)
        },
      })
    }

    if (!response && url.pathname.startsWith('/public') && request.method.toUpperCase() === 'GET') {
      const objectName = url.pathname.replace('/public/', '')
      const object = await env.PUBLIC_BUCKET.get(objectName)

      if (object) {
        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)

        return new Response(object.body, {
          headers,
        })
      }
    }

    response ??= new Response(
      JSON.stringify({
        message: 'Not found',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    try {
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', '*')
      response.headers.set('Access-Control-Allow-Headers', '*')
      response.headers.set('Access-Control-Max-Age', '86400')
    } catch (e) {
      /* empty */
    }

    return response
  },
}
