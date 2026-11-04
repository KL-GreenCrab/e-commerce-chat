const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

const allowedUserUpdates = ['name', 'phone', 'address', 'city'];

const canAccessUser = (req, targetUserId) => {
    const targetId = targetUserId.toString();
    return req.user.role === 'admin' || req.user._id.toString() === targetId;
};

// Lấy tất cả users
router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy user theo ID
router.get('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!canAccessUser(req, user._id)) {
            return res.status(403).json({ message: 'Unauthorized: You can only access your own profile' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật user
router.put('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!canAccessUser(req, user._id)) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own profile' });
        }

        const updates = Object.keys(req.body).reduce((acc, key) => {
            if (allowedUserUpdates.includes(key)) {
                acc[key] = req.body[key];
            }
            return acc;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        Object.assign(user, updates);
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            role: updatedUser.role
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa user
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own account' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 