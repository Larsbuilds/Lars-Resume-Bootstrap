// Chat interface configuration
const DEBUG = false;
const TYPING_SPEED = 10; // milliseconds per character

// Determine API endpoint based on environment
const isNetlify = window.location.hostname.includes('netlify.app');
const API_ENDPOINT = isNetlify ? '/.netlify/functions/chat' : 'http://localhost:8888/chat';

// DOM Elements
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');

// Initialize chat interface
function initChat() {
    if (DEBUG) console.log('Initializing chat interface...');
    
    // Set up event listeners
    chatButton.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendMessage.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Add greeting message
    addMessage('bot', 'Hello! How can I help you today?');
}

// Toggle chat window visibility
function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        chatInput.focus();
    }
}

// Handle sending messages
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatInput.value = '';

    try {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.textContent = '...';
        chatMessages.appendChild(typingIndicator);

        // Send message to API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        // Remove typing indicator
        typingIndicator.remove();

        // Get and display bot response
        const data = await response.json();
        addMessage('bot', data.response);
    } catch (error) {
        if (DEBUG) console.error('Error:', error);
        addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

// Add message to chat
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'bot') {
        typeMessage(messageDiv, content);
    } else {
        messageDiv.textContent = content;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Type out message with animation
function typeMessage(element, text) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, TYPING_SPEED);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat); 