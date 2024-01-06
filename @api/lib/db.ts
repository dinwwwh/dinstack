import * as schema from '../database/schema'
import type { Env } from './env'
import { neon, neonConfig } from '@neondatabase/serverless'
import type { LogWriter } from 'drizzle-orm/logger'
import { DefaultLogger } from 'drizzle-orm/logger'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { withReplicas } from 'drizzle-orm/pg-core'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

neonConfig.fetchConnectionCache = true

class MyLogWriter implements LogWriter {
  write(message: string) {
    // eslint-disable-next-line no-console
    console.info('------------------------')
    // eslint-disable-next-line no-console
    console.info(message)
  }
}

const logger = new DefaultLogger({ writer: new MyLogWriter() })

export function createDb({ env }: { env: Env }) {
  const write = drizzlePostgres(postgres(env.DATABASE_URL), {
    schema,
    logger: env.WORKER_ENV === 'development' ? logger : false,
  })
  const read = drizzleNeon(neon(env.DATABASE_URL), {
    schema,
    logger: env.WORKER_ENV === 'development' ? logger : false,
  })

  // @ts-expect-error TODO: fix type for withReplicas
  return withReplicas(write, [read])
}

export type Db = ReturnType<typeof createDb>
