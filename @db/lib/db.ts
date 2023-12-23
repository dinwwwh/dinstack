import * as schema from '../schema'
import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { withReplicas } from 'drizzle-orm/pg-core'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

neonConfig.fetchConnectionCache = true

export function createDb(options: { logger?: boolean; databaseUrl: string }) {
  const write = drizzlePostgres(postgres(options.databaseUrl), {
    schema,
    logger: options.logger,
  })
  const read = drizzleNeon(neon(options.databaseUrl), {
    schema,
    logger: options.logger,
  })

  // @ts-expect-error TODO: fix type for withReplicas
  return withReplicas(write, [read])
}

export type Db = ReturnType<typeof createDb>
