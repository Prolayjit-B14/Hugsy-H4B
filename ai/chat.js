// chatbot.js - Main functionality for the special needs chatbot

// Character data
const characters = {
    robot: {
        emoji: "🤖",
        name: "Robo",
        color: "blue",
        greeting: "Hi there! I'm Robo. How can I help you today?"
    },
    girl: {
        emoji: "👧",
        name: "Lisa",
        color: "pink",
        greeting: "Hello friend! I'm Lisa. Let's chat and have fun together!"
    },
    boy: {
        emoji: "👦",
        name: "Max",
        color: "green",
        greeting: "Hey! Max here. What would you like to talk about today?"
    },
    animal: {
        emoji: "🐶",
        name: "Buddy",
        color: "yellow",
        greeting: "Woof! I'm Buddy. I'm excited to be your friend!"
    }
};

// Pre-defined responses for different message types
const responses = {
    greeting: [
        "Hello there! How are you feeling today?",
        "Hi friend! What would you like to talk about?",
        "Hey! I'm so happy to see you! How are you doing?"
    ],
    story: [
        "Once upon a time, there was a brave little star who wanted to explore the universe...",
        "In a magical forest, there lived a friendly dragon who loved to help others...",
        "There was once a tiny robot who discovered they had a very special power - kindness!"
    ],
    game: [
        "Let's play a guessing game! I'm thinking of an animal that lives in the ocean. Can you guess what it is?",
        "How about we play 'I Spy'? I spy with my little eye something that is blue!",
        "Let's play a counting game! Can you count from 1 to 10 with me?"
    ],
    learning: [
        "Did you know that butterflies taste with their feet? What would you like to learn about today?",
        "The Earth is actually not a perfect sphere - it's slightly squished! Would you like to learn more fun facts?",
        "Your brain is more active when you're sleeping than when you're watching TV! What else would you like to know?"
    ]
};

// Store current character
let currentCharacter = characters.robot;

// DOM Elements
const characterOptions = document.querySelectorAll('.character-option');
const characterImage = document.getElementById('character-image');
const characterSpeech = document.getElementById('character-speech');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const voiceButton = document.getElementById('voice-btn');
const chatMessages = document.getElementById('chat-messages');
const quickReplies = document.querySelectorAll('.quick-reply');
const fullscreenButton = document.getElementById('fullscreen-btn');

// Initialize with selected character
updateCharacter('robot');

// Set up event listeners
characterOptions.forEach(option => {
    option.addEventListener('click', () => {
        const character = option.getAttribute('data-character');
        
        // Update selected character UI
        characterOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Update character
        updateCharacter(character);
    });
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

voiceButton.addEventListener('click', () => {
    // Simple placeholder for voice input
    alert("Voice input feature coming soon! This will help kids who prefer speaking over typing.");
});

quickReplies.forEach(button => {
    button.addEventListener('click', () => {
        const text = button.textContent;
        addUserMessage(text);
        setTimeout(() => {
            respondToMessage(text);
        }, 600);
    });
});

fullscreenButton.addEventListener('click', openFullscreenChat);

// Functions
function updateCharacter(characterId) {
    currentCharacter = characters[characterId];
    characterImage.textContent = currentCharacter.emoji;
    characterSpeech.textContent = currentCharacter.greeting;
    
    // Update container color based on character
    const container = document.querySelector('.character-container');
    container.className = `floating character-container bg-${currentCharacter.color}-50 rounded-full w-48 h-48 md:w-64 md:h-64 flex items-center justify-center border-4 border-white shadow-lg`;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    addUserMessage(message);
    messageInput.value = '';
    
    // Simulate typing delay
    setTimeout(() => {
        respondToMessage(message);
    }, 600);
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message mb-4';
    messageElement.innerHTML = `
        <div class="flex items-start justify-end">
            <div class="bg-purple-100 rounded-lg p-3 max-w-xs">
                <p>${escapeHTML(message)}</p>
            </div>
            <div class="bg-purple-500 rounded-full p-2 ml-2">
                <span class="text-2xl">👤</span>
            </div>
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'bot-message mb-4';
    messageElement.innerHTML = `
        <div class="flex items-start">
            <div class="bg-${currentCharacter.color}-100 rounded-full p-2 mr-2">
                <span class="text-2xl">${currentCharacter.emoji}</span>
            </div>
            <div class="bg-${currentCharacter.color}-50 rounded-lg p-3 max-w-xs">
                <p>${message}</p>
            </div>
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Also update speech bubble
    characterSpeech.textContent = message;
}

function respondToMessage(message) {
    message = message.toLowerCase();
    
    // Simple response logic
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addBotMessage(getRandomResponse('greeting'));
    } else if (message.includes('story') || message.includes('tell me a story')) {
        addBotMessage(getRandomResponse('story'));
    } else if (message.includes('game') || message.includes('play')) {
        addBotMessage(getRandomResponse('game'));
    } else if (message.includes('learn') || message.includes('teach')) {
        addBotMessage(getRandomResponse('learning'));
    } else if (message.includes('how are you')) {
        addBotMessage(`I'm doing great! I'm always happy to chat with you. How are you feeling today?`);
    } else {
        // Generic responses for other inputs
        const genericResponses = [
            `That's interesting! Tell me more about that.`,
            `I like talking with you! What else would you like to share?`,
            `That's really cool! Would you like to play a game now?`,
            `Thanks for sharing that with me! Would you like to hear a story?`
        ];
        addBotMessage(genericResponses[Math.floor(Math.random() * genericResponses.length)]);
    }
}

function getRandomResponse(type) {
    const responseArray = responses[type];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fullscreen chat functionality
function openFullscreenChat() {
    // Create a new window for fullscreen chat
    const fullscreenWindow = window.open('', '_blank', 'fullscreen=yes');
    
    // Create the fullscreen HTML content
    fullscreenWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${currentCharacter.name} - Fullscreen Mode</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>
            <style>
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                    100% { transform: translateY(0px); }
                }
                
                .floating {
                    animation: float 4s ease-in-out infinite;
                }
                
                .speech-bubble {
                    position: relative;
                    background: #ffffff;
                    border-radius: 2rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                    max-width: 80%;
                    font-size: 1.5rem;
                }
                
                .speech-bubble::after {
                    content: '';
                    position: absolute;
                    bottom: -15px;
                    left: 50px;
                    border-width: 15px 15px 0;
                    border-style: solid;
                    border-color: #ffffff transparent;
                }
                
                body {
                    overflow: hidden;
                }
            </style>
        </head>
        <body class="bg-gradient-to-br from-${currentCharacter.color}-100 to-purple-100 min-h-screen flex flex-col items-center justify-center">
            <div class="absolute top-4 right-4">
                <button id="close-btn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition text-lg">
                    Close Fullscreen
                </button>
            </div>
            
            <div class="floating character-container bg-${currentCharacter.color}-50 rounded-full w-64 h-64 md:w-96 md:h-96 flex items-center justify-center border-8 border-white shadow-xl mb-8">
                <div id="character-image" class="text-9xl md:text-huge">${currentCharacter.emoji}</div>
            </div>
            
            <div class="speech-bubble text-center">
                <p id="character-speech" class="text-${currentCharacter.color}-700 text-xl md:text-2xl">
                    ${characterSpeech.textContent}
                </p>
            </div>
            
            <div class="mt-8 flex gap-4">
                <input id="fs-message-input" type="text" placeholder="Type your message here..." 
                    class="px-6 py-4 rounded-full text-xl bg-white border-2 border-${currentCharacter.color}-300 focus:outline-none focus:ring-2 focus:ring-${currentCharacter.color}-500 w-80 md:w-96" />
                <button id="fs-send-btn" class="bg-${currentCharacter.color}-500 hover:bg-${currentCharacter.color}-600 text-white p-4 rounded-full transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </body>
        </html>
    `);
    
    // Set up event listeners for the fullscreen window
    fullscreenWindow.document.getElementById('close-btn').addEventListener('click', () => {
        fullscreenWindow.close();
    });
    
    const fsMessageInput = fullscreenWindow.document.getElementById('fs-message-input');
    const fsSendBtn = fullscreenWindow.document.getElementById('fs-send-btn');
    const fsCharacterSpeech = fullscreenWindow.document.getElementById('character-speech');
    
    fsSendBtn.addEventListener('click', () => {
        const message = fsMessageInput.value.trim();
        if (message === '') return;
        
        // Update in both windows
        fsMessageInput.value = '';
        addUserMessage(message);
        
        // Process response with delay
        setTimeout(() => {
            let response = "";
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = getRandomResponse('greeting');
            } else if (message.toLowerCase().includes('story')) {
                response = getRandomResponse('story');
            } else if (message.toLowerCase().includes('game') || message.toLowerCase().includes('play')) {
                response = getRandomResponse('game');
            } else {
                const genericResponses = [
                    `That's interesting! Tell me more about that.`,
                    `I like talking with you! What else would you like to share?`,
                    `That's really cool! Would you like to play a game now?`,
                    `Thanks for sharing that with me! Would you like to hear a story?`
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
            
            // Update both the main window and fullscreen window
            addBotMessage(response);
            fsCharacterSpeech.textContent = response;
        }, 800);
    });
    
    fsMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fsSendBtn.click();
        }
    });
    
    // Focus on the input field
    fsMessageInput.focus();
}