import {
  createAuthGithub,
  createAuthGoogle,
  createCreateAuthJwtFn,
  createValidateAuthJwtFn,
} from './auth'
import { createDb } from './db'
import { createSendEmailFn } from './email'
import type { Env } from './env'
import { createLemonSqueezy } from './ls'

export function createContext({
  env,
  ec,
  request,
}: {
  env: Env
  ec: ExecutionContext
  request?: Request
}) {
  const db = createDb({ env })
  const createAuthJwt = createCreateAuthJwtFn({ env })
  const validateAuthJwt = createValidateAuthJwtFn({ env })
  const authGoogle = createAuthGoogle({ env })
  const authGithub = createAuthGithub({ env })
  const sendEmail = createSendEmailFn({ env })
  const lemonSqueezy = createLemonSqueezy({ lemonsqueezyApiKey: env.LEMONSQUEEZY_API_KEY })

  return {
    env,
    ec,
    db,
    request,
    lemonSqueezy,
    email: {
      send: sendEmail,
    },
    auth: {
      google: authGoogle,
      github: authGithub,
      createJwt: createAuthJwt,
      validateJwt: validateAuthJwt,
    },
  }
}

export type Context = ReturnType<typeof createContext>
