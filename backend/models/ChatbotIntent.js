const mongoose = require('mongoose');

const chatbotIntentSchema = new mongoose.Schema({
    // Loại ý định (tìm sản phẩm, hỏi về vận chuyển, v.v.)
    type: {
        type: String,
        required: true,
        enum: [
            'product_search',
            'category_exploration',
            'brand_recommendation',
            'price_range_recommendation',
            'product_consultation',
            'shipping',
            'payment',
            'return_policy',
            'greeting',
            'fallback'
        ]
    },
    // Các từ khóa hoặc mẫu câu để nhận diện ý định
    patterns: {
        type: [String],
        required: true
    },
    // Các câu trả lời mẫu (sẽ chọn ngẫu nhiên một câu)
    responses: {
        type: [String],
        required: true
    },
    // Có cần truy vấn sản phẩm không
    requiresProductQuery: {
        type: Boolean,
        default: false
    },
    // Có cần truy vấn thương hiệu theo danh mục không
    requiresCategoryBrands: {
        type: Boolean,
        default: false
    },
    // Có cần truy vấn theo khoảng giá không
    requiresPriceRange: {
        type: Boolean,
        default: false
    },
    // Có cần tư vấn sản phẩm cụ thể không
    requiresProductConsultation: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ChatbotIntent', chatbotIntentSchema);
