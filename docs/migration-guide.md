# Migration Guide

This guide provides detailed instructions for integrating the AI chat component into your project.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An OpenAI API key
- A web server (Express.js recommended for local development)
- Netlify account (for Netlify deployment)

## Step 1: Install Dependencies

Add the required dependencies to your project:

```bash
npm install openai express dotenv
```

For development:
```bash
npm install --save-dev jest supertest nodemon
```

## Step 2: File Structure

Copy the following files to your project:

1. **Client-side Files**:
   - `src/js/chatbot.js` → Your project's JavaScript directory
   - `src/css/chat.css` → Your project's CSS directory

2. **Server Files**:
   - For local development: `src/functions/server.js`
   - For Netlify: `src/functions/chat.js` → `netlify/functions/chat.js`

## Step 3: Environment Setup

1. Create a `.env` file in your project root:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=8888  # Optional, defaults to 8888
   ```

2. For Netlify deployment, add the environment variable in your Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add `OPENAI_API_KEY` with your API key

## Step 4: HTML Integration

Add the following HTML structure to your page:

```html
<!-- Chat Button -->
<button id="chat-button" class="chat-button">
  <i class="fas fa-comments"></i>
</button>

<!-- Chat Window -->
<div id="chat-window" class="chat-window">
  <div class="chat-header">
    <h3>Chat Assistant</h3>
    <button id="close-chat" class="close-button">&times;</button>
  </div>
  <div id="chat-messages" class="chat-messages"></div>
  <div class="chat-input-container">
    <input type="text" id="chat-input" placeholder="Type your message...">
    <button id="send-message">Send</button>
  </div>
</div>
```

## Step 5: API Configuration

1. **Local Development**:
   - Update the API endpoint in `chatbot.js`:
     ```javascript
     const API_ENDPOINT = '/api/chat';
     ```

2. **Netlify Deployment**:
   - Update the API endpoint in `chatbot.js`:
     ```javascript
     const API_ENDPOINT = '/.netlify/functions/chat';
     ```

## Step 6: Customization

### Styling
Modify `chat.css` to match your project's theme:
- Colors
- Fonts
- Dimensions
- Animations

### System Prompt
Update the system prompt in your server file:
```javascript
const systemPrompt = `Your custom system prompt here`;
```

### Typing Speed
Adjust the typing animation speed in `chatbot.js`:
```javascript
await new Promise(resolve => setTimeout(resolve, 10)); // 10ms per character
```

## Step 7: Testing

1. Run the test suite:
   ```bash
   npm test
   ```

2. Manual testing:
   - Test the chat interface
   - Verify message sending/receiving
   - Check error handling
   - Test responsive design

## Step 8: Deployment

### Local Deployment
1. Start the server:
   ```bash
   node src/functions/server.js
   ```
2. Access via `http://localhost:8888` (or your configured PORT)

### Netlify Deployment
1. Ensure `netlify/functions/chat.js` is in place
2. Configure environment variables
3. Deploy your project

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Verify `.env` file exists
   - Check environment variable name
   - Ensure proper file permissions

2. **CORS Errors**
   - Add CORS headers to your server
   - Check API endpoint configuration

3. **Typing Animation Issues**
   - Verify CSS is loaded
   - Check for JavaScript errors
   - Adjust typing speed if needed

### Debug Mode

Enable debug logging in `chatbot.js`:
```javascript
const DEBUG = true;
```

When debug mode is enabled, you'll see:
- Detailed API request/response logs
- DOM event tracking
- State change notifications
- Performance metrics
- Error stack traces

This is particularly useful during:
- Initial setup
- Troubleshooting issues
- Performance optimization
- Testing new features

Remember to disable debug mode in production by setting `DEBUG = false`.

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` file
   - Use environment variables
   - Implement rate limiting

2. **Input Validation**
   - Sanitize user input
   - Implement message length limits
   - Add request validation

3. **Error Handling**
   - Implement proper error messages
   - Log errors securely
   - Handle network issues

## Performance Optimization

1. **Response Time**
   - Adjust typing speed
   - Optimize API calls
   - Cache responses

2. **Resource Usage**
   - Minify CSS/JS
   - Optimize images
   - Implement lazy loading

## Support

For issues and feature requests:
1. Check the troubleshooting guide
2. Search existing issues
3. Create a new issue with:
   - Description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior 