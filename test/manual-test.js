/**
 * Manual Testing Script
 * 
 * This script helps test the chatbot functionality locally before pushing.
 * Run with: node test/manual-test.js
 */

const http = require('http');
const { OpenAI } = require('openai');
require('dotenv').config();

// Configuration
const PORT = process.env.PORT || 3007;
const TEST_MESSAGES = [
  "Hello, who are you?",
  "What's your experience with AI?",
  "Tell me about your work at OLYMPUS",
  "What are your skills?",
  "How can I contact you?"
];

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create a simple HTTP server for testing
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        console.log(`\n📝 Testing message: "${message}"`);
        
        // Set SSE headers
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        
        // Stream the response
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are Lars's AI assistant. Answer questions about his background and experience." 
            },
            { 
              role: "user", 
              content: message 
            }
          ],
          stream: true
        });
        
        let fullResponse = '';
        
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
            process.stdout.write(content); // Show streaming in console
          }
        }
        
        console.log('\n\n✅ Response complete');
        console.log('📊 Response length:', fullResponse.length, 'characters');
        
        // Send end message
        res.write('data: [DONE]\n\n');
        res.end();
        
      } catch (error) {
        console.error('❌ Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Test server running at http://localhost:${PORT}`);
  console.log('📋 Available test messages:');
  TEST_MESSAGES.forEach((msg, i) => {
    console.log(`  ${i+1}. "${msg}"`);
  });
  console.log('\n💡 To test, open your browser console and run:');
  console.log(`
fetch('http://localhost:${PORT}/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello, who are you?' })
}).then(response => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  function readStream() {
    reader.read().then(({value, done}) => {
      if (done) return;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              console.log(parsed.content);
            }
          } catch (e) {}
        }
      }
      
      readStream();
    });
  }
  
  readStream();
});
  `);
}); 