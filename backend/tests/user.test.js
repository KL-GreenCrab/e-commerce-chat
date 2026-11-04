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

    async deleteOne() {
      return true;
    }
  }

  return MockUser;
});

const User = require('../models/User');
const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const makeUserDoc = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  email: 'alice@example.com',
  name: 'Alice',
  phone: '0900000000',
  address: '123 Street',
  city: 'HCM',
  role: 'user',
  select: jest.fn(function () { return this; }),
  save: jest.fn(async function () { return this; }),
  deleteOne: jest.fn(async function () { return true; }),
  ...overrides
});

describe('User routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the current user profile when authenticated', async () => {
    const user = makeUserDoc();
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(user)
    });

    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('alice@example.com');
  });

  it('updates only allowed user fields', async () => {
    const user = makeUserDoc({
      name: 'Alice',
      phone: '0900000000',
      address: '123 Street',
      city: 'HCM'
    });
    User.findById.mockResolvedValue(user);

    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alice Updated',
        phone: '0999999999',
        address: '456 Avenue',
        city: 'Da Nang',
        password: 'should-not-be-allowed',
        role: 'admin'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Alice Updated');
    expect(response.body.city).toBe('Da Nang');
    expect(response.body.role).toBe('user');
    expect(user.password).toBeUndefined;
  });
});
