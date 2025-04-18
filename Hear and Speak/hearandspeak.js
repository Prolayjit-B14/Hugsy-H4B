const wordData = {
    animals: [
      { emoji: "🐶", text: "Dog" },
      { emoji: "🐱", text: "Cat" },
      { emoji: "🐮", text: "Cow" },
      { emoji: "🐔", text: "Hen" },
      { emoji: "🐘", text: "Elephant" }
    ],
    fruits: [
      { emoji: "🍎", text: "Apple" },
      { emoji: "🍌", text: "Banana" },
      { emoji: "🍇", text: "Grapes" },
      { emoji: "🍉", text: "Watermelon" },
      { emoji: "🍓", text: "Strawberry" }
    ],
    objects: [
      { emoji: "📱", text: "Phone" },
      { emoji: "🖊️", text: "Pen" },
      { emoji: "🪑", text: "Chair" },
      { emoji: "🚪", text: "Door" },
      { emoji: "⏰", text: "Clock" }
    ],
    colors: [
      { emoji: "🔴", text: "Red" },
      { emoji: "🟠", text: "Orange" },
      { emoji: "🟡", text: "Yellow" },
      { emoji: "🟢", text: "Green" },
      { emoji: "🔵", text: "Blue" }
    ],
    actions: [
      { emoji: "🏃", text: "Run" },
      { emoji: "🧍", text: "Stand" },
      { emoji: "🪑", text: "Sit" },
      { emoji: "🙋", text: "Raise" },
      { emoji: "🧼", text: "Wash" }
    ]
  };
  
  const categorySelect = document.getElementById("category");
  const wordsDiv = document.getElementById("words");
  const statusDiv = document.getElementById("status");
  
  function speak(text) {
    const utter = new SpeechSynthesisUtterance(`Repeat after me: ${text}`);
    utter.lang = "en-US";
    utter.pitch = 1.2;
    utter.rate = 0.95;
    speechSynthesis.speak(utter);
  }
  
  function listenAndCheck(expected) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    statusDiv.textContent = "🎤 Listening...";
    recognition.start();
  
    recognition.onresult = function (event) {
      const spoken = event.results[0][0].transcript.toLowerCase();
      if (spoken.includes(expected.toLowerCase())) {
        statusDiv.textContent = "✅ You said it correctly!";
      } else {
        statusDiv.textContent = `❌ Try again. You said: "${spoken}"`;
      }
    };
  
    recognition.onerror = function () {
      statusDiv.textContent = "⚠️ Speech not recognized. Try again!";
    };
  }
  
  function showWords(category) {
    wordsDiv.innerHTML = "";
    wordData[category].forEach(item => {
      const div = document.createElement("div");
      div.className = "word";
      div.innerHTML = `<span>${item.emoji}</span><strong>${item.text}</strong>`;
      div.onclick = () => {
        speak(item.text);
        setTimeout(() => listenAndCheck(item.text), 2000);
      };
      wordsDiv.appendChild(div);
    });
  }
  
  categorySelect.addEventListener("change", e => {
    showWords(e.target.value);
    statusDiv.textContent = "";
  });
  
  window.onload = () => {
    showWords("animals");
  };
  