import { OrganizationMembers } from '@api/database/schema'
import { authedProcedure } from '@api/trpc'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationListRoute = authedProcedure
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
              and(eq(t.id, OrganizationMembers.organizationId), eq(OrganizationMembers.userId, ctx.session.userId)),
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
