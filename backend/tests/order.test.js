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
jest.mock('../models/Product', () => ({
  find: jest.fn()
}));

const orderRoutes = require('../routes/orderRoutes');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Product.find.mockResolvedValue([
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test product',
        image: 'https://example.com/image.png',
        price: 100,
        stock: 10
      }
    ]);
  });

  it('creates an order when auth is valid', async () => {
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

  it('uses the database price when a lower client price is sent', async () => {
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
            price: 50,
            quantity: 2
          }
        ],
        total: 90,
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

    expect(response.status).toBe(201);
    expect(response.body.total).toBe(200);
    expect(response.body.items[0].price).toBe(100);
  });
});
