// DOM Elements
const accessibilityToggle = document.querySelector('.accessibility-toggle');
const accessibilityControls = document.getElementById('accessibility-controls');
const fontSizeButtons = document.querySelectorAll('[data-action*="font"]');
const contrastButtons = document.querySelectorAll('[data-action*="contrast"]');
const animationsToggle = document.getElementById('animations-toggle');
const dyslexicFontToggle = document.getElementById('dyslexic-font-toggle');

// User preferences - set defaults or get from localStorage
let userPreferences = {
  fontSize: 100, // Percentage of default font size
  highContrast: false,
  reducedAnimations: false,
  dyslexicFont: false
};

// Load saved preferences from localStorage
function loadPreferences() {
  const savedPreferences = localStorage.getItem('brightminds-preferences');
  
  if (savedPreferences) {
    try {
      userPreferences = JSON.parse(savedPreferences);
      applyPreferences();
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }
}

// Save preferences to localStorage
function savePreferences() {
  localStorage.setItem('brightminds-preferences', JSON.stringify(userPreferences));
}

// Apply current preferences to the page
function applyPreferences() {
  // Apply font size
  document.documentElement.style.fontSize = `${userPreferences.fontSize}%`;
  
  // Apply contrast
  if (userPreferences.highContrast) {
    document.body.classList.add('high-contrast');
    document.querySelector('[data-action="high-contrast"]').classList.add('active');
    document.querySelector('[data-action="normal-contrast"]').classList.remove('active');
  } else {
    document.body.classList.remove('high-contrast');
    document.querySelector('[data-action="high-contrast"]').classList.remove('active');
    document.querySelector('[data-action="normal-contrast"]').classList.add('active');
  }
  
  // Apply animation preference
  if (userPreferences.reducedAnimations) {
    document.body.classList.add('reduced-motion');
    animationsToggle.checked = false;
  } else {
    document.body.classList.remove('reduced-motion');
    animationsToggle.checked = true;
  }
  
  // Apply dyslexic font
  if (userPreferences.dyslexicFont) {
    document.body.classList.add('dyslexic-font');
    dyslexicFontToggle.checked = true;
  } else {
    document.body.classList.remove('dyslexic-font');
    dyslexicFontToggle.checked = false;
  }
}

// Toggle accessibility panel
if (accessibilityToggle && accessibilityControls) {
  accessibilityToggle.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    accessibilityControls.classList.toggle('show');
  });
}

// Close panel when clicking outside
document.addEventListener('click', function(event) {
  if (accessibilityControls && accessibilityControls.classList.contains('show')) {
    if (!event.target.closest('.accessibility-panel')) {
      accessibilityControls.classList.remove('show');
      accessibilityToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// Font size controls
fontSizeButtons.forEach(button => {
  button.addEventListener('click', function() {
    const action = this.getAttribute('data-action');
    
    switch (action) {
      case 'increase-font':
        userPreferences.fontSize += 10;
        if (userPreferences.fontSize > 200) userPreferences.fontSize = 200;
        break;
      case 'decrease-font':
        userPreferences.fontSize -= 10;
        if (userPreferences.fontSize < 70) userPreferences.fontSize = 70;
        break;
      case 'reset-font':
        userPreferences.fontSize = 100;
        break;
    }
    
    applyPreferences();
    savePreferences();
  });
});

// Contrast controls
contrastButtons.forEach(button => {
  button.addEventListener('click', function() {
    const action = this.getAttribute('data-action');
    
    switch (action) {
      case 'high-contrast':
        userPreferences.highContrast = true;
        break;
      case 'normal-contrast':
        userPreferences.highContrast = false;
        break;
    }
    
    applyPreferences();
    savePreferences();
  });
});

// Animations toggle
if (animationsToggle) {
  animationsToggle.addEventListener('change', function() {
    userPreferences.reducedAnimations = !this.checked;
    applyPreferences();
    savePreferences();
  });
}

// Dyslexic font toggle
if (dyslexicFontToggle) {
  dyslexicFontToggle.addEventListener('change', function() {
    userPreferences.dyslexicFont = this.checked;
    applyPreferences();
    savePreferences();
  });
}

// Check for user preference for reduced motion at the OS level
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (reducedMotionQuery.matches) {
  userPreferences.reducedAnimations = true;
}

// Listen for changes to OS preference for reduced motion
reducedMotionQuery.addEventListener('change', event => {
  userPreferences.reducedAnimations = event.matches;
  applyPreferences();
  savePreferences();
});

// Initialize accessibility settings
document.addEventListener('DOMContentLoaded', function() {
  loadPreferences();
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(event) {
  // Handle Escape key to close modals and panels
  if (event.key === 'Escape') {
    // Close newsletter modal if open
    if (document.getElementById('newsletter-modal').style.display === 'flex') {
      document.querySelector('.close-modal').click();
    }
    
    // Close accessibility panel if open
    if (accessibilityControls.classList.contains('show')) {
      accessibilityToggle.click();
    }
  }
  
  // Handle Tab key for better focus management
  if (event.key === 'Tab') {
    document.body.classList.add('keyboard-user');
  }
});

// Remove keyboard focus styling when mouse is used
document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-user');
});

// Additional feature: Text-to-speech for selected text
document.addEventListener('mouseup', function() {
  const selectedText = window.getSelection().toString().trim();
  
  // Show text-to-speech button if text is selected and TTS is available
  if (selectedText && 'speechSynthesis' in window && userPreferences.textToSpeech) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Create or get TTS button
    let ttsButton = document.getElementById('tts-button');
    if (!ttsButton) {
      ttsButton = document.createElement('button');
      ttsButton.id = 'tts-button';
      ttsButton.className = 'tts-button';
      ttsButton.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      ttsButton.title = 'Read selected text aloud';
      document.body.appendChild(ttsButton);
    }
    
    // Position the button near the selection
    ttsButton.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    ttsButton.style.top = `${rect.bottom + window.scrollY + 10}px`;
    ttsButton.style.display = 'block';
    
    // Add click event to read text
    ttsButton.onclick = function() {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      window.speechSynthesis.speak(utterance);
      ttsButton.style.display = 'none';
    };
    
    // Hide button when clicking elsewhere
    document.addEventListener('mousedown', function hideButton(e) {
      if (e.target !== ttsButton) {
        ttsButton.style.display = 'none';
        document.removeEventListener('mousedown', hideButton);
      }
    });
  }
});

// Add text-to-speech option to accessibility panel
const accessibilityPanel = document.querySelector('.accessibility-controls');
if (accessibilityPanel && 'speechSynthesis' in window) {
  const ttsControlGroup = document.createElement('div');
  ttsControlGroup.className = 'control-group';
  ttsControlGroup.innerHTML = `
    <label for="tts-toggle">Text-to-Speech</label>
    <div class="toggle-switch">
      <input type="checkbox" id="tts-toggle">
      <label for="tts-toggle"></label>
    </div>
  `;
  
  accessibilityPanel.appendChild(ttsControlGroup);
  
  // Initialize TTS preference
  userPreferences.textToSpeech = userPreferences.textToSpeech || false;
  document.getElementById('tts-toggle').checked = userPreferences.textToSpeech;
  
  // Add event listener
  document.getElementById('tts-toggle').addEventListener('change', function() {
    userPreferences.textToSpeech = this.checked;
    savePreferences();
  });
}