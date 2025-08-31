const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  describe('Middleware', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .options('/')
        .expect(204);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should parse JSON requests', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User', email: 'test@example.com' });
      
      expect(response.status).not.toBe(400);
    });

    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toBe('Not Found');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});