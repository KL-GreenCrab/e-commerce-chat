const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = new User({ email, password, name, phone, address });
        await user.save();
        // Tạo JWT token
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.status(201).json({ token, user: { _id: user._id, email: user.email, name: user.name, phone: user.phone, address: user.address } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Tạo JWT token có cả role
        const token = jwt.sign({ userId: user._id, role: user.role || 'user' }, config.jwtSecret, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                role: user.role || 'user'
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 