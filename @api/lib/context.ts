import { createAuthGithub, createAuthGoogle } from './auth'
import { createDb } from './db'
import { createSendEmailFn } from './email'
import type { Env } from './env'
import { createLemonSqueezy } from './lemon-squeezy'

export function createContext({ env, ec }: { env: Env; ec: ExecutionContext }) {
  const db = createDb({ env })
  const authGoogle = createAuthGoogle({ env })
  const authGithub = createAuthGithub({ env })
  const sendEmail = createSendEmailFn({ env })
  const lemonSqueezy = createLemonSqueezy({ env })

  return {
    env,
    ec,
    db,
    lemonSqueezy,
    email: {
      send: sendEmail,
    },
    auth: {
      google: authGoogle,
      github: authGithub,
    },
  }
}

export type Context = ReturnType<typeof createContext>
