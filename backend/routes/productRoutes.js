const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const {
            search,
            brand,
            category,
            minPrice,
            maxPrice,
            minRating,
            sortBy = 'name',
            sortOrder = 'asc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (search) {
            // Create a regex pattern for more flexible search
            const searchRegex = new RegExp(search.split(' ').join('|'), 'i');
            filter.$or = [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { category: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } }
            ];
        }
        if (brand) {
            filter.brand = brand;
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const products = await Product.find(filter)
            .sort(sort)
            .lean();

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(new mongoose.Types.ObjectId(req.params.id));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new product
router.post('/', auth, admin, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category,
        stock: req.body.stock
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findById(new mongoose.Types.ObjectId(req.params.id));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.assign(product, req.body);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findById(new mongoose.Types.ObjectId(req.params.id));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get unique brands and categories
router.get('/metadata/brands', async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/metadata/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;