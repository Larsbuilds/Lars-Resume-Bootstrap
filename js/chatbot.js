document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatbotButton');
    const chatInterface = document.getElementById('chatInterface');
    const closeButton = document.querySelector('.close-button');
    const chatInput = document.querySelector('.chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    // Clear any existing messages
    chatMessages.innerHTML = '';
    
    // Set initial display state explicitly
    chatInterface.style.display = 'none';

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
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'API request failed');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
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

            try {
                // Get AI response
                const aiResponse = await callChatAPI(userMessage);
                
                // Remove loading indicator
                loadingDiv.remove();
                
                // Add AI response
                addMessage(aiResponse, 'bot');
            } catch (error) {
                loadingDiv.remove();
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender + '-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add initial greeting only once
    addMessage('Hello! I\'m Lars\'s AI assistant. How can I help you today?', 'bot');
}); 