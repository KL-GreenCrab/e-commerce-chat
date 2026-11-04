const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Lấy thống kê dashboard
router.get('/stats', auth, admin, async (req, res) => {
    try {
        // Tính tổng số sản phẩm
        const totalProducts = await Product.countDocuments();

        // Tính tổng số đơn hàng
        const totalOrders = await Order.countDocuments();

        // Tính số đơn hàng theo trạng thái
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Tính tỷ lệ hoàn thành đơn hàng
        const orderCompletionRate = totalOrders > 0 ? parseFloat((completedOrders / totalOrders * 100).toFixed(2)) : 0;

        // Tính tổng doanh thu từ đơn hàng đã hoàn thành
        const completedOrdersData = await Order.find({ status: 'completed' });
        const totalRevenue = completedOrdersData.reduce((sum, order) => sum + order.total, 0);

        // Tính tổng số sản phẩm đã bán
        const totalProductsSold = completedOrdersData.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);

        // Tính doanh thu trung bình trên mỗi đơn hàng
        const averageOrderValue = completedOrders > 0 ? parseFloat((totalRevenue / completedOrders).toFixed(2)) : 0;

        // Tính doanh thu theo thời gian (7 ngày gần đây)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Tìm sản phẩm bán chạy nhất
        const productSales = {};
        completedOrdersData.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        id: item.productId,
                        name: item.name,
                        image: item.image,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.price * item.quantity;
            });
        });

        const topSellingProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Lấy đơn hàng gần đây
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        res.json({
            totalProducts,
            totalOrders,
            ordersByStatus: {
                pending: pendingOrders,
                processing: processingOrders,
                completed: completedOrders,
                cancelled: cancelledOrders
            },
            orderCompletionRate,
            totalRevenue,
            totalProductsSold,
            averageOrderValue,
            revenueByDay,
            topSellingProducts,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
});

// Lấy danh sách đơn hàng
router.get('/orders', auth, admin, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Lấy chi tiết đơn hàng theo ID
router.get('/orders/:id', auth, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
});

// Cập nhật trạng thái hoặc chỉnh sửa thông tin đơn hàng
router.put('/orders/:id', auth, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Cập nhật thông tin từ `req.body`
        Object.assign(order, req.body);
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// Thêm sản phẩm mới (admin)
router.post('/add-product', auth, admin, async (req, res) => {
    try {
        const {
            name, brand, category, price, originalPrice,
            image, images, stock,
            description, specifications
        } = req.body;

        if (!name || !brand || !category || !price || !image || !stock || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const product = new Product({
            name,
            brand,
            category,
            price,
            originalPrice,
            image,
            images,
            stock,
            rating: 0,
            reviews: 0,
            description,
            specifications
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

module.exports = router;