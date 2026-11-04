const jwt = require('jsonwebtoken');
const config = require('../config');

exports.auth = (req, res, next) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.error('Auth error: No Authorization header provided');
            return res.status(401).json({ message: 'Vui lòng đăng nhập' });
        }
        // Extract token
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            console.error('Auth error: Empty token');
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
        // Verify token
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            // Check if decoded contains userId
            if (!decoded.userId) {
                console.error('Auth error: Token does not contain userId', decoded);
                return res.status(401).json({ message: 'Token không hợp lệ (thiếu userId)' });
            }
            // Set user object with _id for compatibility with existing code
            req.user = {
                ...decoded,
                _id: decoded.userId
            };

            console.log('Auth successful, user:', {
                _id: req.user._id,
                role: req.user.role || 'user'
            });

            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn' });
            } else {
                return res.status(401).json({ message: 'Token không hợp lệ' });
            }
        }
    } catch (error) {
        console.error('Unexpected auth error:', error);
        res.status(401).json({ message: 'Vui lòng đăng nhập', error: error.message });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};