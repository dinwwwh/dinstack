import { createDb } from './db'
import { createSendEmailFn } from './email'
import type { Env } from './env'
import { createLemonSqueezy } from './lemon-squeezy'
import { createPostHog } from './post-hog'
import { Clerk } from '@clerk/backend'

export function createContext({ env, ec }: { env: Env; ec: ExecutionContext }) {
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

export type Context = ReturnType<typeof createContext>
