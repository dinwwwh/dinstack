import { relations, sql } from 'drizzle-orm'
import { pgTable, varchar, timestamp, uuid, primaryKey, pgEnum } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 2550 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const UserRelations = relations(Users, ({ many }) => ({
  oauthAccounts: many(OauthAccounts),
  organizationMembers: many(OrganizationMembers),
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

export const OauthAccountRelations = relations(OauthAccounts, ({ one, many }) => ({
  user: one(Users, {
    fields: [OauthAccounts.userId],
    references: [Users.id],
  }),
  organizationMembers: many(OrganizationMembers),
}))

export const EmailOtps = pgTable('email_otps', {
  email: varchar('email', { length: 255 }).notNull().primaryKey(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expired_at')
    .notNull()
    .$default(() => new Date(Date.now() + 1000 * 60 * 5)),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const Organizations = pgTable('organizations', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: varchar('logo_url', { length: 2550 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const OrganizationRelations = relations(Organizations, ({ many }) => ({
  members: many(OrganizationMembers),
}))

export const organizationMembersRoles = pgEnum('organization_member_roles', ['admin', 'member'])

export const OrganizationMembers = pgTable(
  'organization_members',
  {
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => Organizations.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id),
    role: organizationMembersRoles('role').notNull().default('member'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.organizationId, t.userId] }),
  }),
)

export const OrganizationMemberRelations = relations(OrganizationMembers, ({ one }) => ({
  organization: one(Organizations, {
    fields: [OrganizationMembers.organizationId],
    references: [Organizations.id],
  }),
  user: one(Users, {
    fields: [OrganizationMembers.userId],
    references: [Users.id],
  }),
  _oauthAccount: one(OauthAccounts, {
    fields: [OrganizationMembers.userId],
    references: [OauthAccounts.userId],
  }),
}))
