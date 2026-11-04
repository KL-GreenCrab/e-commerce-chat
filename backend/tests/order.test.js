process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

class MockOrder {
  constructor(data = {}) {
    Object.assign(this, data);
    this._id = this._id || '507f1f77bcf86cd799439012';
  }

  async save() {
    return this;
  }
}

jest.mock('../models/Order', () => MockOrder);
jest.mock('../models/Cart', () => ({
  deleteOne: jest.fn().mockResolvedValue(true)
}));

const orderRoutes = require('../routes/orderRoutes');
const Cart = require('../models/Cart');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an order when totals match the cart and auth is valid', async () => {
    const token = jwt.sign({ userId: '507f1f77bcf86cd799439011', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const payload = {
      items: [
        {
          productId: '507f1f77bcf86cd799439011',
          name: 'Test product',
          image: 'https://example.com/image.png',
          price: 100,
          quantity: 2
        }
      ],
      total: 200,
      paymentMethod: 'credit_card',
      shippingAddress: {
        fullName: 'Alice',
        address: '123 Street',
        city: 'HCM',
        state: 'HCM',
        zipCode: '700000',
        phone: '0900000000'
      }
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.total).toBe(200);
    expect(Cart.deleteOne).toHaveBeenCalled();
  });

  it('refuses an order when the provided total does not match the actual cart total', async () => {
    const token = jwt.sign({ userId: '507f1f77bcf86cd799439011', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [
          {
            productId: '507f1f77bcf86cd799439011',
            name: 'Test product',
            image: 'https://example.com/image.png',
            price: 100,
            quantity: 2
          }
        ],
        total: 999,
        paymentMethod: 'credit_card',
        shippingAddress: {
          fullName: 'Alice',
          address: '123 Street',
          city: 'HCM',
          state: 'HCM',
          zipCode: '700000',
          phone: '0900000000'
        }
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/không khớp|Tổng tiền không hợp lệ/i);
  });
});
