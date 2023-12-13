import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  primaryKey,
  pgEnum,
  char,
  jsonb,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core'
import { alphabet, generateRandomString } from 'oslo/random'

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

export const oauthAccountProviders = pgEnum('oauth_account_providers', ['github', 'google'])

export const OauthAccounts = pgTable(
  'oauth_accounts',
  {
    provider: oauthAccountProviders('provider').notNull(),
    providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerUserId] }),
    pu: unique().on(t.provider, t.userId),
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
    pk: primaryKey({ columns: [t.userId, t.organizationId] }),
  }),
)

export const OrganizationMemberRelations = relations(OrganizationMembers, ({ one, many }) => ({
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
  sessions: many(Sessions),
}))

export const Sessions = pgTable(
  'sessions',
  {
    id: char('id', { length: 64 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateRandomString(64, alphabet('a-z', 'A-Z', '0-9'))),
    userId: uuid('user_id').notNull(),
    organizationId: uuid('organization_id').notNull(),
    headers: jsonb('headers').notNull().$type<Record<string, string>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pfk: foreignKey({
      columns: [t.userId, t.organizationId],
      foreignColumns: [OrganizationMembers.userId, OrganizationMembers.organizationId],
      name: 'sessions_user_id_organization_id_fkey',
    }),
  }),
)

export const SessionRelations = relations(Sessions, ({ one }) => ({
  organizationMember: one(OrganizationMembers, {
    fields: [Sessions.userId, Sessions.organizationId],
    references: [OrganizationMembers.userId, OrganizationMembers.organizationId],
  }),
}))
