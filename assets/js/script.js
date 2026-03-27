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
const sections = document.querySelectorAll('section[id]');
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
  #ACTIVE NAVIGATION LINK ON SCROLL (CORRIGÉ)
\*-----------------------------------*/

/**
 * Set active navigation link based on scroll position
 * Cette fonction gère correctement le changement de couleur des liens actifs
 */
const initActiveNavLink = () => {
  // Récupérer toutes les sections avec un ID
  const sections = document.querySelectorAll("section[id]");
  
  if (!sections.length) return;

  // Fonction pour mettre à jour le lien actif
  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 150; // Décalage pour le header fixe
    
    // Variable pour stocker la section actuelle
    let currentSection = null;
    
    // Trouver la section visible
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section;
      }
    });
    
    // Si aucune section n'est trouvée et qu'on est en haut de la page, activer "accueil"
    if (!currentSection && window.scrollY < 100) {
      const homeLink = document.querySelector('.navbar-link[href="index.html"], .navbar-link[href="#home"]');
      if (homeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        homeLink.classList.add('active');
      }
      return;
    }
    
    // Si une section est trouvée
    if (currentSection) {
      const sectionId = currentSection.getAttribute("id");
      const activeLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
      
      if (activeLink) {
        // Supprimer la classe active de tous les liens
        navLinks.forEach(link => link.classList.remove('active'));
        // Ajouter la classe active au lien correspondant
        activeLink.classList.add('active');
      }
    }
  };
  
  // Appeler la fonction au scroll avec throttle
  window.addEventListener("scroll", throttleRAF(updateActiveLink));
  
  // Appeler au chargement de la page
  updateActiveLink();
  
  // Appeler au redimensionnement (pour les changements de layout)
  window.addEventListener("resize", debounce(updateActiveLink, 100));
};

/*-----------------------------------*\
  #SMOOTH SCROLL FOR ANCHOR LINKS AVEC MISE À JOUR ACTIVE
\*-----------------------------------*/

/**
 * Initialize smooth scroll for all anchor links avec mise à jour de la classe active
 */
const initSmoothScroll = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculer la hauteur du header pour l'offset
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Scroll vers la section
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        
        // Mettre à jour la classe active immédiatement
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Mettre à jour l'URL sans recharger
        history.pushState(null, null, targetId);
        
        // Fermer le menu mobile si ouvert
        if (navbar && navbar.classList.contains('active')) {
          navbar.classList.remove('active');
          overlay.classList.remove('active');
          body.classList.remove('no-scroll');
        }
      }
    });
  });
};

/*-----------------------------------*\
  #INITIALISATION DES LIENS ACTIFS AU CHARGEMENT
\*-----------------------------------*/

/**
 * Initialiser les liens actifs en fonction de l'URL
 */
const initActiveLinksOnLoad = () => {
  // Vérifier si l'URL contient un hash
  const currentHash = window.location.hash;
  
  if (currentHash) {
    const activeLink = document.querySelector(`.navbar-link[href="${currentHash}"]`);
    if (activeLink) {
      navLinks.forEach(link => link.classList.remove('active'));
      activeLink.classList.add('active');
    }
  } else {
    // Si pas de hash et qu'on est en haut de page, activer "accueil"
    if (window.scrollY < 100) {
      const homeLink = document.querySelector('.navbar-link[href="index.html"], .navbar-link[href="#home"]');
      if (homeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        homeLink.classList.add('active');
      }
    }
  }
};

/*-----------------------------------*\
  #SCROLL REVEAL ANIMATION
\*-----------------------------------*/

/**
 * Initialize scroll reveal animations
 */
const initScrollReveal = () => {
  const revealSections = document.querySelectorAll('.section');
  if (!revealSections.length) return;

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
  revealSections.forEach(section => {
    observer.observe(section);
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
      const originalText = submitBtn.textContent;
      
      // Changer le texte du bouton pendant l'envoi
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
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
          showPopup('✅ Your package request has been sent successfully! We will contact you shortly.', 'success');
          contactForm.reset();
        } else {
          showPopup('❌ An error occurred. Please try again.', 'error');
        }
      })
      .catch(error => {
        showPopup('❌ Network error. Please check your connection.', 'error');
        console.error('Error:', error);
      })
      .finally(() => {
        submitBtn.textContent = originalText;
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

  // Allow click outside to close
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
    }
    
    @media (min-width: 992px) {
      .navbar-link.active {
        color: var(--dark-orange) !important;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(100%);
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
      initActiveNavLink();
      initActiveLinksOnLoad();
      initScrollReveal();
      initFormValidation();
      initResizeHandler();
      initConnectionOptimizer();
      initAnimationStyles();
    });
  } else {
    // DOM already loaded
    initNavbarToggle();
    initHeaderScroll();
    initBackToTop();
    initSmoothScroll();
    initActiveNavLink();
    initActiveLinksOnLoad();
    initScrollReveal();
    initFormValidation();
    initResizeHandler();
    initConnectionOptimizer();
    initAnimationStyles();
  }
};

// Start the application
init();