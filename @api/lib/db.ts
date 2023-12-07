import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { withReplicas } from 'drizzle-orm/pg-core'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'
import type { Env } from '../env'

neonConfig.fetchConnectionCache = true

export function createDb({ env }: { env: Env }) {
  const write = drizzlePostgres(postgres(env.DATABASE_URL), {
    schema,
    logger: env.WORKER_ENV === 'development',
  })
  const read = drizzleNeon(neon(env.DATABASE_URL), { schema, logger: env.WORKER_ENV === 'development' })

  // @ts-expect-error TODO: fix type for withReplicas
  return withReplicas(write, [read])
}
