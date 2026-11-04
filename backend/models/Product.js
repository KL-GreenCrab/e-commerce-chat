const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    Display: String,
    Processor: String,
    RAM: String,
    Storage: String,
    Camera: String,
    Battery: String,
    OS: String
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number
    },
    image: {
        type: String,
        required: true
    },
    images: [String],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    specifications: specificationSchema
}, {
    timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 