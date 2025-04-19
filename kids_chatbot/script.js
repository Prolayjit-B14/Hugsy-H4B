const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getBotResponse(input) {
    const lowercaseInput = input.toLowerCase();
    const baseUrl = 'https://hugsy-server.netlify.app/api/'

    const apiResponse = await (await fetch(`${baseUrl}kids?prompt=${lowercaseInput}`)).json();

    if (!apiResponse) {
        return "Oops! Something went wrong. Please try again later! 😅";
    }

    return apiResponse.response
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

        const botResponse = await getBotResponse(message);
        addMessage(botResponse, false);

    }
}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Initial greeting
setTimeout(() => {
    addMessage("Hi! I'm your friendly robot buddy! Want to chat? 🤖✨", false);
}, 500);