/* ==========================================================================
   JOLLY CABS — CORE JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. SCROLL PROGRESS BAR & NAVBAR SCROLL EFFECT */
  const progressBar = document.querySelector('.scroll-progress-bar');
  const nav = document.querySelector('.navbar');

  const handleScroll = () => {
    // Scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const pct = (window.scrollY / scrollHeight) * 100;
      if (progressBar) {
        progressBar.style.width = pct + '%';
      }
    }

    // Navbar scroll effect
    if (nav) {
      if (nav.classList.contains('navbar-home')) {
        if (window.scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Execute on initial load to set state

  /* 2. HAMBURGER MENU / DRAWER ACTION */
  const hamburgerBtn = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const overlay = document.querySelector('.drawer-overlay');

  if (hamburgerBtn && drawer) {
    // Open drawer
    hamburgerBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      if (overlay) {
        overlay.classList.add('show');
      }
      document.body.style.overflow = 'hidden'; // prevent scrolling behind overlay
    });

    // Close drawer helper
    const closeDrawer = () => {
      drawer.classList.remove('open');
      if (overlay) {
        overlay.classList.remove('show');
      }
      document.body.style.overflow = '';
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Close on mobile menu link click
    const drawerLinks = document.querySelectorAll('.mobile-nav-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* 3. INTERACTIVE STATS COUNTER ANIMATION */
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    let animated = false;

    const countUp = (element) => {
      const target = parseFloat(element.getAttribute('data-target'));
      const duration = 2000; // Total duration in ms
      const steps = 60; // Steps of animation
      const stepTime = duration / steps;
      let currentVal = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          clearInterval(timer);
          // Format based on integer or float
          if (Number.isInteger(target)) {
            element.textContent = target;
          } else {
            element.textContent = target.toFixed(1);
          }
        } else {
          if (Number.isInteger(target)) {
            element.textContent = Math.floor(currentVal);
          } else {
            element.textContent = currentVal.toFixed(1);
          }
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const counters = document.querySelectorAll('.stat-number-val');
          counters.forEach(counter => countUp(counter));
        }
      });
    }, {
      threshold: 0.4 // Trigger when 40% visible
    });

    observer.observe(statsSection);
  }

  /* 4. AOS ANIMATION INITIALIZATION */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80
    });
  } else {
    document.body.classList.add('no-aos');
  }

  /* 5. TESTIMONIALS SWIPER CAROUSEL */
  const swiperContainer = document.querySelector('.testimonial-swiper');
  if (swiperContainer && typeof Swiper !== 'undefined') {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    });
  }

  /* 6. FORM VALIDATION (booking.html & contact.html) */
  const contactForm = document.getElementById('contactForm');
  const bookingForm = document.getElementById('bookingForm');

  const indianMobileRegex = /^[6-9]\d{9}$/;

  const validateField = (input, condition, errorMsg) => {
    const errorContainer = input.nextElementSibling;
    if (!condition) {
      input.classList.add('error');
      if (errorContainer && errorContainer.classList.contains('form-error-msg')) {
        errorContainer.textContent = errorMsg;
        errorContainer.style.display = 'block';
      }
      return false;
    } else {
      input.classList.remove('error');
      if (errorContainer && errorContainer.classList.contains('form-error-msg')) {
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
      }
      return true;
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const mobileInput = document.getElementById('contactMobile');
      
      const isNameValid = validateField(nameInput, nameInput.value.trim() !== '', 'Full Name is required.');
      const isMobileValid = validateField(mobileInput, indianMobileRegex.test(mobileInput.value.trim()), 'Enter a valid 10-digit Indian mobile number.');

      if (isNameValid && isMobileValid) {
        // Hide form and show success message card
        contactForm.style.display = 'none';
        const successCard = document.getElementById('contactSuccessCard');
        if (successCard) {
          successCard.style.display = 'block';
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('bookingName');
      const mobileInput = document.getElementById('bookingMobile');
      const pickupInput = document.getElementById('bookingPickup');
      const dropInput = document.getElementById('bookingDrop');
      const dateInput = document.getElementById('bookingDate');
      const timeInput = document.getElementById('bookingTime');

      const isNameValid = validateField(nameInput, nameInput.value.trim() !== '', 'Full Name is required.');
      const isMobileValid = validateField(mobileInput, indianMobileRegex.test(mobileInput.value.trim()), 'Enter a valid 10-digit Indian mobile number.');
      const isPickupValid = validateField(pickupInput, pickupInput.value.trim() !== '', 'Pickup Location is required.');
      const isDropValid = validateField(dropInput, dropInput.value.trim() !== '', 'Drop Location is required.');
      const isDateValid = validateField(dateInput, dateInput.value.trim() !== '', 'Travel Date is required.');
      const isTimeValid = validateField(timeInput, timeInput.value.trim() !== '', 'Pickup Time is required.');

      if (isNameValid && isMobileValid && isPickupValid && isDropValid && isDateValid && isTimeValid) {
        // Hide form and show success message card
        bookingForm.style.display = 'none';
        const successCard = document.getElementById('bookingSuccessCard');
        if (successCard) {
          successCard.style.display = 'block';
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  /* 7. FLEET FILTER FUNCTIONALITY (fleet.html) */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const carCards = document.querySelectorAll('.fleet-grid .car-card');

  if (filterButtons.length > 0 && carCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        carCards.forEach(card => {
          const cardType = card.getAttribute('data-type');
          if (filterValue === 'all' || cardType === filterValue) {
            card.classList.remove('hide');
            card.classList.add('show');
          } else {
            card.classList.remove('show');
            card.classList.add('hide');
          }
        });
        
        // Refresh AOS to calculate offsets for visible elements
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      });
    });
  }
});
