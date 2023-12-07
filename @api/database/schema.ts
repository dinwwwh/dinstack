import { relations, sql } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 2550 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const UserRelations = relations(Users, ({ one, many }) => ({
  OauthAccountRelations: many(OauthAccounts),
  loginOtp: one(UserLoginOtps, {
    fields: [Users.id],
    references: [UserLoginOtps.userId],
  }),
}))

export const OauthAccounts = pgTable(
  'oauth_accounts',
  {
    provider: varchar('provider', { length: 255 }).notNull().$type<'github' | 'google'>(),
    providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerUserId] }),
  }),
)

export const OauthAccountRelations = relations(OauthAccounts, ({ one }) => ({
  user: one(Users, {
    fields: [OauthAccounts.userId],
    references: [Users.id],
  }),
}))

export const UserLoginOtps = pgTable('user_login_otps', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => Users.id),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expired_at')
    .notNull()
    .$default(() => new Date(Date.now() + 1000 * 60 * 5)),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const UserLoginOtpRelations = relations(UserLoginOtps, ({ one }) => ({
  user: one(Users, {
    fields: [UserLoginOtps.userId],
    references: [Users.id],
  }),
}))
