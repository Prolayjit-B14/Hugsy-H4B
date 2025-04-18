const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');
const numberDisplay = document.getElementById('currentNumber');
let isDrawing = false;
let currentNumber = 1;

// Draw the number on canvas
function drawNumber(num) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "180px Comic Sans MS";
  ctx.fillStyle = "#d63384";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(num, canvas.width / 2, canvas.height / 2);
}
drawNumber(currentNumber);

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => (isDrawing = false));

canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', drawingTouch);
canvas.addEventListener('touchend', () => (isDrawing = false));

function startDraw(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(getX(e), getY(e));
}

function drawing(e) {
  if (!isDrawing) return;
  ctx.lineWidth = 5;
  ctx.strokeStyle = rainbow();
  ctx.lineTo(getX(e), getY(e));
  ctx.stroke();
}

function drawingTouch(e) {
  if (!isDrawing) return;
  const touch = e.touches[0];
  ctx.lineWidth = 5;
  ctx.strokeStyle = rainbow();
  ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
  ctx.stroke();
}

function getX(e) {
  return e.clientX - canvas.offsetLeft;
}

function getY(e) {
  return e.clientY - canvas.offsetTop;
}

document.getElementById('clearBtn').addEventListener('click', () => {
  drawNumber(currentNumber);
});

document.getElementById('topBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentNumber > 1) {
    currentNumber--;
    updateNumber();
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentNumber < 30) {
    currentNumber++;
    updateNumber();
  }
});

function updateNumber() {
  numberDisplay.textContent = currentNumber;
  drawNumber(currentNumber);
  speakNumber(currentNumber);
}

// Rainbow trail color generator
let hue = 0;
function rainbow() {
  hue = (hue + 5) % 360;
  return `hsl(${hue}, 100%, 60%)`;
}

// System voice for number
function speakNumber(num) {
  const msg = new SpeechSynthesisUtterance(`Number ${num}`);
  msg.lang = "en-US";
  msg.rate = 0.9;
  speechSynthesis.speak(msg);
}

// Confetti after tracing done
canvas.addEventListener('mouseup', launchConfetti);
canvas.addEventListener('touchend', launchConfetti);

function launchConfetti() {
  const duration = 800;
  const confetti = document.getElementById('confettiCanvas');
  const ctx2 = confetti.getContext('2d');
  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;

  const particles = Array.from({ length: 100 }).map(() => ({
    x: Math.random() * confetti.width,
    y: Math.random() * confetti.height - confetti.height,
    radius: Math.random() * 6 + 4,
    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    speed: Math.random() * 3 + 2
  }));

  let start = performance.now();
  function drawConfetti(time) {
    let elapsed = time - start;
    ctx2.clearRect(0, 0, confetti.width, confetti.height);
    for (let p of particles) {
      p.y += p.speed;
      ctx2.beginPath();
      ctx2.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx2.fillStyle = p.color;
      ctx2.fill();
    }
    if (elapsed < duration) {
      requestAnimationFrame(drawConfetti);
    } else {
      ctx2.clearRect(0, 0, confetti.width, confetti.height);
    }
  }

  requestAnimationFrame(drawConfetti);
}
