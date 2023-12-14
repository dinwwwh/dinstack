import { Users } from '@api/database/schema'
import { authProcedure, router } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { Buffer } from 'node:buffer'
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
  updateAvatarUrl: authProcedure
    .input(
      z.object({
        avatar: z.object({
          name: z.string().max(2550),
          base64: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.id, ctx.auth.session.userId)
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        })
      }

      await ctx.env.PUBLIC_BUCKET.delete(user.avatarUrl)

      const objectName = `user/${ctx.auth.session.userId}/avatar/${Buffer.from(input.avatar.name).toString(
        'base64',
      )}.${input.avatar.name.split('.').pop()!}`
      await ctx.env.PUBLIC_BUCKET.put(objectName, Buffer.from(input.avatar.base64, 'base64'))

      await ctx.db
        .update(Users)
        .set({
          avatarUrl: objectName,
        })
        .where(eq(Users.id, ctx.auth.session.userId))
    }),
})
