import { Organizations, organizationSelectSchema } from '@api/database/schema'
import { authProcedure, organizationMemberMiddleware } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { Buffer } from 'node:buffer'
import { z } from 'zod'

export const organizationChangeLogoRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationSelectSchema.shape.id,
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
  .use(organizationMemberMiddleware)
  .mutation(async ({ ctx, input }) => {
    const organization = await ctx.db.query.Organizations.findFirst({
      where(t, { eq }) {
        return eq(t.id, input.organizationId)
      },
    })

    if (!organization) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Organization not found',
      })
    }

    const objectName = `organization/${input.organizationId}/logo/${input.avatar.name}`
    const deleteOldLogo = ctx.env.PUBLIC_BUCKET.delete(organization.logoUrl)
    const uploadNewLogo = ctx.env.PUBLIC_BUCKET.put(objectName, input.avatar.base64)
    const updateLogoUrl = ctx.db
      .update(Organizations)
      .set({
        logoUrl: objectName,
      })
      .where(eq(Organizations.id, input.organizationId))

    await Promise.all([deleteOldLogo, uploadNewLogo, updateLogoUrl])
  })
