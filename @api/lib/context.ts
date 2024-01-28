import { authenticateRequestToAuth } from './auth'
import { createDb } from './db'
import { createSendEmailFn } from './email'
import type { Env } from './env'
import { createLemonSqueezy } from './lemon-squeezy'
import { createPostHog } from './post-hog'
import { authToTenant } from './tenant'
import { Clerk } from '@clerk/backend'

export async function createContextWithoutRequest({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = createDb({ env })
  const sendEmail = createSendEmailFn({ env })
  const lemonSqueezy = createLemonSqueezy({ env })
  const ph = createPostHog({ env })
  const clerk = Clerk({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  })

  return {
    env,
    ec,
    db,
    lemonSqueezy,
    ph,
    clerk,
    email: {
      send: sendEmail,
    },
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
