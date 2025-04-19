// const responses = {
//     "hi": ["Hello friend! 👋", "Hi there! Ready to have fun? 🌟", "Hey buddy! How are you? 😊"],
//     "hello": ["Hi there, wonderful to meet you! 🌈", "Hello! I'm your robot friend! 🤖", "Hey! Let's have some fun! 🎈"],
//     "how are you": ["I'm super duper happy! How about you? 😄", "I'm fantastic! Thanks for asking! ⭐", "I'm jumping with joy! 🦘"],
//     "what is your name": ["I'm Buddy the Bot! 🤖", "You can call me Buddy! I love making friends! 🎀", "I'm your friend Buddy! Nice to meet you! 👋"],
//     "bye": ["Goodbye, friend! Come back soon! 👋", "See you later, alligator! 🐊", "Bye bye! Have a wonderful day! 🌞"],
//     "tell me a joke": [
//         "Why don't eggs tell jokes? They'd crack up! 🥚",
//         "What do you call a bear with no teeth? A gummy bear! 🐻",
//         "Why did the cookie go to the doctor? Because it was feeling crumbly! 🍪"
//     ],
//     "default": ["That's interesting! Tell me more! 🎈", "Wow, how cool! 🌟", "Amazing! Let's learn more together! 📚"]
// };

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