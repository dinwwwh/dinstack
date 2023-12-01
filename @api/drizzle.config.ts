import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema/index.ts',
  out: './database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
