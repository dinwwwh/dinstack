import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { authRouter } from './routes/auth'
import { organizationRouter } from './routes/organization'
import { procedure, router } from './trpc'

export const appRouter = router({
  ping: procedure.query(() => 'pong'),
  auth: authRouter,
  organization: organizationRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
