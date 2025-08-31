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
    console.log('✅ Database connected successfully');
    return client;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log('Database disconnected');
  }
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
  checkDatabaseHealth,
};