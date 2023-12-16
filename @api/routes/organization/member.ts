import { authProcedure, organizationAdminMiddleware, router } from '@api/trpc'
import { z } from 'zod'

export const organizationMemberRouter = router({
  invite: authProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        email: z.string().email(),
      }),
    )
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
    }),
  remove: authProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .use(organizationAdminMiddleware)
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
    }),
})
