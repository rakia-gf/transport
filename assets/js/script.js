'use strict';

/**
 * TRANSPORTIO - Main JavaScript File
 * Improved version with performance optimizations and enhanced features
 */

/*-----------------------------------*\
  #DOM ELEMENTS
\*-----------------------------------*/

// Navigation elements
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

// Header and back to top
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

// Additional elements for enhanced features
const sections = document.querySelectorAll('.section');
const html = document.documentElement;
const body = document.body;

/*-----------------------------------*\
  #UTILITY FUNCTIONS
\*-----------------------------------*/

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function using requestAnimationFrame
 * @param {Function} func - The function to throttle
 * @returns {Function} Throttled function
 */
const throttleRAF = (func) => {
  let ticking = false;
  
  return function(...args) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @param {number} offset - Offset threshold
 * @returns {boolean} True if element is in viewport
 */
const isInViewport = (el, offset = 100) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight - offset) && 
    rect.bottom >= offset
  );
};

/*-----------------------------------*\
  #NAVBAR TOGGLE (MOBILE MENU)
\*-----------------------------------*/

/**
 * Initialize navbar toggle functionality
 */
const initNavbarToggle = () => {
  if (!navbar || !overlay) return;

  // Toggle menu function
  const toggleMenu = (forceState) => {
    const isActive = forceState !== undefined ? forceState : !navbar.classList.contains("active");
    
    if (isActive) {
      navbar.classList.add("active");
      overlay.classList.add("active");
      body.classList.add("no-scroll");
      
      // Update ARIA attributes for accessibility
      navToggler.forEach(btn => {
        btn.setAttribute("aria-expanded", "true");
      });
      
      // Add animation class
      navbar.style.animation = "slideIn 0.5s var(--cubic-out)";
    } else {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
      body.classList.remove("no-scroll");
      
      // Update ARIA attributes for accessibility
      navToggler.forEach(btn => {
        btn.setAttribute("aria-expanded", "false");
      });
      
      // Add animation class
      navbar.style.animation = "slideOut 0.25s var(--cubic-in)";
    }
  };

  // Add click event to all nav togglers
  navToggler.forEach((toggler, index) => {
    // Set initial ARIA attribute
    toggler.setAttribute("aria-expanded", "false");
    
    toggler.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });
  });

  // Close menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // Don't close if it's the same page anchor
      const href = link.getAttribute("href");
      if (href && href !== "#" && href !== "") {
        toggleMenu(false);
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navbar.classList.contains("active")) {
      toggleMenu(false);
    }
  });

  // Handle window resize
  window.addEventListener("resize", debounce(() => {
    if (window.innerWidth > 992 && navbar.classList.contains("active")) {
      toggleMenu(false);
    }
  }, 150));
};

/*-----------------------------------*\
  #HEADER SCROLL EFFECT
\*-----------------------------------*/

/**
 * Initialize header scroll effect
 */
const initHeaderScroll = () => {
  if (!header) return;

  const handleScroll = throttleRAF(() => {
    const scrollY = window.scrollY;
    
    if (scrollY >= 100) {
      header.classList.add("active", "scrolled");
      
      // Add shadow and transition
      header.style.transition = "background-color 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease";
    } else {
      header.classList.remove("active", "scrolled");
    }
  });

  window.addEventListener("scroll", handleScroll);
  
  // Trigger once on load
  handleScroll();
};

/*-----------------------------------*\
  #BACK TO TOP BUTTON
\*-----------------------------------*/

/**
 * Initialize back to top button
 */
const initBackToTop = () => {
  if (!backTopBtn) return;

  const handleScroll = throttleRAF(() => {
    const scrollY = window.scrollY;
    
    if (scrollY >= 300) {
      backTopBtn.classList.add("active");
    } else {
      backTopBtn.classList.remove("active");
    }
  });

  window.addEventListener("scroll", handleScroll);
  
  // Smooth scroll to top on click
  backTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Trigger once on load
  handleScroll();
};

/*-----------------------------------*\
  #SMOOTH SCROLL FOR ANCHOR LINKS
\*-----------------------------------*/

/**
 * Initialize smooth scroll for all anchor links
 */
const initSmoothScroll = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate header height for offset
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
};

/*-----------------------------------*\
  #SCROLL REVEAL ANIMATION
\*-----------------------------------*/

/**
 * Initialize scroll reveal animations
 */
const initScrollReveal = () => {
  if (!sections.length) return;

  // Intersection Observer options
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        
        // Optional: add animation to child elements
        const animatedElements = entry.target.querySelectorAll('.service-card, .about-banner, .about-content, .contact-form-wrapper');
        animatedElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
          }, 100);
        });
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
};

/*-----------------------------------*\
  #ACTIVE NAVIGATION LINK ON SCROLL
\*-----------------------------------*/

/**
 * Set active navigation link based on scroll position
 */
const initActiveNavLink = () => {
  const sections = document.querySelectorAll("section[id]");
  
  if (!sections.length) return;

  const handleScroll = throttleRAF(() => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      
      const navLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
      
      if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add("active");
      } else if (navLink) {
        navLink.classList.remove("active");
      }
    });
  });

  window.addEventListener("scroll", handleScroll);
  handleScroll();
};

/*-----------------------------------*\
  #LOADER / PAGE TRANSITION
\*-----------------------------------*/

/**
 * Initialize page loader (optional)
 */
const initPageLoader = () => {
  // Add loader element if not exists
  if (!document.querySelector('.page-loader')) {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
  }

  // Hide loader when page is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.querySelector('.page-loader');
      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.remove();
        }, 500);
      }
    }, 300);
  });
};

/*-----------------------------------*\
  #POPUP FUNCTION
\*-----------------------------------*/

/**
 * Create and show a popup notification
 * @param {string} message - The message to display
 * @param {string} type - Type of popup (success, error, info)
 */
const showPopup = (message, type = 'success') => {
  // Remove existing popup if any
  const existingPopup = document.querySelector('.custom-popup');
  if (existingPopup) existingPopup.remove();

  // Create popup container
  const popup = document.createElement('div');
  popup.className = `custom-popup ${type}`;
  
  // Add icon based on type
  let icon = '';
  if (type === 'success') {
    icon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
  } else if (type === 'error') {
    icon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
  } else {
    icon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
  }

  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-icon">${icon}</div>
      <div class="popup-message">${message}</div>
    </div>
    <button class="popup-close" aria-label="Close">&times;</button>
  `;

  // Add to body
  document.body.appendChild(popup);

  // Add close button functionality
  const closeBtn = popup.querySelector('.popup-close');
  closeBtn.addEventListener('click', () => {
    popup.classList.add('fade-out');
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 300);
  });

  // Auto close after 5 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.classList.add('fade-out');
      setTimeout(() => {
        if (popup.parentNode) popup.remove();
      }, 300);
    }
  }, 5000);

  // Allow click outside to close (optional)
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.add('fade-out');
      setTimeout(() => {
        if (popup.parentNode) popup.remove();
      }, 300);
    }
  });
};

/*-----------------------------------*\
  #FORM VALIDATION AND SUBMISSION
\*-----------------------------------*/

/**
 * Initialize form validation and submission
 */
const initFormValidation = () => {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    // Simple validation
    requiredFields.forEach(field => {
      const formGroup = field.closest('.form-group');
      
      if (!field.value.trim()) {
        isValid = false;
        formGroup.classList.add('error');
        
        // Add error message if not exists
        if (!formGroup.querySelector('.error-message')) {
          const errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'This field is required';
          formGroup.appendChild(errorMsg);
        }
      } else {
        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    });
    
    // Validate phone numbers (basic)
    const phoneFields = contactForm.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (field.value.trim() && !phoneRegex.test(field.value.trim())) {
        isValid = false;
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        if (!formGroup.querySelector('.error-message')) {
          const errorMsg = document.createElement('span');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'Please enter a valid phone number';
          formGroup.appendChild(errorMsg);
        }
      }
    });
    
    if (isValid) {
      // Désactiver le bouton et changer le texte
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent; // "Send Package Request"
      
      // Changer le texte du bouton pendant l'envoi
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // VERSION AVEC VRAI ENVOI (FormSubmit)
      // Envoyer les données au serveur
      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // ✅ Pop-up de succès APRÈS la réponse positive
          showPopup('✅ Your package request has been sent successfully! We will contact you shortly.', 'success');
          
          // Réinitialiser le formulaire
          contactForm.reset();
        } else {
          // ❌ Pop-up d'erreur
          showPopup('❌ An error occurred. Please try again.', 'error');
        }
      })
      .catch(error => {
        // ❌ Pop-up d'erreur réseau
        showPopup('❌ Network error. Please check your connection.', 'error');
        console.error('Error:', error);
      })
      .finally(() => {
        // ❗ DANS TOUS LES CAS : remettre le bouton à son état original
        // Le pop-up est déjà affiché, maintenant on remet le bouton
        submitBtn.textContent = originalText; // "Send Package Request"
        submitBtn.disabled = false;
      });
    }
  });
  
  // Remove error on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const formGroup = field.closest('.form-group');
      formGroup.classList.remove('error');
      const errorMsg = formGroup.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    });
  });
};

/*-----------------------------------*\
  #RESIZE HANDLER (STOP ANIMATIONS)
\*-----------------------------------*/

/**
 * Stop animations during window resize for performance
 */
const initResizeHandler = () => {
  let resizeTimer;
  
  window.addEventListener('resize', () => {
    body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      body.classList.remove('resize-animation-stopper');
    }, 400);
  });
};

/*-----------------------------------*\
  #DETECT SLOW CONNECTION
\*-----------------------------------*/

/**
 * Optimize for slow connections
 */
const initConnectionOptimizer = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      body.classList.add('slow-connection');
      
      // Disable heavy animations
      const style = document.createElement('style');
      style.textContent = `
        .slow-connection .service-card:hover,
        .slow-connection .about-banner:hover,
        .slow-connection .btn:hover {
          transform: none !important;
          transition: none !important;
        }
        .slow-connection .service-card::before,
        .slow-connection .btn-submit::before {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

/*-----------------------------------*\
  #ADD CUSTOM STYLES FOR ANIMATIONS AND POPUP
\*-----------------------------------*/

/**
 * Inject animation and popup styles dynamically
 */
const initAnimationStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .no-scroll {
      overflow: hidden;
    }
    
    .resize-animation-stopper * {
      animation: none !important;
      transition: none !important;
    }
    
    .form-group.error .form-input,
    .form-group.error .form-textarea {
      border-color: #ff4444;
      box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
    }
    
    .error-message {
      color: #ff4444;
      font-size: 1.2rem;
      margin-top: 5px;
      display: block;
    }
    
    /* Custom Popup Styles */
    .custom-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      min-width: 300px;
      max-width: 450px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: popupSlideIn 0.3s ease;
      border-left: 5px solid;
    }
    
    .custom-popup.success {
      border-left-color: #00C851;
    }
    
    .custom-popup.error {
      border-left-color: #ff4444;
    }
    
    .custom-popup.info {
      border-left-color: #33b5e5;
    }
    
    .popup-content {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }
    
    .popup-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .custom-popup.success .popup-icon {
      color: #00C851;
    }
    
    .custom-popup.error .popup-icon {
      color: #ff4444;
    }
    
    .custom-popup.info .popup-icon {
      color: #33b5e5;
    }
    
    .popup-icon svg {
      width: 24px;
      height: 24px;
    }
    
    .popup-message {
      font-size: 1.5rem;
      color: #333;
      line-height: 1.4;
      flex: 1;
    }
    
    .popup-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      padding: 0 5px;
      transition: color 0.2s;
    }
    
    .popup-close:hover {
      color: #333;
    }
    
    .custom-popup.fade-out {
      animation: popupFadeOut 0.3s ease forwards;
    }
    
    @keyframes popupSlideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    
    @keyframes popupFadeOut {
      to {
        opacity: 0;
        transform: translate(-50%, -40%);
      }
    }
    
    /* Responsive popup */
    @media (max-width: 480px) {
      .custom-popup {
        min-width: 280px;
        max-width: 90%;
        padding: 15px;
      }
      
      .popup-message {
        font-size: 1.3rem;
      }
      
      .popup-icon {
        width: 30px;
        height: 30px;
      }
      
      .popup-icon svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .navbar-link.active {
      color: var(--dark-orange) !important;
      font-weight: var(--fw-600);
    }
    
    .navbar-link.active::before {
      width: 4px;
    }
    
    @media (min-width: 992px) {
      .navbar-link.active::before {
        width: 100%;
        background-color: var(--dark-orange);
      }
    }
    
    .page-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--white);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.5s ease;
    }
    
    .page-loader.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    
    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid var(--cultured-2);
      border-top-color: var(--dark-orange);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  document.head.appendChild(style);
};

/*-----------------------------------*\
  #INITIALIZE ALL FUNCTIONS
\*-----------------------------------*/

/**
 * Initialize all scripts when DOM is ready
 */
const init = () => {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavbarToggle();
      initHeaderScroll();
      initBackToTop();
      initSmoothScroll();
      initScrollReveal();
      initActiveNavLink();
      initFormValidation();
      initResizeHandler();
      initConnectionOptimizer();
      initAnimationStyles();
      // initPageLoader(); // Uncomment if you want page loader
    });
  } else {
    // DOM already loaded
    initNavbarToggle();
    initHeaderScroll();
    initBackToTop();
    initSmoothScroll();
    initScrollReveal();
    initActiveNavLink();
    initFormValidation();
    initResizeHandler();
    initConnectionOptimizer();
    initAnimationStyles();
    // initPageLoader(); // Uncomment if you want page loader
  }
};

// Start the application
init();

/*-----------------------------------*\
  #EXPORT FOR MODULE USE (OPTIONAL)
\*-----------------------------------*/

// If using modules, uncomment below
// export { 
//   initNavbarToggle,
//   initHeaderScroll,
//   initBackToTop,
//   initSmoothScroll,
//   initScrollReveal
// };