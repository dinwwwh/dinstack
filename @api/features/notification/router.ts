import { notificationTestRoute } from './test'
import { router } from '@api/core/trpc'

export const notificationRouter = router({
  test: notificationTestRoute,
})
