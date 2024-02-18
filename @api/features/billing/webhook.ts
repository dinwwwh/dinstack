import type { ContextWithRequest } from '@api/lib/context'
import { verifyWebhookRequest } from '@api/lib/lemon-squeezy'
import { organizationPublicMetadataSchema } from '@api/lib/organization'
import { userPublicMetadataSchema } from '@api/lib/user'
import { P, match } from 'ts-pattern'
import { z } from 'zod'

export async function handleBillingWebhookRequest(ctx: ContextWithRequest) {
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
          tenant_id: z.string(),
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
      const expiresAt = match(e.data.attributes.status)
        .with('failed', () => new Date())
        .with('pending', () => new Date())
        .with('refunded', () => new Date())
        .with('paid', () => null)
        .exhaustive()
      const tenantId = e.meta.custom_data.tenant_id
      const variantId = e.data.attributes.first_order_item.variant_id
      const lsCustomerId = e.data.attributes.customer_id

      const updateMetadata = (
        publicMetadata:
          | z.infer<typeof userPublicMetadataSchema>
          | z.infer<typeof organizationPublicMetadataSchema>,
      ) => {
        const index = publicMetadata.subscriptions.findIndex((s) => s.variantId === variantId)

        if (index === -1) {
          publicMetadata.subscriptions.push({
            variantId,
            lsCustomerId,
            createdAt: new Date(),
            expiresAt,
          })
        } else {
          publicMetadata.subscriptions[index] = {
            variantId,
            lsCustomerId,
            createdAt: new Date(),
            expiresAt,
          }
        }
      }

      if (tenantId.startsWith('user_')) {
        const user = await ctx.clerk.users.getUser(tenantId)
        const publicMetadata = userPublicMetadataSchema.parse(user.publicMetadata)

        updateMetadata(publicMetadata)

        await ctx.clerk.users.updateUserMetadata(tenantId, {
          publicMetadata,
        })
      } else {
        const org = await ctx.clerk.organizations.getOrganization({ organizationId: tenantId })
        const publicMetadata = organizationPublicMetadataSchema.parse(org.publicMetadata)

        updateMetadata(publicMetadata)

        await ctx.clerk.organizations.updateOrganizationMetadata(tenantId, {
          publicMetadata,
        })
      }
    })
    .exhaustive()

  return new Response('Successfully', { status: 200 })
}
