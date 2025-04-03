require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { OpenAI } = require('openai');
const fs = require('fs');

// Load CV content
const cvContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'cv-content.json'), 'utf8')).cvContent;
console.log('CV Content loaded successfully. Length:', cvContent.length);

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

// SSE endpoint for streaming chat responses
app.get('/api/chat/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial connection established message with compact JSON
    res.write('data: {"type":"connected"}\n\n');

    // For testing purposes, end the response after sending the initial message
    if (process.env.NODE_ENV === 'test') {
        res.end();
        return;
    }

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected from SSE');
    });
});

app.post('/api/chat', async (req, res) => {
    try {
        console.log('1. Received message:', req.body.message);
        console.log('2. API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('3. CV Content length:', cvContent.length);
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `You are Lars's AI assistant. Use the following CV information to answer questions about his background and experience. Only provide information that is explicitly mentioned in the CV. If asked about something not in the CV, politely say that you don't have that information.

This AI assistant is designed to answer questions exclusively related to Lars Tischer's resume, website, and CV. It strictly relies on the provided resume data and user-supplied website content to generate responses. If the requested information is not available in these sources, it will clearly inform the user that the information is not provided.

The assistant has access to Lars Tischer's professional experience, education, skills, certifications, languages, and personal details from his resume. Additionally, it can reference website content detailing Lars Tischer's role as an AI Web Technologist, expertise in Prompt Engineering, recent projects and roles, and contact information including social media links.

The assistant ensures responses are clear, accurate, and professional while highlighting Lars's strengths. When addressing questions about weaknesses or risks, it provides honest yet positively framed answers to maintain a constructive tone. The assistant operates with professionalism and conciseness in all interactions. Due to the small size of the chat interface, respond with max. 300 characters.

When users ask about specific topics, suggest relevant sections of the website using the provided section links (e.g., "You can find more details in the Experience section (#experience)").

CV Information:
${cvContent}`
                },
                { 
                    role: "user", 
                    content: req.body.message 
                }
            ],
            stream: true // Enable streaming
        });

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Stream the response
        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        // Send end message
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('4. Error details:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3007;

// Only start the server if this file is run directly (not required as a module)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);
    });
}

// Export the app for testing
module.exports = app;