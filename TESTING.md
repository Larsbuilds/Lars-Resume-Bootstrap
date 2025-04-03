# Testing the Chatbot with Server-Sent Events (SSE)

This document outlines how to test the chatbot implementation with Server-Sent Events (SSE) before pushing to production.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3007
   ```

## Running Tests

### Automated Tests

Run the Jest test suite:

```bash
npm test
```

For watch mode (during development):

```bash
npm run test:watch
```

For coverage report:

```bash
npm run test:coverage
```

### Manual Testing

#### Option 1: Using the Test Server

1. Start the test server:
   ```bash
   node test/manual-test.js
   ```

2. Open your browser console and use the provided fetch code to test the chatbot.

#### Option 2: Using the Test HTML Page

1. Start the main server:
   ```bash
   npm run dev
   ```

2. Open `test/test.html` in your browser to use the interactive test interface.

## What to Test

1. **Basic Functionality**
   - Chat interface opens and closes correctly
   - Messages are sent and displayed properly
   - Typing indicator appears and disappears

2. **SSE Streaming**
   - Responses stream in real-time
   - No delays or buffering issues
   - Proper handling of connection errors

3. **Error Handling**
   - Network errors are handled gracefully
   - Invalid responses are handled properly
   - User gets appropriate error messages

4. **Performance**
   - Response time is acceptable
   - No memory leaks during long conversations
   - Smooth scrolling and UI updates

5. **Cross-browser Compatibility**
   - Test in Chrome, Firefox, Safari, and Edge
   - Check mobile responsiveness

## Common Issues and Solutions

### SSE Connection Issues

If you encounter connection issues:

1. Check that CORS headers are properly set
2. Verify that the server is running on the expected port
3. Ensure no firewall is blocking the connection

### Streaming Problems

If streaming doesn't work correctly:

1. Check browser console for errors
2. Verify that the OpenAI API is returning streamed responses
3. Ensure the client is properly parsing the SSE data

### Performance Issues

If you notice performance problems:

1. Check for memory leaks in the client code
2. Verify that old connections are properly closed
3. Consider implementing a reconnection strategy

## Deployment Checklist

Before pushing to production:

- [ ] All automated tests pass
- [ ] Manual testing completed in all target browsers
- [ ] Error handling verified
- [ ] Performance tested with various message lengths
- [ ] Environment variables properly configured
- [ ] CORS settings appropriate for production
- [ ] Logging implemented for production debugging 