import type { Env } from './env'
import { createDb } from './lib/db'

export function createContext({ env, ec, request }: { env: Env; ec: ExecutionContext; request?: Request }) {
  const db = createDb({ env })

  return {
    env,
    ec,
    db,
    request,
  }
}

export type Context = ReturnType<typeof createContext>
