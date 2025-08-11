import { PrismaClient } from '@prisma/client'

// Test database setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
    }
  }
})

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect()
})

// Clean up after each test
afterEach(async () => {
  // Clean up database between tests
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `
  
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
    }
  }
})

// Global test teardown
afterAll(async () => {
  await prisma.$disconnect()
})

export { prisma }