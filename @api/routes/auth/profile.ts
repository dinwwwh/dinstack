import { Users } from '@api/database/schema'
import { authProcedure, router } from '@api/trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const authProfileRouter = router({
  update: authProcedure
    .input(
      z.object({
        user: z.object({
          name: z.string().min(3).max(255).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(Users)
        .set({
          name: input.user.name,
        })
        .where(eq(Users.id, ctx.auth.session.userId))
    }),
})
