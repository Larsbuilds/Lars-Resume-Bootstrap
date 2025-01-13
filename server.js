require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { OpenAI } = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim()
});

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Test route
app.get('/api/test', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "Say 'OpenAI is working!'" }
            ]
        });
        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('Test Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chat route
app.post('/api/chat', async (req, res) => {
    try {
        console.log('1. Server received:', req.body);
        
        const userMessage = req.body.message;
        console.log('2. Processing message:', userMessage);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are Lars's AI assistant. Answer questions about his background and experience." 
                },
                { 
                    role: "user", 
                    content: userMessage 
                }
            ]
        });

        console.log('3. OpenAI response:', completion.choices[0].message.content);
        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('4. Server error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length);
});