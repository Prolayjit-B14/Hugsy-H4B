// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const accessibilityToggle = document.querySelector(".accessibility-toggle");
    const accessibilityControls = document.getElementById("accessibility-controls");
  
    const fontSizeBtns = document.querySelectorAll("[data-action^='font']");
    const controlBtns = document.querySelectorAll(".control-btn");
  
    let baseFontSize = 16;
    let currentFontSize = baseFontSize;
  
    // Toggle accessibility panel
    accessibilityToggle.addEventListener("click", () => {
      const expanded = accessibilityToggle.getAttribute("aria-expanded") === "true";
      accessibilityToggle.setAttribute("aria-expanded", !expanded);
      accessibilityControls.classList.toggle("open");
    });
  
    // Font size controls
    document.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        if (action === "increase-font") {
          currentFontSize += 2;
        } else if (action === "decrease-font") {
          currentFontSize = Math.max(12, currentFontSize - 2);
        } else if (action === "reset-font") {
          currentFontSize = baseFontSize;
        }
        document.documentElement.style.fontSize = `${currentFontSize}px`;
      });
    });
  
    // Contrast controls
    document.querySelector("[data-action='high-contrast']").addEventListener("click", () => {
      document.body.classList.add("high-contrast");
      toggleContrastButtons("high-contrast");
    });
  
    document.querySelector("[data-action='normal-contrast']").addEventListener("click", () => {
      document.body.classList.remove("high-contrast");
      toggleContrastButtons("normal-contrast");
    });
  
    function toggleContrastButtons(activeAction) {
      controlBtns.forEach(btn => {
        if (btn.dataset.action === activeAction) {
          btn.classList.add("active");
        } else if (["high-contrast", "normal-contrast"].includes(btn.dataset.action)) {
          btn.classList.remove("active");
        }
      });
    }
  
    // Animations toggle
    const animationsToggle = document.getElementById("animations-toggle");
    animationsToggle.addEventListener("change", () => {
      document.body.classList.toggle("no-animations", !animationsToggle.checked);
    });
  
    // Dyslexic font toggle
    const dyslexicToggle = document.getElementById("dyslexic-font-toggle");
    dyslexicToggle.addEventListener("change", () => {
      document.body.classList.toggle("dyslexic-font", dyslexicToggle.checked);
    });
  });
  