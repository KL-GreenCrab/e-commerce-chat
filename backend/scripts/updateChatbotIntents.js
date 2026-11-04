const mongoose = require('mongoose');
const config = require('../config');
const ChatbotIntent = require('../models/ChatbotIntent');
const intents = require('../data/chatbotIntents');

async function updateChatbotIntents() {
    try {
        // Kết nối với MongoDB
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Xóa dữ liệu cũ
        await ChatbotIntent.deleteMany({});
        console.log('Deleted existing chatbot intents');

        // Thêm dữ liệu mới
        await ChatbotIntent.insertMany(intents);
        console.log('Added new enhanced chatbot intents');

        // Hiển thị thống kê
        const intentCount = await ChatbotIntent.countDocuments();
        console.log(`Total intents: ${intentCount}`);

        // Hiển thị các intent types
        const intentTypes = await ChatbotIntent.distinct('type');
        console.log('Intent types:', intentTypes);

        // Test price range extraction
        console.log('\n--- Testing Price Range Extraction ---');
        const testMessages = [
            'Tôi muốn tìm sản phẩm trên 2000 USD',
            'Tôi muốn tìm sản phẩm dưới 500 USD',
            'Tôi muốn tìm sản phẩm từ 500 đến 1000 USD'
        ];

        // Import the service function for testing
        const { extractPriceRange } = require('../services/chatbotService');

        testMessages.forEach(msg => {
            console.log(`Message: "${msg}"`);
            // This would need the function to be exported, for now just log
            console.log('Would extract price range...');
        });

        console.log('Chatbot intents update completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating chatbot intents:', error);
        process.exit(1);
    }
}

updateChatbotIntents();
