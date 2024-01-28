import { z } from 'zod'

export const subscriptionSchema = z.object({
  variantId: z.number(),
  lsCustomerId: z.number(),
  expiresAt: z.coerce.date().nullable(),
})
