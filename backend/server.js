require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const config = require('./config');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' }
}));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.url}`,
        details: {
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query
        }
    });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Registered routes:');
    app._router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
        } else if (r.name === 'router') {
            console.log(`Router: ${r.regexp}`);
            r.handle.stack.forEach(layer => {
                if (layer.route) {
                    console.log(`  ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
                }
            });
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
});