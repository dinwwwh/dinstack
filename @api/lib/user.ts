import { subscriptionSchema } from './subscription'
import { z } from 'zod'

export const userPublicMetadataSchema = z.object({
  subscriptions: z.array(subscriptionSchema).catch([]),
})
