import { billingCheckoutRoute } from './checkout'
import { router } from '@api/core/trpc'

export const billingRouter = router({
  checkout: billingCheckoutRoute,
})
