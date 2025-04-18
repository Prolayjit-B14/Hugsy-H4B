const shapes = [
    { name: "Circle", draw: ctx => {
      ctx.beginPath();
      ctx.arc(150, 150, 80, 0, Math.PI * 2);
      ctx.stroke();
    }},
    { name: "Square", draw: ctx => {
      ctx.beginPath();
      ctx.rect(80, 80, 140, 140);
      ctx.stroke();
    }},
    { name: "Triangle", draw: ctx => {
      ctx.beginPath();
      ctx.moveTo(150, 50);
      ctx.lineTo(80, 220);
      ctx.lineTo(220, 220);
      ctx.closePath();
      ctx.stroke();
    }},
    { name: "Star", draw: ctx => {
      ctx.beginPath();
      let rot = Math.PI / 2 * 3;
      let x = 150, y = 150, spikes = 5, outerRadius = 80, innerRadius = 30;
      let step = Math.PI / spikes;
  
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = 150 + Math.cos(rot) * outerRadius;
        y = 150 + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
  
        x = 150 + Math.cos(rot) * innerRadius;
        y = 150 + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(150, 70);
      ctx.closePath();
      ctx.stroke();
    }},
    { name: "Heart", draw: ctx => {
      ctx.beginPath();
      ctx.moveTo(150, 170);
      ctx.bezierCurveTo(150, 130, 100, 120, 100, 170);
      ctx.bezierCurveTo(100, 210, 150, 230, 150, 270);
      ctx.bezierCurveTo(150, 230, 200, 210, 200, 170);
      ctx.bezierCurveTo(200, 120, 150, 130, 150, 170);
      ctx.closePath();
      ctx.stroke();
    }}
  ];
  
  let currentShapeIndex = 0;
  const canvas = document.getElementById("tracingCanvas");
  const ctx = canvas.getContext("2d");
  const shapeNameEl = document.getElementById("shapeName");
  let drawing = false;
  let synth = window.speechSynthesis;
  
  // Drawing logic
  canvas.addEventListener("mousedown", () => drawing = true);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mouseout", () => drawing = false);
  canvas.addEventListener("mousemove", draw);
  
  canvas.addEventListener("touchstart", e => {
    drawing = true;
    draw(e.touches[0]);
  });
  canvas.addEventListener("touchmove", e => {
    draw(e.touches[0]);
    e.preventDefault();
  });
  canvas.addEventListener("touchend", () => drawing = false);
  
  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = getRainbowColor();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }
  
  function getRainbowColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 60%)`;
  }
  
  function drawShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    shapes[currentShapeIndex].draw(ctx);
    ctx.stroke();
    shapeNameEl.textContent = shapes[currentShapeIndex].name;
    speakShape();
  }
  
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape();
  }
  
  function speakShape() {
    const utterance = new SpeechSynthesisUtterance(shapes[currentShapeIndex].name);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 0.9;
    synth.cancel(); // stop previous
    synth.speak(utterance);
  }
  
  function nextShape() {
    currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
    drawShape();
  }
  
  function prevShape() {
    currentShapeIndex = (currentShapeIndex - 1 + shapes.length) % shapes.length;
    drawShape();
  }
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  window.onload = drawShape;
  