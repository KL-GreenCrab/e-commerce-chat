const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbotService');
const { auth, admin } = require('../middleware/auth');

// Endpoint nhận tin nhắn từ người dùng
router.post('/message', async (req, res) => {
    try {
        console.log('Received message request:', req.body);
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            console.error('Invalid message format:', req.body);
            return res.status(400).json({ message: 'Invalid message format' });
        }
        // Generate session ID from IP or use provided session ID
        const sessionId = req.body.sessionId || req.ip || 'default';
        console.log('Processing message:', message);
        const response = await chatbotService.processMessage(message, sessionId);
        console.log('Response generated from real service:', response);
        res.json(response);
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ message: 'Error processing message', error: error.message });
    }
});

// Endpoint để khởi tạo dữ liệu chatbot (chỉ chạy một lần, yêu cầu auth + admin)
router.post('/init', auth, admin, async (req, res) => {
    try {
        const ChatbotIntent = require('../models/ChatbotIntent');
        const intents = require('../data/chatbotIntents');
        await ChatbotIntent.deleteMany({});
        await ChatbotIntent.insertMany(intents);
        res.json({ message: 'Chatbot data initialized successfully' });
    } catch (error) {
        console.error('Chatbot init error:', error);
        res.status(500).json({ message: 'Error initializing chatbot data', error: error.message });
    }
});

module.exports = router;
