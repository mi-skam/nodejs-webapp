const request = require('supertest');
const app = require('../../src/app');

describe('Index Routes', () => {
  describe('GET /', () => {
    it('should return system information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('express_version');
      expect(response.body).toHaveProperty('node_version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('service_name');
      expect(response.body).toHaveProperty('port');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('recent_requests');
      
      expect(Array.isArray(response.body.recent_requests)).toBe(true);
    });

    it('should include debug mode information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('debug_mode');
      expect(['true', 'false']).toContain(response.body.debug_mode);
    });
  });

  describe('GET /health', () => {
    it('should return health check information', async () => {
      const response = await request(app)
        .get('/health');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
    });

    it('should include memory usage', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.body.memory).toHaveProperty('rss');
      expect(response.body.memory).toHaveProperty('heapTotal');
      expect(response.body.memory).toHaveProperty('heapUsed');
    });
  });

  describe('GET /echo/:text', () => {
    it('should echo and reverse text', async () => {
      const testText = 'hello';
      const response = await request(app)
        .get(`/echo/${testText}`)
        .expect(200);

      expect(response.body).toEqual({
        original: testText,
        reversed: 'olleh',
        length: 5,
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters', async () => {
      const testText = 'hello world!';
      const response = await request(app)
        .get(`/echo/${encodeURIComponent(testText)}`)
        .expect(200);

      expect(response.body.original).toBe(testText);
      expect(response.body.reversed).toBe('!dlrow olleh');
      expect(response.body.length).toBe(12);
    });

    it('should handle empty string', async () => {
      const response = await request(app)
        .get('/echo/')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle unicode characters', async () => {
      const testText = 'café';
      const response = await request(app)
        .get(`/echo/${encodeURIComponent(testText)}`)
        .expect(200);

      expect(response.body.original).toBe(testText);
      expect(response.body.reversed).toBe('éfac');
      expect(response.body.length).toBe(4);
    });
  });
});