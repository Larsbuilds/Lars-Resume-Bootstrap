# LarsBuilds AI Migration

A modular AI chat component with OpenAI integration that can be easily added to any website. This project provides both a local development server and Netlify Functions deployment options.

## Features

- 🤖 OpenAI GPT-3.5 Turbo integration
- 💬 Modern, responsive chat interface
- ⚡ Real-time message handling
- 🎨 Customizable styling
- 🔄 Typing animation
- 🌐 Both local and Netlify deployment options
- 📱 Mobile-friendly design
- ♿ Accessibility support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Netlify account (for deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/larsbuilds-ai-migration.git
cd larsbuilds-ai-migration
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_api_key_here
PORT=8888  # Optional, defaults to 8888
```

## Usage

### Local Development

1. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:8888 by default. You can change the port by setting the PORT environment variable.

2. Open `example.html` in your browser to see the chat component in action.

### Netlify Deployment

1. Create a new Netlify site and connect it to your repository.

2. Add the following environment variables in your Netlify dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

3. Deploy your site!

## Integration Guide

1. Copy the following files to your project:
   - `src/js/chatbot.js`
   - `src/css/futuristic.css`

2. Add the HTML structure to your page:
```html
<!-- Chat Button -->
<button id="chat-button" aria-label="Open chat">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
    </svg>
</button>

<!-- Chat Window -->
<div id="chat-window" class="hidden">
    <div id="chat-header">
        <h3>AI Assistant</h3>
        <button id="close-chat" aria-label="Close chat">×</button>
    </div>
    <div id="chat-messages"></div>
    <div id="chat-input-container">
        <input type="text" id="chat-input" placeholder="Type your message..." aria-label="Chat input">
        <button id="send-message" aria-label="Send message">Send</button>
    </div>
</div>
```

3. Link the CSS and JavaScript files:
```html
<link rel="stylesheet" href="path/to/futuristic.css">
<script src="path/to/chatbot.js"></script>
```

## Customization

### Styling

The chat interface can be customized by modifying the CSS variables in `futuristic.css`. Key customization points include:

- Colors
- Sizes
- Animations
- Typography

### Configuration

The chat behavior can be configured by modifying the constants in `chatbot.js`:

- `DEBUG`: Enable/disable debug logging (set to `true` for detailed console output)
- `TYPING_SPEED`: Adjust the typing animation speed
- `API_ENDPOINT`: Change the API endpoint

### Debug Mode

To enable debug mode, set `DEBUG = true` in `chatbot.js`. This will:
- Log all API requests and responses
- Show detailed error messages
- Display timing information
- Log DOM events and state changes

Debug mode is useful during development and troubleshooting.

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- OpenAI for providing the GPT-3.5 Turbo API
- Netlify for their excellent serverless functions platform
- The open-source community for inspiration and tools 