import { procedure, router } from './trpc'
import { billingRouter } from '@api/features/billing/router'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  ping: procedure.query(() => 'pong'),
  pingMutation: procedure.mutation(() => 'pong'),
  billing: billingRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
