import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_AUTH_TOKEN
    const databaseUrl = process.env.DATABASE_URL

  console.log("=== DB.TS INITIALIZATION ===");
    console.log("TURSO_DATABASE_URL:", tursoUrl);
    console.log("TURSO_AUTH_TOKEN:", tursoToken ? "PRESENT" : "MISSING");
    console.log("DATABASE_URL:", databaseUrl);
    console.log("============================");

  if (tursoUrl && tursoUrl !== 'undefined') {
        console.log("Using Turso (libSQL) adapter...");
        const { PrismaLibSql } = require('@prisma/adapter-libsql')
        const { createClient } = require('@libsql/client')
        const libsql = createClient({
                url: tursoUrl,
                authToken: tursoToken,
        })
        const adapter = new PrismaLibSql(libsql)
        return new PrismaClient({
                datasourceUrl: tursoUrl,
                adapter,
        } as any)
  }

  console.log("Using fallback local SQLite client...");
    return new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
