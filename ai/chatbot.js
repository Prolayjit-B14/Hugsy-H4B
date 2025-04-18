// FriendlyBot - Special Needs Chatbot
// JavaScript for handling bot interactions, animations, and special features

// DOM Elements
const robotContainer = document.querySelector('.robot-container');
const robotModelSelector = document.getElementById('robot-model-selector');
const modelOptions = document.querySelectorAll('.model-option');
const robot = document.getElementById('robot');
const chatBox = document.getElementById('chat-box');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const emojiButton = document.getElementById('emoji-button');
const changeRobotBtn = document.getElementById('change-robot-btn');
const helpButton = document.getElementById('help-button');
const helpPanel = document.getElementById('help-panel');
const helpCloseBtn = document.getElementById('help-close-btn');
const moodButton = document.getElementById('mood-button');
const moodSelector = document.getElementById('mood-selector');
const moodOptions = document.querySelectorAll('.mood-option');
const fullSizeButton = document.getElementById('full-size');
const closeChat = document.getElementById('close-chat');
const quickResponses = document.querySelectorAll('.quick-response');

// Bot configuration
let botConfig = {
    name: 'Robo Blue',
    mood: 'friendly',
    theme: 'theme-blue',
    color: '#4a90e2',
    model: 'robo-blue'
};

// Response database - organized by categories to help kids with ADHD/neurodevelopmental disorders
const responses = {
    greetings: [
        "Hi there! I'm {name}. How can I help you today?",
        "Hello! I'm {name}. It's great to see you!",
        "Hey friend! I'm {name}. Ready to chat?",
        "Hi! I'm {name}. What would you like to do today?"
    ],
    
    focus: [
        "Let's try to focus together! How about we set a timer for 10 minutes and work on one thing?",
        "When you're having trouble focusing, try breaking your task into smaller steps. What are you working on?",
        "Here's a focusing trick: take 3 deep breaths, then pick ONE thing to work on. Want to try?",
        "Sometimes colors help us focus. Try changing my color to something that helps you concentrate!"
    ],
    
    break: [
        "Taking breaks is important! Let's do a quick stretch. Stand up and reach for the sky!",
        "Break time! How about we count to 20 together, then go back to work?",
        "Let's take a mini-break! Close your eyes and take 5 deep breaths.",
        "Break time is good for your brain! Let's do a quick game before getting back to work."
    ],
    
    games: [
        "Let's play a simple memory game! I'll start: I'm going on a picnic and I'm bringing Apples. Can you repeat and add something with B?",
        "How about we play I Spy? I spy something with my robot eyes that is... blue! Can you guess?",
        "Let's play a counting game! I'll say a number, and you say the next one. I'll start: 1",
        "Want to play a word game? Say a word that starts with the last letter of my word. My word is 'robot'!"
    ],
    
    stories: [
        "Once upon a time, there was a friendly robot who loved to help children learn and grow...",
        "In a magical garden lived a special butterfly who could help people remember things when they got distracted...",
        "Deep in the forest, there was a clever fox who discovered a secret way to stay focused on important tasks...",
        "High above the clouds, a brave little bird built amazing nests by taking one small step at a time..."
    ],
    
    breathing: [
        "Let's do a calming exercise. Watch as I grow and shrink. Breathe in when I grow, out when I shrink.",
        "Time for a breathing break! Breathe in for 4 counts, hold for 4 counts, and breathe out for 4 counts.",
        "Let's practice belly breathing. Put your hand on your tummy and feel it rise when you breathe in.",
        "Breathing helps your brain! Let's breathe in like we're smelling a flower, and out like we're blowing a pinwheel."
    ],
    
    encouragement: [
        "You're doing great! Remember, progress is progress, no matter how small.",
        "I believe in you! Your brain works in amazing ways.",
        "Keep going! Even when it's hard, you're getting stronger.",
        "You should be proud of yourself for trying. That's what really matters!"
    ],
    
    timer: [
        "I'll start a timer for you. Let's focus for {time} minutes, then take a break!",
        "Timer set for {time} minutes! I'll let you know when time's up.",
        "Ready, set, focus! I've started a {time} minute timer for you.",
        "{time} minute timer starting now. You can do this!"
    ],
    
    fallback: [
        "I'm not sure I understood. Can you tell me again what you need help with?",
        "My robot brain is still learning. Can you try asking in a different way?",
        "Hmm, I'm not sure about that. Would you like to try one of our activities instead?",
        "I want to help, but I'm not understanding. Can you choose one of the quick responses below?"
    ]
};

// Initialize the bot
function initBot() {
    // Add initial bot message
    addBotMessage(getRandomResponse('greetings'));
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up robot animation
    animateRobotEyes();
}

// Set up all event listeners
function setupEventListeners() {
    // Send message on button click
    sendButton.addEventListener('click', handleSendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Toggle robot model selector
    changeRobotBtn.addEventListener('click', () => {
        robotModelSelector.classList.toggle('active');
    });
    
    // Handle robot model selection
    modelOptions.forEach(option => {
        option.addEventListener('click', () => {
            const model = option.getAttribute('data-model');
            const color = option.getAttribute('data-color');
            const theme = option.getAttribute('data-theme');
            const name = option.querySelector('span').textContent;
            
            // Update bot configuration
            botConfig.model = model;
            botConfig.color = color;
            botConfig.name = name;
            
            // Update UI
            robotContainer.className = `robot-container ${theme}`;
            
            // Update robot appearance based on model
            updateRobotAppearance(model);
            
            // Close model selector
            robotModelSelector.classList.remove('active');
            
            // Add bot message about changing appearance
            addBotMessage(`I've changed to ${name}! How do you like my new look?`);
            
            // Mark the selected option
            modelOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Toggle help panel
    helpButton.addEventListener('click', () => {
        helpPanel.classList.toggle('active');
        // Close other panels
        moodSelector.classList.remove('active');
        robotModelSelector.classList.remove('active');
    });
    
    // Close help panel
    helpCloseBtn.addEventListener('click', () => {
        helpPanel.classList.remove('active');
    });
    
    // Toggle mood selector
    moodButton.addEventListener('click', () => {
        moodSelector.classList.toggle('active');
        // Close other panels
        helpPanel.classList.remove('active');
        robotModelSelector.classList.remove('active');
    });
    
    // Handle mood selection
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mood = option.getAttribute('data-mood');
            botConfig.mood = mood;
            
            // Update robot expression
            updateRobotMood(mood);
            
            // Close mood selector
            moodSelector.classList.remove('active');
            
            // Add bot message about changing mood
            addBotMessage(`I'm feeling ${mood} now! How are you feeling?`);
        });
    });
    
    // Full screen mode
    fullSizeButton.addEventListener('click', () => {
        // Create fullscreen container
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fullscreen-container';
        
        // Clone the robot and chat box
        const robotClone = robot.cloneNode(true);
        const chatBoxClone = chatBox.cloneNode(true);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'control-btn absolute top-5 right-5 bg-white text-gray-800 rounded-full p-2';
        closeButton.innerHTML = '<i class="fa fa-times"></i>';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(fullscreenContainer);
        });
        
        // Append elements to fullscreen container
        fullscreenContainer.appendChild(robotClone);
        fullscreenContainer.appendChild(chatBoxClone);
        fullscreenContainer.appendChild(closeButton);
        
        // Add to body
        document.body.appendChild(fullscreenContainer);
    });
    
    // Close chat
    closeChat.addEventListener('click', () => {
        // Minimize the chat box
        chatBox.style.height = '50px';
        chatBox.style.overflow = 'hidden';
        
        // Create restore button
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'absolute bottom-5 right-5 bg-blue-500 text-white rounded-full p-3';
        restoreBtn.innerHTML = '<i class="fa fa-comment"></i>';
        restoreBtn.addEventListener('click', () => {
            chatBox.style.height = '';
            chatBox.style.overflow = '';
            document.body.removeChild(restoreBtn);
        });
        
        document.body.appendChild(restoreBtn);
    });
    
    // Quick response buttons
    quickResponses.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent;
            messageInput.value = text;
            handleSendMessage();
        });
    });
    
    // Emoji button
    emojiButton.addEventListener('click', () => {
        // Simple emoji picker (in a real app, you'd use a library)
        const emojis = ["😊", "😄", "🙂", "👍", "❤️", "👋", "🎮", "🎯", "📚", "🧩"];
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'absolute bottom-16 bg-white rounded-lg p-2 shadow-lg';
        emojiPicker.style.display = 'flex';
        emojiPicker.style.flexWrap = 'wrap';
        emojiPicker.style.width = '150px';
        
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'p-1 text-xl cursor-pointer hover:bg-gray-100 rounded';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                messageInput.value += emoji;
                document.body.removeChild(emojiPicker);
            });
            emojiPicker.appendChild(emojiBtn);
        });
        
        // Position next to emoji button
        const rect = emojiButton.getBoundingClientRect();
        emojiPicker.style.left = `${rect.left}px`;
        
        // Close when clicking outside
        document.addEventListener('click', function hideEmojiPicker(e) {
            if (!emojiPicker.contains(e.target) && e.target !== emojiButton) {
                if (document.body.contains(emojiPicker)) {
                    document.body.removeChild(emojiPicker);
                }
                document.removeEventListener('click', hideEmojiPicker);
            }
        });
        
        document.body.appendChild(emojiPicker);
    });
}

// Handle sending a message
function handleSendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input field
    messageInput.value = '';
    
    // Make robot talk animation
    animateRobotTalking();
    
    // Process message and get bot response after a short delay
    setTimeout(() => {
        processBotResponse(message);
    }, 600);
}

// Add a user message to the chat
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add a bot message to the chat
function addBotMessage(text) {
    // Replace {name} placeholder with bot's name
    text = text.replace('{name}', botConfig.name);
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Make robot talk while message appears
    animateRobotTalking();
    
    scrollToBottom();
}

// Process user message and generate bot response
function processBotResponse(message) {
    const lowerMsg = message.toLowerCase();
    let response;
    
    // Check message content to determine response category
    if (lowerMsg.includes('focus') || lowerMsg.includes('distract') || lowerMsg.includes('concentrate')) {
        response = getRandomResponse('focus');
    }
    else if (lowerMsg.includes('break') || lowerMsg.includes('rest') || lowerMsg.includes('tired')) {
        response = getRandomResponse('break');
    }
    else if (lowerMsg.includes('game') || lowerMsg.includes('play') || lowerMsg.includes('fun')) {
        response = getRandomResponse('games');
    }
    else if (lowerMsg.includes('story') || lowerMsg.includes('tell me a')) {
        response = getRandomResponse('stories');
    }
    else if (lowerMsg.includes('breath') || lowerMsg.includes('relax') || lowerMsg.includes('calm')) {
        response = getRandomResponse('breathing');
        // Show breathing exercise
        showBreathingExercise();
    }
    else if (lowerMsg.includes('timer') || lowerMsg.includes('set a timer') || lowerMsg.includes('time for')) {
        // Extract time from message or default to 5 minutes
        let time = 5;
        const timeMatch = message.match(/\d+/);
        if (timeMatch) {
            time = parseInt(timeMatch[0]);
        }
        response = getRandomResponse('timer').replace('{time}', time);
        // Start visual timer
        startVisualTimer(time);
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi' || lowerMsg.includes('hey')) {
        response = getRandomResponse('greetings');
    }
    else {
        // Use fallback responses
        response = getRandomResponse('fallback');
    }
    
    // Add the bot's response to the chat
    addBotMessage(response);
}

// Get a random response from the specified category
function getRandomResponse(category) {
    const responseList = responses[category] || responses.fallback;
    const randomIndex = Math.floor(Math.random() * responseList.length);
    return responseList[randomIndex];
}

// Animate robot eyes to follow cursor
function animateRobotEyes() {
    const pupils = document.querySelectorAll('.robot-pupil');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        pupils.forEach(pupil => {
            const rect = pupil.getBoundingClientRect();
            const pupilCenterX = rect.left + rect.width / 2;
            const pupilCenterY = rect.top + rect.height / 2;
            
            // Calculate distance and angle
            const deltaX = mouseX - pupilCenterX;
            const deltaY = mouseY - pupilCenterY;
            
            // Limit movement to 3px in any direction
            const distance = Math.min(3, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
            const angle = Math.atan2(deltaY, deltaX);
            
            // Move pupil
            const moveX = distance * Math.cos(angle);
            const moveY = distance * Math.sin(angle);
            
            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Animate robot talking
function animateRobotTalking() {
    const robotMouth = document.querySelector('.robot-mouth');
    robotMouth.classList.add('talking');
    
    // Stop talking after 2 seconds
    setTimeout(() => {
        robotMouth.classList.remove('talking');
    }, 2000);
}

// Update robot appearance based on selected model
function updateRobotAppearance(model) {
    const robotHead = document.querySelector('.robot-head');
    const robotBody = document.querySelector('.robot-body');
    
    // Remove any existing animal parts
    const existingEars = document.querySelectorAll('.robot-ear');
    existingEars.forEach(ear => ear.remove());
    
    // Reset to default robot appearance
    robotHead.style.borderRadius = '60px 60px 50px 50px';
    
    // Apply specific customizations based on model
    if (model === 'animal-buddy') {
        // Add ears
        const leftEar = document.createElement('div');
        leftEar.className = 'robot-ear left';
        const rightEar = document.createElement('div');
        rightEar.className = 'robot-ear right';
        
        robotHead.appendChild(leftEar);
        robotHead.appendChild(rightEar);
        
        // Adjust head shape
        robotHead.style.borderRadius = '65px 65px 40px 40px';
    }
}

// Update robot mood expression
function updateRobotMood(mood) {
    const robotMouth = document.querySelector('.robot-mouth');
    const robotEyes = document.querySelectorAll('.robot-eye');
    
    // Reset all mood classes
    robotMouth.className = 'robot-mouth';
    
    // Apply mood-specific styles
    switch (mood) {
        case 'happy':
            robotMouth.classList.add('happy');
            break;
        case 'excited':
            robotMouth.classList.add('happy');
            // Make eyes bigger
            robotEyes.forEach(eye => {
                eye.style.height = '30px';
                eye.style.width = '30px';
            });
            break;
        case 'calm':
            // Make eyes smaller
            robotEyes.forEach(eye => {
                eye.style.height = '20px';
                eye.style.width = '20px';
            });
            break;
        default:
            // Reset eye size
            robotEyes.forEach(eye => {
                eye.style.height = '25px';
                eye.style.width = '25px';
            });
    }
}

// Show breathing exercise
function showBreathingExercise() {
    // Create breathing exercise element
    const breathingExercise = document.createElement('div');
    breathingExercise.className = 'breathing-circle';
    breathingExercise.textContent = 'Breathe with me';
    
    // Add to chat messages
    chatMessages.appendChild(breathingExercise);
    scrollToBottom();
    
    // Remove after 60 seconds
    setTimeout(() => {
        if (chatMessages.contains(breathingExercise)) {
            chatMessages.removeChild(breathingExercise);
        }
    }, 60000);
}

// Start visual timer
function startVisualTimer(minutes) {
    // Create timer elements
    const timerContainer = document.createElement('div');
    timerContainer.className = 'visual-timer';
    
    const timerProgress = document.createElement('div');
    timerProgress.className = 'timer-progress';
    
    const timerText = document.createElement('div');
    timerText.className = 'timer-text';
    
    // Add to container
    timerContainer.appendChild(timerProgress);
    timerContainer.appendChild(timerText);
    
    // Add to chat
    chatMessages.appendChild(timerContainer);
    scrollToBottom();
    
    // Calculate total seconds
    const totalSeconds = minutes * 60;
    let secondsRemaining = totalSeconds;
    
    // Update timer every second
    const timerInterval = setInterval(() => {
        secondsRemaining--;
        
        // Update progress bar
        const percentComplete = 100 - ((secondsRemaining / totalSeconds) * 100);
        timerProgress.style.width = `${percentComplete}%`;
        
        // Update text
        const minutesLeft = Math.floor(secondsRemaining / 60);
        const secondsLeft = secondsRemaining % 60;
        timerText.textContent = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
        
        // End timer
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            timerProgress.style.width = '100%';
            timerText.textContent = 'Time's up!';
            
            // Add message
            addBotMessage("Time's up! Great job focusing. Want to take a break now?");
            
            // Remove timer after a delay
            setTimeout(() => {
                if (chatMessages.contains(timerContainer)) {
                    chatMessages.removeChild(timerContainer);
                }
            }, 5000);
        }
    }, 1000);
}

// Scroll chat to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Start the bot when page loads
window.addEventListener('DOMContentLoaded', initBot);