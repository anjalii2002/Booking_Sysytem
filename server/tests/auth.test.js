require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
  it('registers a new member', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'dup@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Other', email: 'dup@test.com', password: 'password123' });

    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: 'login@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'none@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });

  it('refreshes token', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Refresh User', email: 'refresh@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: reg.body.data.refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('logs out', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Logout User', email: 'logout@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${reg.body.data.accessToken}`);

    expect(res.status).toBe(200);
  });
});
