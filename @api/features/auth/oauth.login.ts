import { oauthAccountSchema } from '@api/database/schema'
import { createUser } from '@api/lib/db'
import { procedure } from '@api/trpc'
import { uppercaseFirstLetter } from '@shared/utils/uppercase-first-letter'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSession } from './helpers/create-session'
import { findSessionForAuth } from './helpers/find-session-for-auth'
import { getOauthUser } from './helpers/get-oauth-user'

export const authOauthLoginRoute = procedure
  .input(
    z.object({
      provider: oauthAccountSchema.shape.provider,
      code: z.string(),
      codeVerifier: z.string(),
      state: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const oauthUser = await getOauthUser({
      ...input,
      ctx,
    })

    const oauthAccount = await ctx.db.query.OauthAccounts.findFirst({
      with: {
        organizationMembers: {
          with: {
            organization: true,
          },
          limit: 1,
        },
      },
      where(t, { eq, and }) {
        return and(eq(t.provider, input.provider), eq(t.providerUserId, oauthUser.id))
      },
    })

    if (oauthAccount) {
      const organizationMember = oauthAccount.organizationMembers[0]
      if (!organizationMember) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find organization member' })
      }

      const sessionSecretKey = (await createSession({ ctx, organizationMember })).secretKey

      const session = await findSessionForAuth({ ctx, sessionSecretKey })

      return {
        session,
      }
    }

    const userByEmail = await ctx.db.query.Users.findFirst({
      where(t, { eq }) {
        return eq(t.email, oauthUser.email)
      },
    })

    if (userByEmail) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Please login with your email and link to your ${uppercaseFirstLetter(input.provider)} account first`,
      })
    }

    const { organizationMember } = await createUser({
      db: ctx.db,
      user: {
        name: oauthUser.name,
        avatarUrl: oauthUser.avatarUrl,
        email: oauthUser.email,
      },
      oauth: {
        provider: input.provider,
        providerUserId: oauthUser.id,
        identifier: oauthUser.identifier,
      },
    })

    const sessionSecretKey = (await createSession({ ctx, organizationMember })).secretKey

    const session = await findSessionForAuth({ ctx, sessionSecretKey })

    return {
      session,
    }
  })
