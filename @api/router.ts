import { authRouter } from './features/auth/router'
import { organizationRouter } from './features/organization/router'
import { procedure, router } from './trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  ping: procedure.query(() => 'pong'),
  auth: authRouter,
  organization: organizationRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
