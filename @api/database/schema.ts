import { pgTable, timestamp, serial } from 'drizzle-orm/pg-core'

export const Tests = pgTable('tests', {
  id: serial('id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
