const request = require('supertest');
const app = require('../../src/app');

describe('API Routes', () => {
  describe('GET /api/users', () => {
    it('should return empty users array initially', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('timestamp');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.count).toBe(0);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.active).toBe(true);
    });

    it('should require name and email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John' })
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should handle duplicate emails', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const response = await request(app)
        .post('/api/users')
        .send({ ...userData, name: 'Jane Doe' })
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });

    it('should create user with active flag', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        active: false,
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user.active).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const userData = {
        name: 'Test User',
        email: 'getuser@example.com',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      userId = createResponse.body.user.id;
    });

    it('should get user by ID', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.email).toBe('getuser@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should validate user ID format', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid user ID');
    });
  });

  describe('PUT /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const userData = {
        name: 'Update User',
        email: 'updateuser@example.com',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      userId = createResponse.body.user.id;
    });

    it('should update user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.email).toBe(updateData.email);
      expect(response.body.message).toBe('User updated successfully');
    });

    it('should partially update user', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Partially Updated' })
        .expect(200);

      expect(response.body.user.name).toBe('Partially Updated');
      expect(response.body.user.email).toBe('updateuser@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/99999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should validate email format on update', async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      const userData = {
        name: 'Delete User',
        email: 'deleteuser@example.com',
      };

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      userId = createResponse.body.user.id;
    });

    it('should delete user', async () => {
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should validate user ID format', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .expect(400);

      expect(response.body.error).toBe('Invalid user ID');
    });
  });
});