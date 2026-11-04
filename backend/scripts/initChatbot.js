const mongoose = require('mongoose');
const config = require('../config');
const ChatbotIntent = require('../models/ChatbotIntent');
const intents = require('../data/chatbotIntents');

async function initChatbot() {
    try {
        // Kết nối với MongoDB
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Xóa dữ liệu cũ
        await ChatbotIntent.deleteMany({});
        console.log('Deleted existing chatbot intents');

        // Thêm dữ liệu mới
        await ChatbotIntent.insertMany(intents);
        console.log('Added new chatbot intents');

        console.log('Chatbot initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing chatbot data:', error);
        process.exit(1);
    }
}

initChatbot();
