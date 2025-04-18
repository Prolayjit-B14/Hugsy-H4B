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
        currentRobotColor: localStorage.getItem('robotColor') || '#4a90e2',
        currentSession: {
            focusLevel: 5, // 1-10 scale
            taskCompleted: 0,
            currentActivity: null,
            pomoTimer: null,
            breakTimer: null,
            consecutiveFocusPeriods: 0
        },
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || {
            name: "",
            favoriteColor: "",
            interests: [],
            preferredRewards: [],
            difficultSubjects: [],
            assistiveTools: [],
            sensoryPreferences: {
                visual: true,
                audio: true,
                movement: true
            }
        }
    };

    // Enhanced bot responses focused on ADHD/neurodevelopmental support
    const botResponses = {
        friendly: [
            "Hi there! I'm here to help you stay focused and organized today.",
            "Sometimes our brains jump around - that's okay! What would help you focus right now?",
            "Remember: small steps make big progress. What tiny step can we take now?",
            "Your brain works in amazing ways! Need some help organizing your thoughts?",
            "Feeling distracted is normal. Want to try a quick grounding exercise?",
            "Let's break down what you're working on into smaller pieces, okay?",
            "It's okay if things feel overwhelming sometimes. We can tackle this together!",
            "I notice you might need a quick break. Should we do a 2-minute movement activity?"
        ],
        happy: [
            "Hello! 😄 Your unique brain is a superpower!",
            "Yay! I love helping with challenging tasks! What are we working on today?",
            "You're doing great! Remember, progress isn't always a straight line.",
            "Let's make learning work with YOUR brain today!",
            "I'm so happy we're chatting! Sometimes a quick chat helps refocus - what do you need help with?"
        ],
        curious: [
            "I wonder what would work best for your brain right now? Let's experiment!",
            "I'm curious - what strategies have helped you focus in the past?",
            "That's interesting! How does your brain feel when you try to work on this?",
            "I wonder if we could approach this differently to match how your brain likes to work?",
            "What if we tried a visual way to organize these ideas? Would that help your thinking?"
        ],
        excited: [
            "Your brain has AMAZING creative energy! Let's channel it!",
            "I'm SO excited to help you navigate this challenge!",
            "The way your mind connects ideas is INCREDIBLE! Let's use that power!",
            "AWESOME job getting started - that's often the hardest part!",
            "Your attention is like a spotlight - let's shine it exactly where YOU need it right now!"
        ],
        calm: [
            "Let's take a moment to find our focus. Deep breath in... and out...",
            "We can work through this step by step, at exactly the pace that works for you.",
            "Your brain is processing a lot right now. Let's create some calm space.",
            "Sometimes slowing down actually helps us finish faster. What's the smallest first step?",
            "It's okay if focusing feels hard right now. Your brain is doing its best."
        ]
    };

    // Enhanced ADHD-focused responses with evidence-based strategies
    const adhdResponses = {
        focus: [
            "Let's try the Pomodoro technique: 20 minutes of work, then a 5-minute break. I'll keep track of time for you!",
            "Visual timers can help your brain track time better. Want me to start one for you?",
            "Try the 'body doubling' technique - I'll be your work buddy while you focus on your task!",
            "Let's do a quick 'brain dump' - tell me everything on your mind so it's not distracting you.",
            "How about we create a visual checklist with emoji rewards for each completed item?",
            "Let's try 'chunk focusing' - just 5 minutes of concentration, then assess how you're doing.",
            "Research shows background music without lyrics can help some ADHD brains focus. Want to try that?",
            "Let's use the '3-2-1 Focus' method: name 3 things you can see, 2 things you can touch, and 1 goal to focus on right now."
        ],
        distracted: [
            "I notice you might be getting distracted. That's how your brain works sometimes! Want to try a quick refocusing exercise?",
            "Distraction is part of how your amazing brain processes information. Let's try the '5-4-3-2-1' sensory grounding technique.",
            "When distractions happen, it helps to name them. What pulled your attention away?",
            "Let's try setting a visual timer for just 5 minutes of focused work. You can do anything for 5 minutes!",
            "Sometimes changing position helps reset focus. Could you try standing, sitting differently, or moving to another spot?",
            "Let's try the 'red light, green light' attention game - when I say green light, focus hard for 30 seconds!",
            "Your brain might need some sensory input. Could squeezing a stress ball or having something to fidget with help?",
            "Let's take 30 seconds for a quick movement break - jump, spin, or stretch to help reset your focus!"
        ],
        overwhelmed: [
            "When everything feels too big, we need to make it smaller. What's one tiny piece we can start with?",
            "Let's try the 'brain dump' technique - tell me everything that's in your head right now, and we'll organize it together.",
            "Visual organization can help. Let's make a mind map of all the pieces, so your brain can see them.",
            "It's okay to feel overwhelmed. Let's take three deep breaths together first, then find ONE small starting point.",
            "Sometimes our brains freeze when there's too much information. Let's use colors to sort the different parts of this task.",
            "The 'Swiss cheese' method might help - let's poke some holes in this task by doing the easiest parts first.",
            "Your brain might need a sensory break. Let's take 2 minutes to look out the window or stretch before continuing.",
            "Let's use the '1-3-5 rule': choose 1 big thing, 3 medium things, and 5 small things to focus on today."
        ],
        transition: [
            "I notice we might need to switch activities soon. Let's prepare your brain with a 5-minute warning.",
            "Transitions can be tricky! Let's create a quick ritual to help your brain switch gears.",
            "Before we move to something new, let's take a moment to save your work and make a quick note about where to start next time.",
            "Changing activities can be hard for our brains. What would help you switch gears - a stretch, a drink of water, or a quick movement break?",
            "Let's use a visual countdown to prepare for our transition: 5 minutes left, then 2 minutes, then 1 minute."
        ],
        executive_function: [
            "Breaking down this task will help. Let's list every single tiny step, even ones that seem obvious.",
            "Let's create a visual timeline for this project with checkpoints along the way.",
            "Starting can be the hardest part. What's the smallest possible first action that would take less than 2 minutes?",
            "Let's try the 'if-then' planning technique: 'If [situation happens], then I will [specific action].'",
            "Visual reminders can help your brain. Should we create a colorful checklist for these steps?",
            "The '5-minute rule' might help here - commit to just 5 minutes of work, and then decide if you want to continue.",
            "Let's externalize time by setting up visual timers for each phase of this task."
        ],
        emotion_regulation: [
            "It's okay to feel frustrated - your brain is working hard! Let's try naming your feelings on a scale of 1-10.",
            "When emotions feel big, our thinking brain needs help. Let's try a quick calming strategy like square breathing: breathe in for 4, hold for 4, out for 4, hold for 4.",
            "Your brain might need a quick sensory break. Would touching something soft, listening to a favorite sound, or looking at something pleasant help right now?",
            "Let's try the 'name it to tame it' approach. What emotion is strongest right now?",
            "Sometimes our brains get stuck in negative thinking. Can we find three positive things about this situation?",
            "The 'butterfly hug' can help calm your nervous system. Cross your arms over your chest and alternate gentle taps on each shoulder.",
            "Let's use the 'emotion thermometer' - where is your frustration/anxiety/excitement on a scale from 1-10 right now?"
        ],
        success: [
            "You did it! Your brain worked really hard on that - let's celebrate this win!",
            "Amazing job using your focus powers! What reward would feel good right now?",
            "I noticed how you pushed through even when it was challenging. That shows incredible brain strength!",
            "You're building your focus muscles! Each time you practice, your brain gets stronger at this skill.",
            "That was awesome! Neuroscience shows that celebrating small wins helps build motivation for next time.",
            "Your persistence is impressive! Let's take a moment to notice how good it feels to complete something.",
            "High five! Completing tasks releases dopamine in your brain - enjoy that good feeling!",
            "Success! Let's record this win in your victory log so you remember your brain's capabilities!"
        ]
    };

    // Enhanced keywords to identify potential ADHD/neurodevelopmental support needs
    const adhdKeywords = {
        focus: ["can't focus", "distracted", "focusing", "concentrate", "attention", "mind wandering", "zoning out", "spacing out", "daydreaming"],
        distracted: ["distracted", "lost track", "forgot what", "sidetracked", "rabbit hole", "squirrel", "off task", "bouncing", "all over", "can't stop thinking"],
        overwhelmed: ["overwhelmed", "too much", "don't know where to start", "complicated", "confused", "stuck", "frozen", "shutdown", "meltdown", "too big", "too hard"],
        transition: ["change", "switch", "move to", "next thing", "transition", "different activity", "start new", "finish this"],
        executive_function: ["organize", "plan", "schedule", "steps", "process", "remember", "forget", "deadline", "due", "start", "begin", "initiate", "procrastinate"],
        emotion_regulation: ["frustrated", "angry", "upset", "anxious", "nervous", "worried", "stressed", "feelings", "emotions", "calm down", "freaking out"],
        success: ["finished", "completed", "did it", "done", "figured out", "solved", "accomplished", "success", "won", "victory"]
    };

    // Expanded learning resources specifically tailored for ADHD and neurodevelopmental disorders
    const adhdResources = [
        {
            type: "focus",
            title: "Body Doubling",
            description: "I can be your virtual body double! When you work on a task, tell me what you're doing and I'll check in with you."
        },
        {
            type: "focus",
            title: "Pomodoro Timer",
            description: "I can set a timer for you: 25 minutes of focus, then a 5-minute break."
        },
        {
            type: "focus",
            title: "Visual Timer",
            description: "I can help you visualize time passing with a countdown timer."
        },
        {
            type: "organization",
            title: "Task Breakdown",
            description: "Tell me what you need to do, and I'll help break it into smaller steps."
        },
        {
            type: "organization",
            title: "Color Coding System",
            description: "Let's assign colors to different types of tasks to help your brain organize information."
        },
        {
            type: "sensory",
            title: "Sensory Breaks",
            description: "Quick activities to give your brain sensory input: stretching, wall pushes, or deep breathing."
        },
        {
            type: "sensory",
            title: "Fidget Strategies",
            description: "Need to move while thinking? I can suggest fidget-friendly activities that won't distract from your work."
        },
        {
            type: "motivation",
            title: "Reward System",
            description: "Let's create a personal reward system with points for completing tasks!"
        },
        {
            type: "motivation",
            title: "Visual Progress Tracker",
            description: "I can help you track your achievements with a visual chart."
        },
        {
            type: "emotional",
            title: "Emotion Thermometer",
            description: "A tool to help identify and measure your feelings on a scale from 1-10."
        },
        {
            type: "emotional",
            title: "Calming Techniques",
            description: "Quick strategies like square breathing, progressive muscle relaxation, or grounding exercises."
        },
        {
            type: "transition",
            title: "Transition Warnings",
            description: "I can give you countdown notices before it's time to switch activities."
        }
    ];

    // Enhanced fun facts about ADHD, neurodevelopmental conditions, and brain function
    const funFacts = [
        "People with ADHD often have incredible creativity and can think 'outside the box'!",
        "Your brain has about 86 billion neurons - that's more connections than stars in our galaxy!",
        "Many famous inventors, artists, and scientists had ADHD traits, including Thomas Edison and Albert Einstein!",
        "The word 'ADHD' stands for Attention-Deficit/Hyperactivity Disorder, but many scientists now think of it as more about managing attention rather than having a deficit!",
        "ADHD brains may have different dopamine processing, which affects motivation and reward systems.",
        "People with ADHD often experience 'hyperfocus' - an intense state of concentration that can be very productive!",
        "Exercise has been shown to help improve focus and attention for many people with ADHD.",
        "Using different colors for organization can help ADHD brains process information more effectively.",
        "Many people with ADHD experience 'time blindness' - difficulty estimating how long tasks will take.",
        "ADHD brains are often very good at noticing details that others miss!",
        "Some scientists believe ADHD traits helped our ancestors survive as hunters - noticing movement quickly and being ready for action!",
        "Your brain uses about 20% of all the oxygen you breathe!",
        "Fidgeting can actually help some brains focus better by providing just enough extra stimulation!",
        "The front part of your brain (prefrontal cortex) helps with planning and organizing, and it keeps developing until you're about 25 years old!",
        "Multi-sensory learning (using sight, sound, and touch together) can help information stick better in your memory!",
        "Having a neurodevelopmental condition like ADHD means your brain is wired differently - which comes with both challenges AND strengths!"
    ];

    // Enhanced focus games specifically designed for ADHD
    const focusGames = [
        {
            name: "Color Hunt",
            instructions: "Look around you and find 3 things that are red, then 3 things that are blue, then 3 things that are green. This helps train your attention to focus on specific details."
        },
        {
            name: "Category Sprint",
            instructions: "Let's exercise your working memory! I'll give you a category and you list as many items in that category as you can in 30 seconds. Ready? Category: Animals that start with B!"
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
            name: "Stop & Go",
            instructions: "This game helps practice inhibitory control! When I say GREEN, type a fruit. When I say RED, type nothing for 5 seconds. Ready? GREEN!"
        },
        {
            name: "Simon Says Focus",
            instructions: "Only follow my instructions when I start with 'Simon says'. Simon says touch your nose. Clap your hands. Simon says type the word 'focus'."
        },
        {
            name: "Mental Math Challenge",
            instructions: "Let's exercise your brain with some mental math! I'll give you a problem, and you solve it without writing it down. First one: 23 + 18 = ?"
        },
        {
            name: "Memory Challenge",
            instructions: "I'll list 5 items, and you try to memorize them. Then I'll ask you to recall them in order. Ready? Remember: book, apple, guitar, elephant, lamp"
        },
        {
            name: "Visual Detective",
            instructions: "Look at your surroundings for 10 seconds, then close your eyes and try to list 5 specific objects you saw. This builds observational skills and working memory!"
        },
        {
            name: "Emotion Detective",
            instructions: "I'll describe a situation, and you try to identify what emotion someone might feel. Ready? Scenario: Someone just won first place in a competition they worked hard for."
        }
    ];

    // Sensory regulation activities
    const sensoryActivities = [
        {
            name: "Deep Pressure",
            instructions: "Try giving yourself a big bear hug, squeezing your arms tight for 10 seconds, then releasing."
        },
        {
            name: "Wall Pushes", 
            instructions: "Stand facing a wall, place your palms flat against it, and push as hard as you can for 10 seconds."
        },
        {
            name: "Chair Lifts",
            instructions: "While sitting, place your hands on the sides of your chair and try to lift yourself up for 5 seconds."
        },
        {
            name: "Palm Press",
            instructions: "Press your palms together in front of your chest firmly for 10 seconds."
        },
        {
            name: "Finger Taps",
            instructions: "Tap each finger to your thumb, one at a time, then reverse. Try to speed up gradually."
        },
        {
            name: "Visual Focus",
            instructions: "Find something across the room. Focus on it for 10 seconds, then look at something very close for 10 seconds."
        },
        {
            name: "Cross-Body Movement",
            instructions: "Touch your right hand to your left knee, then left hand to right knee. Repeat 10 times."
        }
    ];

    // Breathing exercises for emotional regulation
    const breathingExercises = [
        {
            name: "Square Breathing",
            instructions: "Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat 4 times."
        },
        {
            name: "Balloon Breathing",
            instructions: "Imagine your belly is a balloon. Breathe in through your nose, making the balloon bigger. Then slowly let the air out through your mouth."
        },
        {
            name: "5-Finger Breathing",
            instructions: "Hold up one hand. Trace up each finger with the index finger of your other hand as you breathe in, and down as you breathe out."
        },
        {
            name: "Humming Breath",
            instructions: "Take a deep breath in through your nose, then hum as you exhale. Feel the vibration in your chest and face."
        },
        {
            name: "Dragon Breath",
            instructions: "Take a deep breath in, then breathe out forcefully through your mouth like a dragon breathing fire!"
        }
    ];

    // Initialize the application
    function init() {
        setRobotColor(state.currentRobotColor);
        setupEventListeners();
        checkDarkMode();
        setupUserProfile();
        
        // Start with the bot closed
        elements.chatBox.classList.add('hidden');
    }

    function setupUserProfile() {
        // Check if this is the first visit
        if (!state.userPreferences.name) {
            // We'll ask for preferences when chat first opens
            state.firstVisit = true;
        }
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
                    if (state.firstVisit) {
                        sendBotMessage("Hi there! I'm BuddyBot, and I'm here to help your amazing brain stay focused and organized. Could you tell me your name so I can get to know you better?");
                        state.onboarding = "name";
                    } else {
                        const welcomeBack = state.userPreferences.name ? 
                            `Welcome back, ${state.userPreferences.name}! ` : 
                            "Welcome back! ";
                        
                        sendBotMessage(welcomeBack + getRandomResponse());
                    }
                }, 500);
            }
        }
    }

    function closeChat() {
        elements.chatBox.classList.add('hidden');
        state.chatOpen = false;
        
        // If there's an active Pomodoro timer, ask if they want to continue
        if (state.currentSession.pomoTimer) {
            const timerRemaining = state.currentSession.pomoTimer.remaining;
            if (timerRemaining > 0) {
                // Show a notification or visual cue that timer is still running
                showFloatingNotification(`Focus timer still running: ${Math.floor(timerRemaining/60)}:${(timerRemaining%60).toString().padStart(2, '0')}`);
            }
        }
    }

    function showFloatingNotification(message, duration = 3000) {
        // Create floating notification
        const notification = document.createElement('div');
        notification.className = 'floating-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, duration);
    }

    function toggleFullSize() {
        elements.chatBox.classList.toggle('full-size');
        state.isFullSize = !state.isFullSize;
        elements.fullSize.innerHTML = state.isFullSize ? '<i class="fa fa-compress"></i>' : '<i class="fa fa-expand"></i>';
    }

    function handleUserMessage() {
        const message = elements.messageInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        elements.messageInput.value = '';
        
        // Check if we're in onboarding flow
        if (state.onboarding) {
            handleOnboarding(message);
            return;
        }
        
        // Process message for keywords and generate response
        setTimeout(() => {
            processBotResponse(message);
        }, 1000);
    }

    function handleOnboarding(message) {
        switch(state.onboarding) {
            case "name":
                // Save name
                state.userPreferences.name = message;
                localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
                
                // Ask about favorite color
                setTimeout(() => {
                    sendBotMessage(`Nice to meet you, ${state.userPreferences.name}! I'd love to know a little more about you to help your brain work best. What's your favorite color?`);
                    state.onboarding = "color";
                }, 1000);
                break;
                
            case "color":
                // Save color preference
                state.userPreferences.favoriteColor = message;
                localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
                
                // Ask about interests
                setTimeout(() => {
                    sendBotMessage(`${message} is a great color! What are some things you enjoy doing or learning about? (You can list a few separated by commas)`);
                    state.onboarding = "interests";
                }, 1000);
                break;
                
            case "interests":
                // Save interests
                state.userPreferences.interests = message.split(',').map(item => item.trim());
                localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
                
                // Ask about difficult subjects/activities
                setTimeout(() => {
                    sendBotMessage(`Those sound like fun things! Sometimes our brains find certain activities more challenging than others. What kinds of schoolwork or activities do you find most difficult to focus on?`);
                    state.onboarding = "difficulties";
                }, 1000);
                break;
                
            case "difficulties":
                // Save difficulties
                state.userPreferences.difficultSubjects = message.split(',').map(item => item.trim());
                localStorage.setItem('userPreferences', JSON.stringify(state.userPreferences));
                
                // Complete onboarding
                setTimeout(() => {
                    sendBotMessage(`Thanks for sharing that with me, ${state.userPreferences.name}! I'm here to help your amazing brain stay focused, especially during challenging activities. You can ask me for focus games, brain breaks, timers, or just chat when you need support. What would you like help with today?`);
                    state.onboarding = null;
                    state.firstVisit = false;
                }, 1000);
                break;
                
            default:
                state.onboarding = null;
                processBotResponse(message);
        }
    }

    function processBotResponse(userMessage) {
        // Check for special commands
        if (checkForCommands(userMessage)) {
            return;
        }
        
        // Check for ADHD-related keywords
        let responseType = null;
        let keywordMatches = {};
        
        for (const [type, words] of Object.entries(adhdKeywords)) {
            if (words.some(word => userMessage.toLowerCase().includes(word.toLowerCase()))) {
                keywordMatches[type] = true;
            }
        }
        
        // Prioritize which type of response to use
        // Order of priority: emotion_regulation > overwhelmed > executive_function > distracted > focus > transition > success
        if (keywordMatches.emotion_regulation) responseType = 'emotion_regulation';
        else if (keywordMatches.overwhelmed) responseType = 'overwhelmed';
        else if (keywordMatches.executive_function) responseType = 'executive_function';
        else if (keywordMatches.distracted) responseType = 'distracted';
        else if (keywordMatches.focus) responseType = 'focus';
        else if (keywordMatches.transition) responseType = 'transition';
        else if (keywordMatches.success) responseType = 'success';
        
        // Check for specific activity requests
        let botMessage = '';
        
        if (userMessage.toLowerCase().includes('timer') || userMessage.toLowerCase().includes('pomodoro')) {
            startPomodoroTimer();
            return;
        } else if (userMessage.toLowerCase().includes('game') || userMessage.toLowerCase().includes('bored') || userMessage.toLowerCase().includes('play')) {
            const game = getRandomItem(focusGames);
            botMessage = `Let's play ${game.name}! ${game.instructions}`;
        } else if (userMessage.toLowerCase().includes('fact') || userMessage.toLowerCase().includes('tell me something')) {
            botMessage = getRandomItem(funFacts);
        } else if (userMessage.toLowerCase().includes('sensory') || userMessage.toLowerCase().includes('fidget') || userMessage.toLowerCase().includes('move')) {
            const activity = getRandomItem(sensoryActivities);
            botMessage = `Here's a quick sensory activity: **${activity.name}** - ${activity.instructions}`;
        } else if (userMessage.toLowerCase().includes('breath') || userMessage.toLowerCase().includes('calm') || userMessage.toLowerCase().includes('relax')) {
            const exercise = getRandomItem(breathingExercises);
            botMessage = `Let's try this breathing exercise: **${exercise.name}** - ${exercise.instructions}`;
        } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('resource')) {
            const resource = getRandomItem(adhdResources);
            botMessage = `Here's a helpful strategy: **${resource.title}** - ${resource.description}`;
        } else if (responseType) {
            // Use specific ADHD response type identified by keywords
            botMessage = getRandomItem(adhdResponses[responseType]);
            
// Personalize based on preferences if available
if (state.userPreferences.name) {
    botMessage = botMessage.replace(/your brain/g, `${state.userPreferences.name}'s brain`);
}
} else {
// Default response based on mood
botMessage = getRandomItem(botResponses[state.botMood]);
}

sendBotMessage(botMessage);
}

function checkForCommands(message) {
const lowerMsg = message.toLowerCase();

// Check for specific commands
if (lowerMsg === 'help' || lowerMsg === 'commands') {
sendBotMessage("Here are some things I can help with:\n- Focus timers and Pomodoro technique\n- Brain break activities\n- Focus games to train attention\n- Sensory regulation activities\n- Breathing exercises\n- Breaking down tasks\n- Fun brain facts\n\nJust tell me what you need help with!");
return true;
} else if (lowerMsg.includes('clear chat') || lowerMsg.includes('reset chat')) {
elements.chatMessages.innerHTML = '';
sendBotMessage("I've cleared our chat history!");
return true;
} else if (lowerMsg.includes('preferences') || lowerMsg.includes('settings')) {
showUserPreferences();
return true;
}

return false;
}

function showUserPreferences() {
const prefs = state.userPreferences;
let prefsMessage = `**Your Profile:**\n- Name: ${prefs.name || 'Not set'}\n- Favorite color: ${prefs.favoriteColor || 'Not set'}\n`;

if (prefs.interests && prefs.interests.length > 0) {
prefsMessage += `- Interests: ${prefs.interests.join(', ')}\n`;
}

if (prefs.difficultSubjects && prefs.difficultSubjects.length > 0) {
prefsMessage += `- Challenging activities: ${prefs.difficultSubjects.join(', ')}\n`;
}

prefsMessage += "\nTo update any of these, just tell me what you'd like to change!";
sendBotMessage(prefsMessage);
}

function startPomodoroTimer(duration = 25) {
// Clear any existing timers
if (state.currentSession.pomoTimer) {
clearInterval(state.currentSession.pomoTimer.interval);
}

// Set up new timer
const endTime = Date.now() + (duration * 60 * 1000);

sendBotMessage(`Starting a ${duration}-minute focus timer! I'll check in with you when time is up. You can do this!`);

// Create timer element in chat
const timerElement = document.createElement('div');
timerElement.className = 'timer-display';
timerElement.innerHTML = `<div class="timer-progress"><div class="timer-bar"></div></div><div class="timer-text">${duration}:00</div>`;
elements.chatMessages.appendChild(timerElement);

// Auto scroll to bottom
elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

const progressBar = timerElement.querySelector('.timer-bar');
const timerText = timerElement.querySelector('.timer-text');

// Start the timer
const timerInterval = setInterval(() => {
const now = Date.now();
const remaining = Math.round((endTime - now) / 1000);

if (remaining <= 0) {
    // Timer complete
    clearInterval(timerInterval);
    timerText.textContent = 'Complete!';
    progressBar.style.width = '100%';
    
    // Update session stats
    state.currentSession.taskCompleted += 1;
    state.currentSession.consecutiveFocusPeriods += 1;
    
    // Send completion message
    setTimeout(() => {
        const breakDuration = state.currentSession.consecutiveFocusPeriods >= 4 ? 15 : 5;
        sendBotMessage(`Great job focusing! You've completed ${state.currentSession.taskCompleted} focus periods today. Would you like to take a ${breakDuration}-minute break now?`);
    }, 1000);
    
    state.currentSession.pomoTimer = null;
} else {
    // Update timer display
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progress = 100 - (remaining / (duration * 60) * 100);
    progressBar.style.width = `${progress}%`;
    
    // Store remaining time
    state.currentSession.pomoTimer.remaining = remaining;
}
}, 1000);

// Store timer reference
state.currentSession.pomoTimer = {
interval: timerInterval,
remaining: duration * 60,
element: timerElement
};
}

function startBreakTimer(duration = 5) {
// Similar to Pomodoro timer but for breaks
if (state.currentSession.breakTimer) {
clearInterval(state.currentSession.breakTimer.interval);
}

const endTime = Date.now() + (duration * 60 * 1000);

sendBotMessage(`Starting a ${duration}-minute break! Time to recharge your brain. I'll let you know when to get back to work.`);

const timerElement = document.createElement('div');
timerElement.className = 'timer-display break-timer';
timerElement.innerHTML = `<div class="timer-progress"><div class="timer-bar"></div></div><div class="timer-text">${duration}:00</div>`;
elements.chatMessages.appendChild(timerElement);

elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

const progressBar = timerElement.querySelector('.timer-bar');
const timerText = timerElement.querySelector('.timer-text');

const timerInterval = setInterval(() => {
const now = Date.now();
const remaining = Math.round((endTime - now) / 1000);

if (remaining <= 0) {
    // Break complete
    clearInterval(timerInterval);
    timerText.textContent = 'Break Over!';
    progressBar.style.width = '100%';
    
    // Send completion message
    setTimeout(() => {
        sendBotMessage("Break time is over! Ready to focus again? Let me know when you're ready to start another timer.");
    }, 1000);
    
    state.currentSession.breakTimer = null;
} else {
    // Update timer display
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progress = 100 - (remaining / (duration * 60) * 100);
    progressBar.style.width = `${progress}%`;
}
}, 1000);

state.currentSession.breakTimer = {
interval: timerInterval,
element: timerElement
};
}

function sendBotMessage(message) {
startRobotTalking();

// Add message to chat
setTimeout(() => {
addMessageToChat('bot', message);
stopRobotTalking();
}, getMessageDelay(message));
}

function getMessageDelay(message) {
// Calculate delay based on message length (simulates typing time)
return Math.min(Math.max(700, message.length * 20), 3000);
}

function addMessageToChat(sender, message) {
// Create message element
const messageElement = document.createElement('div');
messageElement.className = `chat-message ${sender}-message`;

// Convert markdown-style bold text (**text**) to HTML bold
const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

// Set message content
messageElement.innerHTML = `
<div class="message-bubble">
    ${formattedMessage}
</div>
<div class="message-time">${getCurrentTime()}</div>
`;

// Add to chat messages
elements.chatMessages.appendChild(messageElement);

// Auto scroll to bottom
elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function startRobotTalking() {
if (!state.botTalking) {
state.botTalking = true;
elements.robotMouth.classList.add('talking');
}
}

function stopRobotTalking() {
state.botTalking = false;
elements.robotMouth.classList.remove('talking');
}

function toggleHelpPanel() {
elements.helpPanel.classList.toggle('hidden');
}

function toggleMoodSelector() {
elements.moodSelector.classList.toggle('hidden');
}

function toggleModelSelector() {
elements.robotModelSelector.classList.toggle('hidden');
}

function changeRobotMood(mood) {
state.botMood = mood;
elements.robotHead.className = `robot-head mood-${mood}`;
}

function changeRobotColor(color) {
state.currentRobotColor = color;
localStorage.setItem('robotColor', color);
setRobotColor(color);
}

function setRobotColor(color) {
document.documentElement.style.setProperty('--robot-color', color);
}

function insertEmoji() {
// Add random positive emoji to message input
const emojis = ['😊', '👍', '🎉', '⭐', '🚀', '🌟', '🔆', '🧠', '💡', '✨', '🌈', '🦸‍♂️', '🌻'];
elements.messageInput.value += ' ' + getRandomItem(emojis) + ' ';
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

function getCurrentTime() {
const now = new Date();
return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getRandomItem(array) {
return array[Math.floor(Math.random() * array.length)];
}

function getRandomResponse() {
return getRandomItem(botResponses[state.botMood]);
}

// Initialize the app when DOM is loaded
init();
});