import { Users } from '+db/schema'
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
          name: z
            .string()
            .max(1234)
            .transform((name) => name.replace(/[^a-zA-Z0-9.-_]/gi, '-')),
          base64: z
            .string()
            .max(1024 * 1024) // 1 MB
            .transform((base64) => {
              return Buffer.from(base64, 'base64')
            }),
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

      const objectName = `user/${ctx.auth.session.userId}/avatar/${input.avatar.name}`
      const deleteOldAvatar = ctx.env.PUBLIC_BUCKET.delete(user.avatarUrl)
      const uploadNewAvatar = ctx.env.PUBLIC_BUCKET.put(objectName, input.avatar.base64)
      const updateAvatarUrl = ctx.db
        .update(Users)
        .set({
          avatarUrl: objectName,
        })
        .where(eq(Users.id, ctx.auth.session.userId))

      await Promise.all([deleteOldAvatar, uploadNewAvatar, updateAvatarUrl])
    }),
})
