import { sql } from 'drizzle-orm'
import { mysqlTableCreator, timestamp, serial, varchar } from 'drizzle-orm/mysql-core'

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 * @see https://orm.drizzle.team/kit-docs/conf#multi-project-schema
 */
const mysqlTable = mysqlTableCreator((name) => `dinstack_${name}`)

export const Users = mysqlTable('users', {
  id: serial('id'),
  name: varchar('name', { length: 255 }),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})
