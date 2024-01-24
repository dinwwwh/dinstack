import { pushSubscriptionSchema } from '@api/database/schema'
import { env } from '@web/lib/env'
import { onWindowMessage, postMessageToWindow } from '@web/lib/message/sw'
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

onWindowMessage('subscribePushNotification', async () => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.VAPID_PUBLIC_KEY,
  })

  postMessageToWindow('handlePushSubscription', {
    subscription: pushSubscriptionSchema.parse(subscription.toJSON()),
  })
})

// TODO: implement it
self.addEventListener('push', () => {
  self.registration.showNotification('Whoooo!', { body: 'body' })
})
