
// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const primaryMenu = document.getElementById('primary-menu');
const featuresWrapper = document.querySelector('.features-wrapper');
const modalClose = document.querySelector('.close-modal');
const newsletterModal = document.getElementById('newsletter-modal');
const sliderDots = document.querySelectorAll('.slider-dots .dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const testimonials = document.querySelectorAll('.testimonial');

// Mobile Menu Toggle
if (menuToggle && primaryMenu) {
  menuToggle.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    primaryMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  if (primaryMenu && primaryMenu.classList.contains('active')) {
    if (!event.target.closest('.main-nav') && !event.target.closest('.menu-toggle')) {
      primaryMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  }
});

// Newsletter Modal
function showNewsletterModal() {
  if (newsletterModal) {
    newsletterModal.style.display = 'flex';
    document.body.classList.add('modal-open');
  }
}

function closeNewsletterModal() {
  if (newsletterModal) {
    newsletterModal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}

// Show newsletter modal after 30 seconds
setTimeout(showNewsletterModal, 30000);

// Close modal on button click
if (modalClose) {
  modalClose.addEventListener('click', closeNewsletterModal);
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === newsletterModal) {
    closeNewsletterModal();
  }
});

// Handle form submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Simulate form submission
    console.log('Form submitted:', formObject);
    
    // If it's the newsletter form, show a thank you message
    if (form.classList.contains('newsletter-form')) {
      form.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
      
      // Close the modal after 3 seconds
      setTimeout(closeNewsletterModal, 3000);
    }
  });
});

// Testimonial Slider
let currentSlide = 0;

function showSlide(index) {
  // Hide all testimonials
  testimonials.forEach(testimonial => {
    testimonial.style.display = 'none';
  });
  
  // Remove active class from all dots
  sliderDots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Show the selected testimonial
  if (testimonials[index]) {
    testimonials[index].style.display = 'block';
    
    // Add active class to the corresponding dot
    if (sliderDots[index]) {
      sliderDots[index].classList.add('active');
    }
  }
}

// Initialize the slider
showSlide(currentSlide);

// Event listeners for previous and next buttons
if (prevBtn) {
  prevBtn.addEventListener('click', function() {
    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    showSlide(currentSlide);
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', function() {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
  });
}

// Event listeners for dots
sliderDots.forEach((dot, index) => {
  dot.addEventListener('click', function() {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Auto-advance the slider every 7 seconds
setInterval(function() {
  currentSlide = (currentSlide + 1) % testimonials.length;
  showSlide(currentSlide);
}, 7000);

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
    
    fadeElements.forEach(element => {
      appearOnScroll.observe(element);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    fadeElements.forEach(element => {
      element.classList.add('appear');
    });
  }
});

// Progress path simulation
const pathCards = document.querySelectorAll('.path-card');

pathCards.forEach(card => {
  // Simulate progress update when clicking "Start Path" button
  const startBtn = card.querySelector('.btn');
  const progressBar = card.querySelector('.progress-bar');
  const progressLabel = card.querySelector('.progress-label span:last-child');
  
  if (startBtn && progressBar && progressLabel) {
    startBtn.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Increment progress by a random amount between 5-15%
      const currentProgress = parseInt(progressBar.style.width) || 0;
      let newProgress = currentProgress + Math.floor(Math.random() * 10 + 5);
      
      // Cap at 100%
      newProgress = Math.min(newProgress, 100);
      
      // Update the progress bar and label
      progressBar.style.width = newProgress + '%';
      progressLabel.textContent = newProgress + '%';
    });
  }
});