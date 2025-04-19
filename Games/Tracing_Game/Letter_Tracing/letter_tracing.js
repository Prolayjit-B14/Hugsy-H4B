const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let painting = false;
let hue = 0;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let currentIndex = 0;

const synth = window.speechSynthesis; // SpeechSynthesis API for system voice

function drawLetter(letter) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hue = 0;

  // Draw the current letter
  document.getElementById("current-letter").textContent = letter;

  ctx.font = "200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#eee";
  ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
}

function speakLetter(letter) {
  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.rate = 1; // Speed of the voice
  utterance.pitch = 1; // Pitch of the voice
  synth.speak(utterance);
}

function startPosition(e) {
  painting = true;
  drawStroke(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function drawStroke(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches[0].clientX) - rect.left;
  const y = (e.clientY || e.touches[0].clientY) - rect.top;

  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.fill();

  hue = (hue + 5) % 360;
}

function clearCanvas() {
  drawLetter(letters[currentIndex]);
}

function nextLetter() {
  currentIndex = (currentIndex + 1) % letters.length;
  drawLetter(letters[currentIndex]);
  speakLetter(letters[currentIndex]); // Speak the new letter
}

function prevLetter() {
  currentIndex = (currentIndex - 1 + letters.length) % letters.length;
  drawLetter(letters[currentIndex]);
  speakLetter(letters[currentIndex]); // Speak the new letter
}

// Confetti animation trigger
function triggerConfetti() {
  const confettiCount = 100;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    document.body.appendChild(confetti);

    const size = Math.random() * 10 + 5;
    const left = Math.random() * window.innerWidth;
    const delay = Math.random() * 2;

    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}px`;
    confetti.style.animationDelay = `${delay}s`;
  }
  setTimeout(() => {
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => confetti.remove());
  }, 3000); // Remove confetti after 3 seconds
}

function completeTracing() {
  triggerConfetti(); // Trigger confetti after tracing a letter
}

// Event Listeners
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", drawStroke);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", drawStroke);

// Initialize
window.onload = () => {
  drawLetter(letters[currentIndex]);
  speakLetter(letters[currentIndex]); // Speak the letter initially
};
