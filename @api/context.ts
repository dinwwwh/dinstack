import type { Env } from './env'
import { createAuthGoogle, createCreateAuthJwtFn, createValidateAuthJwtFn } from './lib/auth'
import { createDb } from './lib/db'

export function createContext({ env, ec, request }: { env: Env; ec: ExecutionContext; request?: Request }) {
  const db = createDb({ env })
  const createAuthJwt = createCreateAuthJwtFn({ env })
  const validateAuthJwt = createValidateAuthJwtFn({ env })
  const authGoogle = createAuthGoogle({ env })

  return {
    env,
    ec,
    db,
    request,
    auth: {
      google: authGoogle,
      createJwt: createAuthJwt,
      validateJwt: validateAuthJwt,
    },
  }
}

export type Context = ReturnType<typeof createContext>
