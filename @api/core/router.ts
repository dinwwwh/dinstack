import { procedure, router } from './trpc'
import { authRouter } from '@api/features/auth/router'
import { billingRouter } from '@api/features/billing/router'
import { organizationRouter } from '@api/features/organization/router'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  ping: procedure.query(() => 'pong'),
  auth: authRouter,
  organization: organizationRouter,
  billing: billingRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
