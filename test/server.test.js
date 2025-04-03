const request = require('supertest');
const express = require('express');
const { OpenAI } = require('openai');
const path = require('path');

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Mock OpenAI
jest.mock('openai');

describe('Server API Tests', () => {
    let app;
    let mockStream;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create mock stream
        mockStream = {
            [Symbol.asyncIterator]() {
                return {
                    async next() {
                        return {
                            value: {
                                choices: [{ delta: { content: 'Test response' } }]
                            },
                            done: false
                        };
                    }
                };
            }
        };

        // Mock OpenAI chat completion
        OpenAI.prototype.chat.completions.create.mockResolvedValue(mockStream);

        // Create Express app
        app = express();
        app.use(express.json());

        // Import and use the chat endpoint
        const chatEndpoint = require('../src/functions/server');
        app.post('/api/chat', chatEndpoint);
    });

    test('Should return 400 if message is missing', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Message is required' });
    });

    test('Should return 200 and stream response for valid message', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' })
            .expect('Content-Type', /text\/event-stream/)
            .expect('Cache-Control', 'no-cache')
            .expect('Connection', 'keep-alive');

        expect(response.status).toBe(200);
        expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith({
            model: 'gpt-3.5-turbo',
            messages: expect.arrayContaining([
                { role: 'user', content: 'Hello' }
            ]),
            stream: true
        });
    });

    test('Should handle OpenAI API errors', async () => {
        // Mock OpenAI error
        OpenAI.prototype.chat.completions.create.mockRejectedValue(new Error('API Error'));

        const response = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An error occurred while processing your request' });
    });
});

// Import the server app
const app = require('../server');

describe('Chat API', () => {
  // Increase Jest timeout for all tests in this suite
  jest.setTimeout(15000);

  test('GET / returns index.html', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /api/chat/stream sets SSE headers and sends initial message', async () => {
    const response = await request(app)
      .get('/api/chat/stream')
      .set('Accept', 'text/event-stream');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/event-stream');
    expect(response.headers['cache-control']).toBe('no-cache');
    expect(response.headers['connection']).toBe('keep-alive');

    // Verify initial connection message
    expect(response.text).toBe('data: {"type":"connected"}\n\n');
  });

  test('POST /api/chat streams response', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' })
      .set('Accept', 'text/event-stream')
      .timeout(10000); // Increase timeout for streaming test
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/event-stream');
    
    // Parse the SSE data
    const data = response.text.split('\n\n')
      .filter(line => line.startsWith('data: '))
      .map(line => {
        const data = line.slice(6);
        if (data === '[DONE]') return null;
        try {
          return JSON.parse(data);
        } catch (e) {
          return null;
        }
      })
      .filter(item => item !== null);
    
    expect(data[0].content).toBe('Hello');
    expect(data[1].content).toBe(' ');
    expect(data[2].content).toBe('world');
    expect(data[3].content).toBe('!');
  });

  afterAll(done => {
    // Close any open connections
    if (app.close) {
      app.close(done);
    } else {
      done();
    }
  });
}); 