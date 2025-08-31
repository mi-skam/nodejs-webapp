const express = require('express');
const os = require('os');
const { getPrismaClient } = require('../utils/database');
const { checkDatabaseHealth } = require('../utils/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    
    let recentRequests = [];
    try {
      recentRequests = await prisma.requestLog.findMany({
        take: 10,
        orderBy: {
          timestamp: 'desc',
        },
        select: {
          id: true,
          timestamp: true,
          method: true,
          path: true,
          statusCode: true,
          environment: true,
          expressVersion: true,
        },
      });
    } catch (dbError) {
      console.warn('Could not fetch recent requests:', dbError.message);
    }

    const response = {
      debug_mode: process.env.NODE_ENV === 'development' ? 'true' : 'false',
      express_version: require('express/package.json').version,
      node_version: process.version,
      environment: process.env.NODE_ENV || 'development',
      service_name: process.env.SERVICE_NAME || 'nodejs-webapp',
      port: process.env.PORT || '3000',
      hostname: os.hostname(),
      platform: os.platform(),
      timestamp: new Date().toISOString(),
      recent_requests: recentRequests,
    };

    res.json(response);
  } catch (error) {
    console.error('Error in root route:', error);
    res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  
  const healthResponse = {
    status: 'healthy',
    database: dbHealth.status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  const statusCode = dbHealth.status === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthResponse);
});

router.get('/echo/:text', (req, res) => {
  const { text } = req.params;
  
  if (!text) {
    return res.status(400).json({
      error: 'Text parameter is required',
      timestamp: new Date().toISOString(),
    });
  }

  const response = {
    original: text,
    reversed: text.split('').reverse().join(''),
    length: text.length,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

module.exports = router;