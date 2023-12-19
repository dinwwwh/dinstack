import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { authRouter } from './services/auth/router'
import { organizationRouter } from './services/organization/router'
import { procedure, router } from './trpc'

export const appRouter = router({
  ping: procedure.query(() => 'pong'),
  auth: authRouter,
  organization: organizationRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
