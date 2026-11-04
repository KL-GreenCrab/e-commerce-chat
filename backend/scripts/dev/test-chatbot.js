const axios = require('axios');

async function testChatbot() {
    try {
        console.log('Sending message to chatbot...');
        const response = await axios.post('http://localhost:5000/api/chatbot/message', {
            message: 'xin chào'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

testChatbot();
