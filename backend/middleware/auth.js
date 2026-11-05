const jwt = require('jsonwebtoken');
const config = require('../config');

exports.auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            if (!decoded.userId) {
                return res.status(401).json({ message: 'Token không hợp lệ (thiếu userId)' });
            }

            req.user = {
                ...decoded,
                _id: decoded.userId
            };

            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn' });
            }
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Vui lòng đăng nhập', error: error.message });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};