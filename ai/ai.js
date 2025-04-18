document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        robot: document.getElementById('robot'),
        robotHead: document.querySelector('.robot-head'),
        robotMouth: document.querySelector('.robot-mouth'),
        chatBox: document.getElementById('chat-box'),
        closeChat: document.getElementById('close-chat'),
        fullSize: document.getElementById('full-size'),
        messageInput: document.getElementById('message-input'),
        sendButton: document.getElementById('send-button'),
        chatMessages: document.getElementById('chat-messages'),
        helpButton: document.getElementById('help-button'),
        helpPanel: document.getElementById('help-panel'),
        helpCloseBtn: document.getElementById('help-close-btn'),
        moodButton: document.getElementById('mood-button'),
        moodSelector: document.getElementById('mood-selector'),
        moodOptions: document.querySelectorAll('.mood-option'),
        emojiButton: document.getElementById('emoji-button'),
        changeRobotBtn: document.getElementById('change-robot-btn'),
        robotModelSelector: document.getElementById('robot-model-selector'),
        modelOptions: document.querySelectorAll('.model-option')
    };
    
    // State variables
    const state = {
        botMood: 'friendly',
        botTalking: false,
        isFullSize: false,
        darkMode: localStorage.getItem('darkMode') === 'true' || false,
        chatOpen: false,
        currentRobotColor: localStorage.getItem('robotColor') || '#4a90e2'
    };
    
    // Bot response database
    const botResponses = {
        friendly: [
            "Hi there! How can I help you today?",
            "It's okay to feel distracted sometimes. Want to try a quick focus game?",
            "Remember to take breaks when you need them!",
            "Great job! You're doing awesome!",
            "I can help you organize your thoughts. Want to make a list together?",
            "Let's break this big task into smaller steps, okay?",
            "It's normal to feel frustrated sometimes. Let's take a deep breath together.",
            "You're not alone - I'm here to help you anytime!"
        ],
        happy: [
            "Hello! 😄 I'm so excited to chat with you today!",
            "Yay! I love helping with schoolwork! What are we learning today?",
            "That's awesome! You're doing great!",
            "Let's make learning super fun today!",
            "I'm so happy we're chatting today! What would you like to do?"
        ],
        curious: [
            "Hmm, that's interesting! Can you tell me more?",
            "I wonder what would happen if we tried a different approach?",
            "That makes me curious! Let's explore this topic together.",
            "I'm interested in learning more about what you're working on!",
            "What else do you know about this? Let's discover together!"
        ],
        excited: [
            "WOW! That's SUPER cool! 🚀",
            "I'm SO excited to help with this project!",
            "This is going to be AMAZING! Let's get started!",
            "I can't wait to see what we create together!",
            "This is my favorite thing to talk about! Let's dive in!"
        ],
        calm: [
            "Let's take a moment to think about this calmly.",
            "We can work through this step by step, no rush.",
            "Taking our time is perfectly fine. What's the first small step?",
            "Let's create a peaceful space to focus. Take a deep breath first.",
            "You're doing well. Let's continue at a comfortable pace."
        ]
    };

    // ADHD-focused responses and strategies
    const adhdResponses = {
        focus: [
            "Let's try the Pomodoro technique: 20 minutes of work, then a 5-minute break. I'll keep track of time for you!",
            "How about we create a checklist for this task? Breaking it down makes it easier to focus on one piece at a time.",
            "Try the 'body doubling' technique - I'll be your work buddy while you focus on your task!",
            "Would you like to try a quick mindfulness exercise to reset your focus?",
            "Let's make this more interesting! Can we turn this task into a game somehow?"
        ],
        distracted: [
            "I notice you might be getting distracted. Want to try a quick refocusing exercise?",
            "It's okay to get distracted sometimes! Let's use the '5-4-3-2-1' grounding technique: name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.",
            "Let's try setting a timer for just 5 minutes of focused work. You can do anything for 5 minutes!",
            "How about we change environments? Sometimes a new space helps restart focus.",
            "What if we add some background noise or music to help you concentrate?"
        ],
        overwhelmed: [
            "Let's pause and break this down into tiny steps. What's the smallest possible first step?",
            "It's completely okay to feel overwhelmed. Let's take a deep breath together first.",
            "Would it help to draw or sketch out what we're trying to do before we start?",
            "Let's prioritize - what's the most important part we need to focus on first?",
            "How about we set a 10-minute timer and just do what we can in that time? No pressure!"
        ],
        success: [
            "You did it! Your brain worked really hard on that - let's celebrate this win!",
            "Amazing job staying with that task! What reward would feel good right now?",
            "I noticed how you pushed through even when it was challenging. That's real strength!",
            "You're building your focus muscles! Each time you practice, they get stronger.",
            "That was awesome! Your persistence is incredibly impressive!"
        ]
    };

    // Keywords to identify potential ADHD support needs
    const adhdKeywords = {
        focus: ["can't focus", "distracted", "focusing", "concentrate", "attention", "mind wandering", "zoning out"],
        distracted: ["distracted", "lost track", "forgot what", "sidetracked", "rabbit hole", "squirrel", "off task"],
        overwhelmed: ["overwhelmed", "too much", "don't know where to start", "complicated", "confused", "stuck", "frozen"],
        success: ["finished", "completed", "did it", "done", "figured out", "solved"]
    };

    // Learning resources specifically tailored for ADHD
    const adhdResources = [
        {
            type: "focus",
            title: "Body Doubling",
            description: "I can be your virtual body double! When you work on a task, tell me what you're doing and I'll check in with you."
        },
        {
            type: "focus",
            title: "Pomodoro Timer",
            description: "Let me set a timer for you: 25 minutes of focus, then a 5-minute break."
        },
        {
            type: "organization",
            title: "Task Breakdown",
            description: "Tell me what you need to do, and I'll help break it into smaller steps."
        },
        {
            type: "motivation",
            title: "Reward System",
            description: "Let's create a personal reward system for completing tasks!"
        },
        {
            type: "sensory",
            title: "Fidget Activities",
            description: "Need to move while thinking? I can suggest fidget-friendly activities that won't distract from your work."
        }
    ];

    // Fun facts about ADHD and brain function
    const funFacts = [
        "Your brain uses about 20% of all the oxygen you breathe!",
        "Many people with ADHD experience 'hyperfocus' - an intense state of concentration that can be very productive!",
        "The word 'ADHD' stands for Attention-Deficit/Hyperactivity Disorder, but many scientists now think of it as more about managing attention rather than having a deficit!",
        "Many famous inventors, artists, and scientists had ADHD traits, including Thomas Edison and Albert Einstein!",
        "The human brain has about 86 billion neurons - that's more than 10 times the number of people on Earth!",
        "People with ADHD often have incredible creativity and can think 'outside the box'!",
        "ADHD brains may have different dopamine processing, which affects motivation and reward systems.",
        "Exercise has been shown to help improve focus and attention for many people with ADHD.",
        "Using different colors for organization can help ADHD brains process information more effectively.",
        "Many people with ADHD experience 'time blindness' - difficulty estimating how long tasks will take."
    ];

    // Games to help with focus
    const focusGames = [
        {
            name: "Category Sprint",
            instructions: "I'll give you a category and you list as many items in that category as you can in 30 seconds. Ready? Category: Animals that start with B!"
        },
        {
            name: "Alphabet Challenge",
            instructions: "Let's go through the alphabet! I'll give you a category, and you need to name something from that category for each letter of the alphabet. Category: Foods!"
        },
        {
            name: "Word Chain",
            instructions: "I'll say a word, and you respond with a word that starts with the last letter of my word. Then I'll continue with a word starting with the last letter of your word. Let's start with: Rainbow"
        },
        {
            name: "Mental Math",
            instructions: "Let's exercise your brain with some mental math! I'll give you a problem, and you solve it without writing it down. First one: 23 + 18 = ?"
        },
        {
            name: "Memory Challenge",
            instructions: "I'll list 5 items, and you try to memorize them. Then I'll ask you to recall them in order. Ready? Remember: book, apple, guitar, elephant, lamp"
        }
    ];

    // Initialize the application
    function init() {
        setRobotColor(state.currentRobotColor);
        setupEventListeners();
        checkDarkMode();
        
        // Start with the bot closed
        elements.chatBox.classList.add('hidden');
    }

    function setupEventListeners() {
        // Robot click to open chat
        elements.robot.addEventListener('click', toggleChat);
        
        // Chat controls
        elements.closeChat.addEventListener('click', closeChat);
        elements.fullSize.addEventListener('click', toggleFullSize);
        elements.sendButton.addEventListener('click', handleUserMessage);
        elements.messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
        
        // Help panel
        elements.helpButton.addEventListener('click', toggleHelpPanel);
        elements.helpCloseBtn.addEventListener('click', toggleHelpPanel);
        
        // Mood selector
        elements.moodButton.addEventListener('click', toggleMoodSelector);
        elements.moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                changeRobotMood(this.getAttribute('data-mood'));
                toggleMoodSelector();
            });
        });
        
        // Robot model change
        elements.changeRobotBtn.addEventListener('click', toggleModelSelector);
        elements.modelOptions.forEach(option => {
            option.addEventListener('click', function() {
                changeRobotColor(this.getAttribute('data-color'));
                toggleModelSelector();
            });
        });
        
        // Close dropdowns when clicking elsewhere
        document.addEventListener('click', function(event) {
            if (!elements.moodButton.contains(event.target) && !elements.moodSelector.contains(event.target)) {
                elements.moodSelector.classList.add('hidden');
            }
            
            if (!elements.changeRobotBtn.contains(event.target) && !elements.robotModelSelector.contains(event.target)) {
                elements.robotModelSelector.classList.add('hidden');
            }
        });
        
        // Emoji button
        elements.emojiButton.addEventListener('click', insertEmoji);
        
        // Dark mode toggle
        document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    }

    function toggleChat() {
        if (state.chatOpen) {
            closeChat();
        } else {
            elements.chatBox.classList.remove('hidden');
            state.chatOpen = true;
            // Send greeting if this is the first time opening
            if (elements.chatMessages.children.length === 0) {
                setTimeout(() => {
                    sendBotMessage(getRandomResponse());
                }, 500);
            }
        }
    }

    function closeChat() {
        elements.chatBox.classList.add('hidden');
        state.chatOpen = false;
    }

    function toggleFullSize() {
        elements.chatBox.classList.toggle('full-size');
        state.isFullSize = !state.isFullSize;
        elements.fullSize.innerHTML = state.isFullSize ? '↓' : '↑';
    }

    function handleUserMessage() {
        const message = elements.messageInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        elements.messageInput.value = '';
        
        // Process message for keywords
        setTimeout(() => {
            processBotResponse(message);
        }, 1000);
    }

    function processBotResponse(userMessage) {
        // Check for ADHD-related keywords
        let responseType = null;
        let keywords = {};
        
        for (const [type, words] of Object.entries(adhdKeywords)) {
            if (words.some(word => userMessage.toLowerCase().includes(word.toLowerCase()))) {
                responseType = type;
                keywords[type] = true;
            }
        }
        
        // Determine response based on keywords
        let botMessage = '';
        
        if (responseType) {
            botMessage = getRandomItem(adhdResponses[responseType]);
        } else if (userMessage.toLowerCase().includes('game') || userMessage.toLowerCase().includes('bored')) {
            const game = getRandomItem(focusGames);
            botMessage = `Let's play ${game.name}! ${game.instructions}`;
        } else if (userMessage.toLowerCase().includes('fact') || userMessage.toLowerCase().includes('tell me something')) {
            botMessage = getRandomItem(funFacts);
        } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('resource')) {
            const resource = getRandomItem(adhdResources);
            botMessage = `Here's a helpful strategy: **${resource.title}** - ${resource.description}`;
        } else {
            botMessage = getRandomResponse();
        }
        
        sendBotMessage(botMessage);
    }

    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // Convert markdown-style formatting
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        messageDiv.innerHTML = formattedText;
        elements.chatMessages.appendChild(messageDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    function sendBotMessage(message) {
        animateBotTalking().then(() => {
            addMessageToChat('bot', message);
        });
    }

    function animateBotTalking() {
        state.botTalking = true;
        elements.robotMouth.classList.add('talking');
        
        // Random talking duration between 1-2 seconds
        const talkingDuration = 1000 + Math.random() * 1000;
        
        return new Promise(resolve => {
            setTimeout(() => {
                elements.robotMouth.classList.remove('talking');
                state.botTalking = false;
                resolve();
            }, talkingDuration);
        });
    }

    function getRandomResponse() {
        const responses = botResponses[state.botMood];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function toggleHelpPanel() {
        elements.helpPanel.classList.toggle('hidden');
    }

    function toggleMoodSelector() {
        elements.moodSelector.classList.toggle('hidden');
        elements.robotModelSelector.classList.add('hidden'); // Hide other dropdown
    }

    function toggleModelSelector() {
        elements.robotModelSelector.classList.toggle('hidden');
        elements.moodSelector.classList.add('hidden'); // Hide other dropdown
    }

    function changeRobotMood(mood) {
        state.botMood = mood;
        
        // Visual feedback that the mood changed
        elements.robotHead.classList.add('mood-change');
        setTimeout(() => {
            elements.robotHead.classList.remove('mood-change');
        }, 500);
        
        // Send message about new mood
        const moodMessages = {
            'friendly': "I'm feeling friendly and helpful now!",
            'happy': "I'm super happy now! 😄",
            'curious': "I'm feeling curious and inquisitive!",
            'excited': "WOW! I'm SO excited now!",
            'calm': "I'm feeling calm and centered now."
        };
        
        sendBotMessage(moodMessages[mood]);
    }

    function changeRobotColor(color) {
        setRobotColor(color);
        state.currentRobotColor = color;
        localStorage.setItem('robotColor', color);
    }

    function setRobotColor(color) {
        document.documentElement.style.setProperty('--robot-color', color);
    }

    function insertEmoji() {
        const emojis = ["😊", "👍", "🎮", "🚀", "⭐", "🔍", "📝", "🧠", "🎯", "✨"];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        elements.messageInput.value += emoji;
        elements.messageInput.focus();
    }

    function toggleDarkMode() {
        state.darkMode = !state.darkMode;
        localStorage.setItem('darkMode', state.darkMode);
        checkDarkMode();
    }

    function checkDarkMode() {
        if (state.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Populate help panel with ADHD resources
    function populateHelpPanel() {
        const resourceList = document.getElementById('resource-list');
        adhdResources.forEach(resource => {
            const item = document.createElement('div');
            item.classList.add('help-item');
            item.innerHTML = `<h4>${resource.title}</h4><p>${resource.description}</p>`;
            resourceList.appendChild(item);
        });
        
        // Add fun facts section
        const factsContainer = document.getElementById('fun-facts');
        const randomFact = getRandomItem(funFacts);
        factsContainer.innerHTML = `<h3>Fun Fact</h3><p>${randomFact}</p>`;
        
        // Add button to show new fact
        const newFactBtn = document.createElement('button');
        newFactBtn.innerText = "New Fun Fact";
        newFactBtn.addEventListener('click', () => {
            factsContainer.querySelector('p').innerText = getRandomItem(funFacts);
        });
        factsContainer.appendChild(newFactBtn);
    }

    // Initialize when DOM is ready
    populateHelpPanel();
    init();
});