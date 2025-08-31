const { PrismaClient } = require('@prisma/client');

let prisma = null;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db_test';
  
  prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
  } catch (error) {
    console.warn('Database connection failed in tests, some tests may fail');
  }
});

beforeEach(async () => {
  if (prisma) {
    try {
      await prisma.requestLog.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (error) {
      console.warn('Failed to clean test database');
    }
  }
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

global.testPrisma = prisma;