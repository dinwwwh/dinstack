import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  ping: publicProcedure.query(() => 'pong'),
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
