document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chatbotButton');
    const chatInterface = document.getElementById('chatInterface');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const closeButton = document.querySelector('.close-button');
    let isChatOpen = false;

    // Set initial state
    chatInterface.style.display = 'none';
    toggleButtonState(false);

    // Add initial greeting
    addMessage('Hello! I\'m Lars\'s AI assistant. How can I help you today?', 'bot');

    function toggleButtonState(isChat) {
        console.log('Toggling button state:', isChat); // Debug log
        if (isChat) {
            chatButton.innerHTML = '<i class="fas fa-arrow-circle-up fa-rotate-90"></i>';
        } else {
            chatButton.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    function openChat() {
        chatInterface.style.display = 'block';
        chatInput.focus();
        toggleButtonState(true);
        isChatOpen = true;
    }

    function closeChat() {
        chatInterface.style.display = 'none';
        toggleButtonState(false);
        isChatOpen = false;
    }

    async function callChatAPI(message) {
        try {
            console.log('Sending request to chat API...');
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'API request failed');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            throw error; // Let the sendMessage function handle the error
        }
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = '';
        addMessage(userMessage, 'user');
        
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message', 'loading');
        loadingDiv.textContent = 'Thinking...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const aiResponse = await callChatAPI(userMessage);
            loadingDiv.remove();
            addMessage(aiResponse, 'bot');
        } catch (error) {
            loadingDiv.remove();
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (isChatOpen && !chatInterface.contains(e.target) && !chatButton.contains(e.target)) {
            closeChat();
        }
    });

    // Chat button click handler
    chatButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!isChatOpen) {
            openChat();
        } else {
            sendMessage();
        }
    });

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeChat();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender + '-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}); 