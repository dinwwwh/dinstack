import type { Context } from '@api/lib/context'
import { verifyWebhookRequest } from '@api/lib/lemon-squeezy'
import { P, match } from 'ts-pattern'
import { z } from 'zod'

export async function handleWebhookRequest(ctx: Context & { request: Request }) {
  const isValidRequest = await verifyWebhookRequest({ env: ctx.env, request: ctx.request })
  if (!isValidRequest) {
    return new Response('Invalid request', {
      status: 400,
    })
  }

  const event = z
    .object({
      meta: z.object({
        event_name: z.enum(['order_created', 'order_refunded']),
        custom_data: z.object({
          user_id: z.string().uuid(),
        }),
      }),
      data: z.object({
        type: z.literal('orders'),
        id: z.coerce.number(),
        attributes: z.object({
          status: z.enum(['pending', 'failed', 'paid', 'refunded']),
          customer_id: z.number(),
          first_order_item: z.object({
            variant_id: z.number(),
          }),
        }),
      }),
    })
    .parse(await ctx.request.json())

  await match(event)
    .with({ meta: { event_name: P.union('order_created', 'order_refunded') } }, async (e) => {
      if (
        e.data.attributes.first_order_item.variant_id !==
        ctx.env.LEMONSQUEEZY_LIFETIME_MEMBERSHIP_VARIANT_ID
      ) {
        throw new Error('Not allow variant_id')
      }

      const expiresAt = match(e.data.attributes.status)
        .with('failed', () => new Date())
        .with('pending', () => new Date())
        .with('refunded', () => new Date())
        .with('paid', () => null)
        .exhaustive()

      // TODO
      // await ctx.db
      //   .insert(Subscriptions)
      //   .values({
      //     userId: e.meta.custom_data.user_id,
      //     variantId: e.data.attributes.first_order_item.variant_id,
      //     lsCustomerId: e.data.attributes.customer_id,
      //     expiresAt,
      //   })
      //   .onConflictDoUpdate({
      //     target: [Subscriptions.variantId, Subscriptions.userId],
      //     set: {
      //       lsCustomerId: e.data.attributes.customer_id,
      //       expiresAt,
      //     },
      //   })
    })
    .exhaustive()

  return new Response('Successfully', { status: 200 })
}
