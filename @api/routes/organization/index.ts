import { router } from '@api/trpc'
import { organizationCreateRoute } from './create'
import { organizationDetailRoute } from './detail'
import { organizationListRoute } from './list'

export const organizationRouter = router({
  list: organizationListRoute,
  detail: organizationDetailRoute,
  create: organizationCreateRoute,
})
