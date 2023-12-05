import { relations, sql } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'
import { citext } from './extend'

export const Users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: citext('email').notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 2550 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const UserRelations = relations(Users, () => ({}))
