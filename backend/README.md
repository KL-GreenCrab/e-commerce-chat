# E-commerce Chatbot — Backend

REST API for an electronics e-commerce site with a built-in shopping assistant. Handles authentication, products, carts, orders, an admin dashboard and an intent-based chatbot that recommends products.

> Part of the [E-commerce Chatbot](../README.md) monorepo. The React client lives in [`../frontend`](../frontend/README.md).

## Features

- **Auth & roles** — register/login with bcrypt-hashed passwords, JWT-protected routes, `user` / `admin` roles
- **Catalog** — product CRUD, filtering by brand/category/price, brand and category metadata endpoints
- **Cart & orders** — per-user cart, checkout, order history, order status management for admins
- **Admin** — sales/order statistics, order management, product creation
- **Chatbot** — intent matching + keyword extraction over the product catalog: price-range recommendations, brand/category questions, product consultation, fallback replies. Intents are stored in MongoDB and seeded from `data/chatbotIntents.js`

## Tech stack

Node.js · Express · MongoDB · Mongoose · JSON Web Tokens · bcryptjs · CORS

## Getting started

**Requirements:** Node.js 18+ and a MongoDB instance (local or Atlas).

```bash
cd backend
npm install
cp .env.example .env      # then edit the values
npm run dev               # nodemon, http://localhost:5000
```

Seed the database (run once):

```bash
node seed.js                    # sample products + an admin account
node scripts/initChatbot.js     # chatbot intents
```

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/EcomerceChatbot` |
| `JWT_SECRET` | Secret used to sign tokens — **required in production** | — |

## API overview

Base URL: `/api`

| Area | Endpoints | Access |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | Public |
| Products | `GET /products`, `GET /products/:id`, `GET /products/metadata/brands`, `GET /products/metadata/categories` | Public |
| Products (write) | `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | Admin |
| Users | `GET /users`, `GET/PUT/DELETE /users/:id` | Admin / owner |
| Cart | `GET/POST/DELETE /cart/:userId`, `PUT/DELETE /cart/:userId/:productId` | Owner |
| Orders | `POST /orders`, `GET /orders/user/:userId`, `GET /orders/:id` | Owner / admin |
| Admin | `GET /admin/stats`, `GET /admin/orders`, `GET /admin/orders/:id`, `POST /admin/add-product` | Admin |
| Chatbot | `POST /chatbot/message` | Public |

Protected routes expect `Authorization: Bearer <token>`.

### Example

```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend a phone under $800"}'
```

## Project structure

```
backend/
├── server.js            # app entry point
├── config.js            # environment config
├── models/              # User, Product, Cart, Order, ChatbotIntent
├── routes/              # auth, users, products, cart, orders, admin, chatbot
├── middleware/          # auth + admin guards
├── services/            # chatbot logic
├── data/                # chatbot intent definitions
├── scripts/             # DB init scripts
└── seed.js              # sample data
```

## How the chatbot works

1. The message is normalized and matched against stored intents (keywords/patterns).
2. Depending on the intent, the service queries MongoDB for brands, categories or products in the requested price range, or extracts keywords for a product search.
3. A templated response is built from the results. Conversation context is kept in memory per session.

## Roadmap

- [ ] Automated tests (Jest + Supertest)
- [ ] Rate limiting and request validation
- [ ] LLM-backed answers grounded in the product catalog

## License

MIT
