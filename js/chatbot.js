document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatbotButton');
    const chatInterface = document.getElementById('chatInterface');
    const closeButton = document.querySelector('.close-button');
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    chatButton.addEventListener('click', () => {
        chatInterface.style.display = chatInterface.style.display === 'none' ? 'block' : 'none';
        if (chatInterface.style.display === 'block') {
            chatInput.focus();
        }
    });

    closeButton.addEventListener('click', () => {
        chatInterface.style.display = 'none';
    });

    async function callChatAPI(message) {
        try {
            console.log('1. Sending message:', message);
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            console.log('2. Raw response:', response);

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            console.log('3. Parsed response:', data);
            
            return data.response;
        } catch (error) {
            console.error('4. Error:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    chatInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const userMessage = chatInput.value.trim();
            chatInput.value = '';
            
            // Add user message
            addMessage(userMessage, 'user');
            
            // Add loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('message', 'bot-message', 'loading');
            loadingDiv.textContent = 'Thinking...';
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Get AI response
            const aiResponse = await callChatAPI(userMessage);
            
            // Remove loading indicator
            loadingDiv.remove();
            
            // Add AI response
            addMessage(aiResponse, 'bot');
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender + '-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add initial greeting
    addMessage('Hello! I\'m Lars\'s AI assistant. How can I help you today?', 'bot');
}); 