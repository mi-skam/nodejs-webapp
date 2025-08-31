const { PrismaClient } = require('@prisma/client');

let prisma = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });
  }
  return prisma;
}

async function connectDatabase() {
  try {
    const client = getPrismaClient();
    await client.$connect();
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write('✅ Database connected successfully\n');
    }
    return client;
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`❌ Database connection failed: ${error.message}\n`);
    }
    throw error;
  }
}

async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write('Database disconnected\n');
    }
  }
}

function resetPrismaClient() {
  prisma = null;
}

async function checkDatabaseHealth() {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return { status: 'connected', message: 'Database is healthy' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

module.exports = {
  getPrismaClient,
  connectDatabase,
  disconnectDatabase,
  resetPrismaClient,
  checkDatabaseHealth,
};