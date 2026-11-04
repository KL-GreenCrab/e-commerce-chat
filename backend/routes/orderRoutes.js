const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

// Tạo đơn hàng mới
router.post('/', auth, async (req, res) => {
    try {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User from auth middleware:', req.user);

        const {
            items,
            total,
            paymentMethod,
            shippingAddress
        } = req.body;

        // Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.log('Validation failed: Empty cart');
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        const normalizedItems = items.map(item => {
            if (!item || !item.productId) {
                throw new Error('productId không hợp lệ');
            }

            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                throw new Error('productId không hợp lệ (định dạng không đúng)');
            }

            if (!item.name || !item.image) {
                throw new Error('Thiếu thông tin sản phẩm');
            }

            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (!Number.isFinite(price) || price <= 0) {
                throw new Error('Giá sản phẩm không hợp lệ');
            }

            if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
                throw new Error('Số lượng sản phẩm không hợp lệ');
            }

            return {
                productId: item.productId,
                name: String(item.name).trim(),
                image: String(item.image).trim(),
                price,
                quantity
            };
        });

        const calculatedTotal = normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const providedTotal = Number(total);

        if (!Number.isFinite(providedTotal) || providedTotal <= 0) {
            console.log('Validation failed: Invalid total amount', total);
            return res.status(400).json({ message: 'Tổng tiền không hợp lệ' });
        }

        if (Math.abs(providedTotal - calculatedTotal) > 0.01) {
            return res.status(400).json({
                message: 'Tổng tiền không khớp với giá trị thực tế của giỏ hàng',
                expectedTotal: calculatedTotal,
                receivedTotal: providedTotal
            });
        }

        // Validate payment method
        const validMethods = ['credit_card', 'bank_transfer', 'cash_on_delivery'];
        if (!validMethods.includes(paymentMethod)) {
            console.log('Validation failed: Invalid payment method', paymentMethod);
            return res.status(400).json({
                message: 'Phương thức thanh toán không hợp lệ',
                paymentMethod,
                validMethods
            });
        }

        // Validate shipping address
        console.log('Validating shipping address:', shippingAddress);
        if (!shippingAddress) {
            console.log('Validation failed: Missing shipping address');
            return res.status(400).json({ message: 'Thiếu thông tin địa chỉ giao hàng' });
        }

        const requiredAddressFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'phone'];
        for (const field of requiredAddressFields) {
            if (!shippingAddress[field]) {
                console.log(`Validation failed: Missing address field: ${field}`);
                return res.status(400).json({ message: `Thiếu trường địa chỉ: ${field}` });
            }
        }

        // Tạo đơn hàng mới
        const order = new Order({
            userId: req.user._id,
            items: normalizedItems,
            total: calculatedTotal,
            paymentMethod,
            shippingAddress,
            status: 'pending'
        });

        // Lưu đơn hàng
        await order.save();

        // Xóa giỏ hàng sau khi đặt hàng thành công
        await Cart.deleteOne({ userId: req.user._id });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);

        // Check for specific error types
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            console.error('Validation errors:', validationErrors);
            return res.status(400).json({
                message: 'Lỗi xác thực dữ liệu',
                validationErrors
            });
        } else if (error.name === 'MongoServerError' && error.code === 11000) {
            // Duplicate key error
            console.error('Duplicate key error:', error.keyValue);
            return res.status(400).json({
                message: 'Đơn hàng đã tồn tại',
                duplicateField: Object.keys(error.keyValue)[0]
            });
        } else if (error.name === 'CastError') {
            // Invalid ID format
            console.error('Cast error:', error.path, error.value);
            return res.status(400).json({
                message: `Định dạng không hợp lệ cho trường ${error.path}`
            });
        }

        // Generic server error
        console.error('Unhandled error in order creation:', error);
        res.status(500).json({
            message: 'Lỗi máy chủ khi tạo đơn hàng',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Lấy danh sách đơn hàng của user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.params.userId);
        console.log('Authenticated user:', req.user._id);

        // Kiểm tra quyền truy cập - chuyển đổi cả hai thành string để so sánh
        if (req.user._id.toString() !== req.params.userId.toString()) {
            console.log('Access denied: User IDs do not match');
            return res.status(403).json({ message: 'Không có quyền truy cập: Bạn chỉ có thể xem đơn hàng của chính mình' });
        }

        // Chuyển đổi userId thành ObjectId
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        // Tìm đơn hàng của người dùng và sắp xếp theo thời gian tạo (mới nhất lên đầu)
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders for user ${req.params.userId}`);

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách đơn hàng',
            error: error.message
        });
    }
});

// Lấy chi tiết một đơn hàng
router.get('/:id', auth, async (req, res) => {
    try {
        console.log('Fetching order details for ID:', req.params.id);
        console.log('Authenticated user:', req.user._id);

        // Kiểm tra định dạng ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid order ID format');
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ' });
        }

        // Tìm đơn hàng theo ID
        const order = await Order.findById(req.params.id);

        // Kiểm tra nếu đơn hàng không tồn tại
        if (!order) {
            console.log('Order not found');
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        console.log('Order found:', order._id);
        console.log('Order belongs to user:', order.userId);

        // Kiểm tra quyền truy cập - người dùng chỉ có thể xem đơn hàng của chính họ
        // Admin có thể xem tất cả đơn hàng (kiểm tra role)
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            console.log('Access denied: User is not the owner of this order');
            return res.status(403).json({
                message: 'Không có quyền truy cập: Bạn chỉ có thể xem đơn hàng của chính mình'
            });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin đơn hàng',
            error: error.message
        });
    }
});

module.exports = router;