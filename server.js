require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { OpenAI } = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
        console.log('1. Received message:', req.body.message);
        console.log('2. API Key exists:', !!process.env.OPENAI_API_KEY);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are Lars's AI assistant. Answer questions about his background and experience." 
                },
                { 
                    role: "user", 
                    content: req.body.message 
                }
            ]
        });

        console.log('3. OpenAI response:', completion.choices[0].message.content);
        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('4. Error details:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);
});