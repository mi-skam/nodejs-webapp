const express = require('express');
const { getPrismaClient } = require('../utils/database');

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      users,
      count: users.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`Error fetching users: ${error.message}\n`);
    }
    res.status(500).json({
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString(),
    });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, active = true } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required',
        timestamp: new Date().toISOString(),
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        timestamp: new Date().toISOString(),
      });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        active,
      },
    });

    res.status(201).json({
      user,
      message: 'User created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`Error creating user: ${error.message}\n`);
    }
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email already exists',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      error: 'Failed to create user',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`Error fetching user: ${error.message}\n`);
    }
    res.status(500).json({
      error: 'Failed to fetch user',
      timestamp: new Date().toISOString(),
    });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
    }

    const { name, email, active } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
          timestamp: new Date().toISOString(),
        });
      }
      updateData.email = email;
    }
    if (active !== undefined) updateData.active = active;

    const prisma = getPrismaClient();
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      user,
      message: 'User updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`Error updating user: ${error.message}\n`);
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'User not found',
        timestamp: new Date().toISOString(),
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email already exists',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      error: 'Failed to update user',
      timestamp: new Date().toISOString(),
    });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
    }

    const prisma = getPrismaClient();
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      process.stderr.write(`Error deleting user: ${error.message}\n`);
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'User not found',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      error: 'Failed to delete user',
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;