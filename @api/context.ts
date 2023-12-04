import type { Env } from './env'
import { createAuthGithub, createCreateAuthJwtFn, createValidateAuthJwtFn } from './lib/auth'
import { createDb } from './lib/db'

export function createContext({ env, ec, request }: { env: Env; ec: ExecutionContext; request?: Request }) {
  const db = createDb({ env })
  const createAuthJwt = createCreateAuthJwtFn({ env })
  const validateAuthJwt = createValidateAuthJwtFn({ env })
  const authGithub = createAuthGithub({ env })

  return {
    env,
    ec,
    db,
    authGithub,
    request,
    createAuthJwt,
    validateAuthJwt,
  }
}

export type Context = ReturnType<typeof createContext>
