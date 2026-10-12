const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const app = require('../server');
const User = require('../models/User');
const PickupSlot = require('../models/PickupSlot');
const Booking = require('../models/Booking');

describe('GreenRoute Automated Test Suite', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.USE_MEMORY_DB_IF_LOCAL_FAILS = 'true';
    await connectDB();
  },120000);

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await PickupSlot.deleteMany({});
    await Booking.deleteMany({});
  });

  describe('DevOps Health Check Endpoint', () => {
    it('GET /api/health should return 200 with service status and metadata', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'UP');
      expect(res.body).toHaveProperty('service', 'greenroute-backend-api');
      expect(res.body).toHaveProperty('uptimeSeconds');
      expect(res.body.database.status).toBe('connected');
    });
  });

  describe('Authentication Endpoints', () => {
    it('POST /api/auth/register should create a resident account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@greenroute.com',
          password: 'password123',
          phone: '+1 555-0100',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('jane@greenroute.com');
      expect(res.body.user.role).toBe('resident');
    });

    it('POST /api/auth/login should authenticate valid user credentials', async () => {
      // First register
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@greenroute.com',
          password: 'password123',
        });

      // Then login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@greenroute.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.name).toBe('John Doe');
    });

    it('POST /api/auth/login should reject invalid passwords', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john2@greenroute.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john2@greenroute.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Slot Management and Overbooking Prevention', () => {
    it('Should prevent overbooking when slot capacity is exhausted', async () => {
      // 1. Create a slot with maxCapacity of 1
      const slot = await PickupSlot.create({
        date: '2026-10-20',
        startTime: '08:00 AM',
        endTime: '10:00 AM',
        label: 'Test Limited Slot',
        maxCapacity: 1,
        bookedCount: 0,
        status: 'available',
      });

      // 2. Register a user & get token
      const reg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Resident One',
          email: 'res1@greenroute.com',
          password: 'password123',
        });
      const token = reg.body.token;

      // 3. First booking should succeed
      const bookingRes1 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slotId: slot._id,
          wasteType: 'Recyclables',
          estimatedWeightKg: 10,
          address: {
            street: '123 Green Way',
            city: 'Greenville',
            zipCode: '94016',
          },
        });

      expect(bookingRes1.statusCode).toBe(201);
      expect(bookingRes1.body.success).toBe(true);
      expect(bookingRes1.body.booking.status).toBe('Confirmed');

      // 4. Second booking to the same slot must fail due to overbooking prevention
      const bookingRes2 = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slotId: slot._id,
          wasteType: 'Organic / Compost',
          estimatedWeightKg: 5,
          address: {
            street: '123 Green Way',
            city: 'Greenville',
            zipCode: '94016',
          },
        });

      expect(bookingRes2.statusCode).toBe(400);
      expect(bookingRes2.body.success).toBe(false);
      expect(bookingRes2.body.message).toMatch(/fully booked/i);
    });
  });
});
