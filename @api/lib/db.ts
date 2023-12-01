import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../database/schema'
import type { Env } from '../env'

neonConfig.fetchConnectionCache = true

export function createDb({ env }: { env: Env }) {
  const sql = neon(env.DATABASE_URL)
  return drizzle(sql, { schema, logger: env.WORKER_ENV === 'development' })
}
