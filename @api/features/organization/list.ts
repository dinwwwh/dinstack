import { authProcedure } from '@api/core/trpc'
import { OrganizationMembers } from '@api/database/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationListRoute = authProcedure
  .input(
    z.object({
      limit: z.number().int().positive().max(20).default(10),
      cursor: z.number().int().nonnegative().default(0),
    }),
  )
  .query(async ({ ctx, input }) => {
    const items = await ctx.db.query.Organizations.findMany({
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
      where(t, { exists }) {
        return exists(
          ctx.db
            .select()
            .from(OrganizationMembers)
            .where(
              and(
                eq(t.id, OrganizationMembers.organizationId),
                eq(OrganizationMembers.userId, ctx.auth.userId),
              ),
            ),
        )
      },
      offset: input.cursor,
      limit: input.limit,
    })

    return {
      items,
      nextCursor: items.length < input.limit ? null : input.cursor + input.limit,
    }
  })
