import { authenticateRequestToAuth } from './auth'
import { createDb } from './db'
import type { Env } from './env'
import { createLemonSqueezy } from './lemon-squeezy'
import { createPostHog } from './post-hog'
import { authToTenant } from './tenant'
import { Clerk } from '@clerk/backend'
import { Knock } from '@knocklabs/node'

export async function createContextWithoutRequest({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = createDb({ env })
  const lemonSqueezy = createLemonSqueezy({ env })
  const ph = createPostHog({ env })
  const clerk = Clerk({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  })
  const knock = new Knock(env.KNOCK_API_KEY)

  return {
    env,
    ec,
    db,
    lemonSqueezy,
    ph,
    clerk,
    knock,
  }
}

export async function createContextWithRequest({
  env,
  ec,
  request,
}: {
  env: Env
  ec: ExecutionContext
  request: Request
}) {
  const contextWithoutRequest = await createContextWithoutRequest({ env, ec })
  const auth = await authenticateRequestToAuth({ ctx: contextWithoutRequest, request })

  if (!auth) {
    return {
      ...contextWithoutRequest,
      request,
      auth: null,
      tenant: null,
    }
  }

  const tenant = await authToTenant({ auth })

  return {
    ...contextWithoutRequest,
    request,
    auth,
    tenant,
  }
}

export type ContextWithoutRequest = Awaited<ReturnType<typeof createContextWithoutRequest>>
export type ContextWithRequest = Awaited<ReturnType<typeof createContextWithRequest>>
