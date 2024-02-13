import type { ContextWithRequest } from '@api/lib/context'
import type { WebhookEvent } from '@clerk/backend'

export async function handleAuthWebhookRequest(ctx: ContextWithRequest) {
  const event = ctx.clerkWebhook.verify(
    await ctx.request.text(),
    Object.fromEntries(ctx.request.headers.entries()),
  ) as WebhookEvent

  if (event.type === 'user.created' || event.type === 'user.updated') {
    await ctx.knock.users.identify(event.data.id, {
      email: event.data.email_addresses.find((e) => e.id === event.data.primary_email_address_id)
        ?.email_address,
      name: `${event.data.first_name} ${event.data.last_name}`,
      avatar: event.data.image_url,
    })
  }

  if (event.type === 'user.deleted' && event.data.id) {
    await ctx.knock.users.delete(event.data.id)
  }

  return new Response()
}
