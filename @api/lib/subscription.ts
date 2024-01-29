import { z } from 'zod'

export const subscriptionSchema = z.object({
  variantId: z.number(),
  lsCustomerId: z.number(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date().nullable(),
})

export type Subscription = z.infer<typeof subscriptionSchema>
