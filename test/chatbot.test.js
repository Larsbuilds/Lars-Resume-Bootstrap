/**
 * @jest-environment jsdom
 */

// Mock fetch
global.fetch = jest.fn();

// Mock DOM elements
document.body.innerHTML = `
  <button id="chatbotButton"><i class="fas fa-robot"></i></button>
  <div id="chatInterface" style="display: none;">
    <div class="chat-header">
      <span>Chat with Lars's AI</span>
      <button class="close-button">&times;</button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-area">
      <input type="text" class="chat-input" placeholder="Type your message...">
    </div>
  </div>
`;

// Import the chatbot script
require('../js/chatbot.js');

describe('Chatbot UI Tests', () => {
    beforeEach(() => {
        // Set up the DOM
        document.body.innerHTML = `
            <button id="chat-button" class="chat-button">
                <i class="fas fa-comments"></i>
            </button>
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
        `;

        // Load the chatbot script
        require('../src/js/chatbot.js');
    });

    test('Chat window should be hidden initially', () => {
        const chatWindow = document.getElementById('chat-window');
        expect(chatWindow.classList.contains('active')).toBeFalsy();
    });

    test('Chat button should toggle chat window', () => {
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');

        chatButton.click();
        expect(chatWindow.classList.contains('active')).toBeTruthy();

        chatButton.click();
        expect(chatWindow.classList.contains('active')).toBeFalsy();
    });

    test('Close button should hide chat window', () => {
        const chatButton = document.getElementById('chat-button');
        const closeButton = document.getElementById('close-chat');
        const chatWindow = document.getElementById('chat-window');

        chatButton.click();
        expect(chatWindow.classList.contains('active')).toBeTruthy();

        closeButton.click();
        expect(chatWindow.classList.contains('active')).toBeFalsy();
    });

    test('Should add greeting message on initialization', () => {
        const chatMessages = document.getElementById('chat-messages');
        expect(chatMessages.children.length).toBe(1);
        expect(chatMessages.children[0].textContent).toContain('Hello! How can I help you today?');
    });

    test('Should handle empty message input', () => {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const chatMessages = document.getElementById('chat-messages');

        const initialMessageCount = chatMessages.children.length;
        chatInput.value = '   ';
        sendButton.click();

        expect(chatMessages.children.length).toBe(initialMessageCount);
    });

    test('Should add user message to chat', () => {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const chatMessages = document.getElementById('chat-messages');

        const initialMessageCount = chatMessages.children.length;
        chatInput.value = 'Test message';
        sendButton.click();

        expect(chatMessages.children.length).toBe(initialMessageCount + 1);
        expect(chatMessages.lastElementChild.textContent).toBe('Test message');
        expect(chatMessages.lastElementChild.classList.contains('user')).toBeTruthy();
    });

    test('Should handle Enter key in input', () => {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        const initialMessageCount = chatMessages.children.length;
        chatInput.value = 'Test message';
        chatInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));

        expect(chatMessages.children.length).toBe(initialMessageCount + 1);
        expect(chatMessages.lastElementChild.textContent).toBe('Test message');
    });

    test('Should clear input after sending message', () => {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');

        chatInput.value = 'Test message';
        sendButton.click();

        expect(chatInput.value).toBe('');
    });
}); 