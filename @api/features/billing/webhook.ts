import type { Context } from '@api/lib/context'
import { verifyWebhookRequest } from '@api/lib/lemon-squeezy'
import { z } from 'zod'

export async function handleWebhookRequest(ctx: Context & { request: Request }) {
  const isValidRequest = await verifyWebhookRequest({ env: ctx.env, request: ctx.request })
  if (!isValidRequest) {
    return new Response('Invalid request', {
      status: 400,
    })
  }

  const _data = z
    .object({
      meta: z.object({
        event_name: z.enum(['order_created']),
      }),
      data: z.object({
        type: z.literal('orders'),
        id: z.coerce.number(),
        attributes: z.object({}),
      }),
    })
    .parse(await ctx.request.json())
}
