import { createDefaultOrganization } from './helpers/create-default-organization'
import { createSession } from './helpers/create-session'
import { createUser } from './helpers/create-user'
import { getActiveSubscriptionVariantIds } from './helpers/filter-and-map-active-subscription-variant-ids'
import { getOauthUser } from './helpers/get-oauth-user'
import { procedure } from '@api/core/trpc'
import { oauthAccountSchema } from '@api/database/schema'
import { signAuthJwt } from '@api/lib/auth'
import { uppercaseFirstLetter } from '@api/lib/utils'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

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
        user: {
          with: {
            organizationMembers: {
              with: {
                organization: {
                  with: {
                    members: true,
                  },
                },
              },
              limit: 1,
            },
            subscriptions: true,
          },
        },
      },
      where(t, { eq, and }) {
        return and(eq(t.provider, input.provider), eq(t.providerUserId, oauthUser.id))
      },
    })

    if (oauthAccount) {
      const organizationMember = await (async () => {
        if (oauthAccount.user.organizationMembers[0])
          return oauthAccount.user.organizationMembers[0]

        const { organization, organizationMember } = await createDefaultOrganization({
          db: ctx.db,
          userId: oauthAccount.user.id,
        })

        return {
          ...organizationMember,
          organization: {
            ...organization,
            members: [organizationMember],
          },
        }
      })()

      const session = await createSession({ ctx, organizationMember })
      const jwt = await signAuthJwt({
        env: ctx.env,
        payload: {
          sessionSecretKey: session.secretKey,
          userId: oauthAccount.user.id,
          organizationId: organizationMember.organizationId,
          organizationRole: organizationMember.role,
          activeSubscriptionVariantIds: getActiveSubscriptionVariantIds(
            oauthAccount.user.subscriptions,
          ),
        },
      })

      return {
        auth: {
          jwt,
          session,
          user: oauthAccount.user,
          organization: organizationMember.organization,
          organizationMember,
        },
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
        message: `Please login with your email and link to your ${uppercaseFirstLetter(
          input.provider,
        )} account first`,
      })
    }

    const { user } = await createUser({
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

    const { organization, organizationMember } = await createDefaultOrganization({
      db: ctx.db,
      userId: user.id,
    })

    const session = await createSession({ ctx, organizationMember })
    const jwt = await signAuthJwt({
      env: ctx.env,
      payload: {
        sessionSecretKey: session.secretKey,
        userId: user.id,
        organizationId: organizationMember.organizationId,
        organizationRole: organizationMember.role,
        activeSubscriptionVariantIds: [],
      },
    })

    return {
      auth: {
        jwt,
        session,
        user: {
          ...user,
          subscriptions: [],
        },
        organization: {
          ...organization,
          members: [organizationMember],
        },
        organizationMember,
      },
    }
  })
