import { procedure, router } from './trpc'
import { billingRouter } from '@api/features/billing/router'
import { notificationRouter } from '@api/features/notification/router'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  ping: procedure.query(() => 'pong:' + Date.now()),
  pingMutation: procedure.mutation(async () => {
    await new Promise((r) => {
      setTimeout(r, 2_000)
    })

    return 'pong:' + Date.now()
  }),
  billing: billingRouter,
  notification: notificationRouter,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
