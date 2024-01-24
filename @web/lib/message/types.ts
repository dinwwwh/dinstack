import type { pushSubscriptionSchema } from '@api/database/schema'
import type { z } from 'zod'

export type MessageDir = {
  handlePushSubscription: {
    subscription: z.infer<typeof pushSubscriptionSchema>
  }
  subscribePushNotification: {
    //
  }
}
