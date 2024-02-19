import * as schema from '../database/schema'
import type { Env } from './env'
import { connect } from '@planetscale/database'
import type { LogWriter } from 'drizzle-orm/logger'
import { DefaultLogger } from 'drizzle-orm/logger'
import { withReplicas } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

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
  const dbConnection = connect({
    url: env.DATABASE_URL,
    fetch: (opts, init) => {
      delete init?.cache
      return fetch(opts, init)
    },
  })

  const write = drizzle(dbConnection, {
    schema,
    logger: env.WORKER_ENV === 'development' ? logger : false,
  })

  return withReplicas(write, [write])
}

export type Db = ReturnType<typeof createDb>
