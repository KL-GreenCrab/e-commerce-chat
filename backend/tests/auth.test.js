process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/User', () => {
  class MockUser {
    constructor(data = {}) {
      Object.assign(this, data);
      this._id = this._id || '507f1f77bcf86cd799439011';
      this.role = this.role || 'user';
    }

    static findOne = jest.fn();
    static findById = jest.fn();

    async save() {
      return this;
    }

    async comparePassword(password) {
      return password === this.password;
    }
  }

  return MockUser;
});

const User = require('../models/User');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user and returns a JWT token', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'alice@example.com',
        password: 'secret123',
        name: 'Alice',
        phone: '0900000000',
        address: '123 Street'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe('alice@example.com');

    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBeTruthy();
  });

  it('logs in a user and returns a JWT token', async () => {
    const user = {
      _id: '507f1f77bcf86cd799439011',
      email: 'alice@example.com',
      name: 'Alice',
      phone: '0900000000',
      address: '123 Street',
      role: 'user',
      password: 'secret123',
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(user);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'secret123'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe('alice@example.com');
    expect(response.body.user.role).toBe('user');
  });
});
