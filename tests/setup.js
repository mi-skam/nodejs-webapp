const { getPrismaClient } = require('../src/utils/database');

let prisma = null;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db_test';
  
  // Use the same singleton instance as the application
  prisma = getPrismaClient();
  
  try {
    await prisma.$connect();
  } catch (error) {
    process.stderr.write('Database connection failed in tests, some tests may fail\n');
  }
});

beforeEach(async () => {
  if (prisma) {
    try {
      // Clean up test data between tests
      await prisma.user.deleteMany({});
      await prisma.requestLog.deleteMany({});
    } catch (error) {
      process.stderr.write('Failed to clean test database\n');
    }
  }
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
    // Reset the singleton so it can be recreated with new config if needed
    require('../src/utils/database').resetPrismaClient();
  }
});

global.testPrisma = prisma;