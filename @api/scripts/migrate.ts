import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { resolve } from 'node:path'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env var is required')
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: true })
const db = drizzle(sql)

migrate(db, { migrationsFolder: resolve(__dirname, '../database/migrations') }).then(() => {
  sql.end()
})
