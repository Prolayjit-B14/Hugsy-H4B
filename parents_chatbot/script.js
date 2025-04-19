const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Health-related responses
const responses = {
    greetings: ['hello', 'hi', 'hey', 'greetings'],
    symptoms: ['symptoms', 'feeling', 'pain', 'ache', 'fever', 'cough'],
    emergency: ['emergency', 'urgent', 'severe', 'critical'],
    lifestyle: ['diet', 'exercise', 'sleep', 'stress', 'healthy'],
    medication: ['medicine', 'drug', 'prescription', 'dose', 'medication']
};

const botResponses = {
    greetings: "Hello! I'm your health assistant. How can I help you today?",
    symptoms: "I understand you're not feeling well. Could you please describe your symptoms in detail? Remember, while I can provide general information, it's important to consult a healthcare professional for proper medical advice.",
    emergency: "If you're experiencing a medical emergency, please call emergency services (911) immediately or visit your nearest emergency room.",
    lifestyle: "Making healthy lifestyle choices is important. I can provide general information about diet, exercise, and wellness. What specific aspect would you like to know more about?",
    medication: "I can provide general information about medications, but please consult your healthcare provider or pharmacist for specific medical advice and proper dosage information.",
    default: "I apologize, but I can only provide general health information. For specific medical advice, please consult with a qualified healthcare professional."
};

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getApiResponse(input) {
    input = input.toLowerCase();
    const baseUrl = 'https://hugsy-server.netlify.app/api/'

    const apiResponse = await (await fetch(`${baseUrl}parents?prompt=${input}`)).json();

    if (!apiResponse) {
        return "Oops! Something went wrong.";
    }

    return apiResponse.response
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, true);
    userInput.value = '';

    const response = await getApiResponse(message);
    addMessage(response);

}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Focus input on load
userInput.focus();