import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './database/migrations',
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
  tablesFilter: ['dinstack_*'],
  strict: true,
  verbose: true,
} satisfies Config
