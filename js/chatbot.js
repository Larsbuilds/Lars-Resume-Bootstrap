document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatbotButton');
    const chatInterface = document.getElementById('chatInterface');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const closeButton = document.querySelector('.close-button');
    let isChatOpen = false;
    let currentMessageDiv = null;

    // Determine if we're running on Netlify
    const isNetlify = window.location.hostname.includes('netlify.app');
    const API_ENDPOINT = isNetlify ? '/.netlify/functions/chat' : '/api/chat';

    // Initialize chat interface
    if (chatInterface) {
        chatInterface.style.display = 'none';
    }
    if (chatButton) {
        toggleButtonState(false);
    }

    // Add initial greeting if chat messages container exists
    if (chatMessages) {
        addMessage('Hello! I\'m Lars\'s AI assistant. How can I help you today?', 'bot');
    }

    function toggleButtonState(isChat) {
        if (!chatButton) return;
        console.log('Toggling button state:', isChat);
        if (isChat) {
            chatButton.innerHTML = '<i class="fas fa-arrow-circle-up fa-rotate-90"></i>';
        } else {
            chatButton.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    function openChat() {
        if (!chatInterface || !chatInput) return;
        chatInterface.style.display = 'block';
        chatInput.focus();
        toggleButtonState(true);
        isChatOpen = true;
    }

    function closeChat() {
        if (!chatInterface) return;
        chatInterface.style.display = 'none';
        toggleButtonState(false);
        isChatOpen = false;
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = '';
        addMessage(userMessage, 'user');

        // Create a new message div for the bot's response
        const currentMessageDiv = document.createElement('div');
        currentMessageDiv.classList.add('message', 'bot-message', 'typing');
        chatMessages.appendChild(currentMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Remove typing class
            currentMessageDiv.classList.remove('typing');
            
            // Simulate typing animation
            const text = data.content;
            let currentText = '';
            for (let i = 0; i < text.length; i++) {
                currentText += text[i];
                currentMessageDiv.textContent = currentText;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                // Add a small delay for smoother typing effect (10ms = 100 chars/second)
                await new Promise(resolve => setTimeout(resolve, 10));
            }

        } catch (error) {
            console.error('Error:', error);
            currentMessageDiv.classList.remove('typing');
            currentMessageDiv.textContent = 'Sorry, I encountered an error. Please try again.';
        }
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (isChatOpen && chatInterface && !chatInterface.contains(e.target) && !chatButton.contains(e.target)) {
            closeChat();
        }
    });

    // Chat button click handler
    if (chatButton) {
        chatButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (!isChatOpen) {
                openChat();
            } else {
                sendMessage();
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeChat();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender + '-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}); 