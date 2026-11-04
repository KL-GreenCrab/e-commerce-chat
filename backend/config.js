require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const jwtSecret = process.env.JWT_SECRET || (env === 'test' ? 'test-secret' : null);
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required. Set it before starting the backend.');
}

const config = {
    development: {
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/EcomerceChatbot',
        NODE_ENV: 'development',
        CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
        jwtSecret,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@12345'
    },
    production: {
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/EcomerceChatbot',
        NODE_ENV: 'production',
        CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
        jwtSecret,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@12345'
    },
    test: {
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/EcomerceChatbot',
        NODE_ENV: 'test',
        CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
        jwtSecret,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@12345'
    }
};

module.exports = config[env] || config.development; 