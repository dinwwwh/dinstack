import { subscriptionSchema } from './subscription'
import { z } from 'zod'

export const organizationPublicMetadataSchema = z.object({
  subscriptions: z.array(subscriptionSchema).catch([]),
})
