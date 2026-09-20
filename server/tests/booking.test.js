require('./setup');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Space = require('../src/models/Space');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');

const futureDate = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 7);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getToken = async (role = 'member') => {
  const user = await User.create({
    name: role === 'admin' ? 'Admin' : 'Member',
    email: `${role}${Date.now()}@test.com`,
    passwordHash: await bcrypt.hash('password123', 12),
    role,
  });
  const token = jwt.sign({ userId: user._id, role: user.role }, env.jwtAccessSecret, { expiresIn: '1h' });
  return { token, user };
};

describe('Booking', () => {
  let space;
  let memberToken;
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    space = await Space.create({
      name: 'Test Room',
      type: 'meeting_room',
      capacity: 4,
      amenities: ['Whiteboard'],
    });
    const member = await getToken('member');
    memberToken = member.token;
    const admin = await getToken('admin');
    adminToken = admin.token;
    adminUser = admin.user;
  });

  it('creates a valid booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date: futureDate(), startTime: '10:00', endTime: '11:00' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  it('rejects overlapping booking', async () => {
    const date = futureDate();
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date, startTime: '10:00', endTime: '11:00' });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date, startTime: '10:30', endTime: '11:30' });

    expect(res.status).toBe(409);
  });

  it('allows adjacent bookings', async () => {
    const date = futureDate();
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date, startTime: '10:00', endTime: '11:00' });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date, startTime: '11:00', endTime: '12:00' });

    expect(res.status).toBe(201);
  });

  it('rejects past booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date: '2020-01-01', startTime: '10:00', endTime: '11:00' });

    expect(res.status).toBe(400);
  });

  it('handles concurrent booking requests', async () => {
    const date = futureDate();
    const payload = { space: space._id.toString(), date, startTime: '14:00', endTime: '15:00' };

    const member2 = await getToken('member');

    const [res1, res2] = await Promise.all([
      request(app).post('/api/bookings').set('Authorization', `Bearer ${memberToken}`).send(payload),
      request(app).post('/api/bookings').set('Authorization', `Bearer ${member2.token}`).send(payload),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 409]);
  });

  it('auto-rejects overlapping pending when one is approved', async () => {
    const Booking = require('../src/models/Booking');
    const date = futureDate();
    const toDT = (t) => {
      const [y, m, d] = date.split('-').map(Number);
      const [h, min] = t.split(':').map(Number);
      return new Date(Date.UTC(y, m - 1, d, h, min));
    };
    const member2 = await getToken('member');

    const [b1, b2] = await Booking.insertMany([
      {
        user: member2.user._id,
        space: space._id,
        date,
        startTime: '10:00',
        endTime: '11:00',
        startDateTime: toDT('10:00'),
        endDateTime: toDT('11:00'),
        status: 'pending',
      },
      {
        user: member2.user._id,
        space: space._id,
        date,
        startTime: '10:30',
        endTime: '11:30',
        startDateTime: toDT('10:30'),
        endDateTime: toDT('11:30'),
        status: 'pending',
      },
    ]);

    await request(app)
      .patch(`/api/admin/bookings/${b1._id}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    const updated = await Booking.findById(b2._id);
    expect(updated.status).toBe('rejected');
  });

  it('member cannot access admin endpoints', async () => {
    const res = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(403);
  });

  it('admin can approve booking', async () => {
    const date = futureDate();
    const booking = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ space: space._id, date, startTime: '09:00', endTime: '10:00' });

    const res = await request(app)
      .patch(`/api/admin/bookings/${booking.body.data._id}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('approved');
  });
});
