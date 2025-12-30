/* ========================================
   Skjønnhetskollektivet - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initActiveNavigation();
});

/* ----------------------------------------
   Header Scroll Effect
   ---------------------------------------- */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const isHomePage = header.classList.contains('transparent');
    const scrollThreshold = 50;

    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            if (isHomePage) {
                header.classList.remove('transparent');
            }
        } else {
            header.classList.remove('scrolled');
            if (isHomePage) {
                header.classList.add('transparent');
            }
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ----------------------------------------
   Mobile Menu
   ---------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-mobile .nav-link');

    if (!menuToggle || !navMobile) return;

    function openMenu() {
        menuToggle.classList.add('active');
        navMobile.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (navMobile.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMobile.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && navMobile.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ----------------------------------------
   Smooth Scroll Navigation
   ---------------------------------------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ----------------------------------------
   Scroll Animations
   ---------------------------------------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if (animatedElements.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
}

/* ----------------------------------------
   Contact Form Validation
   ---------------------------------------- */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const formSuccess = document.querySelector('.form-success');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Get form fields
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const phone = form.querySelector('#phone');
        const treatment = form.querySelector('#treatment');
        const message = form.querySelector('#message');

        let isValid = true;

        // Validate name
        if (name && !name.value.trim()) {
            showFieldError(name, 'Vennligst fyll inn navnet ditt');
            isValid = false;
        }

        // Validate email
        if (email && !isValidEmail(email.value)) {
            showFieldError(email, 'Vennligst fyll inn en gyldig e-postadresse');
            isValid = false;
        }

        // Validate phone (optional but if filled, must be valid)
        if (phone && phone.value.trim() && !isValidPhone(phone.value)) {
            showFieldError(phone, 'Vennligst fyll inn et gyldig telefonnummer');
            isValid = false;
        }

        // Validate treatment selection
        if (treatment && !treatment.value) {
            showFieldError(treatment, 'Vennligst velg en behandlingstype');
            isValid = false;
        }

        // Validate message
        if (message && !message.value.trim()) {
            showFieldError(message, 'Vennligst skriv en melding');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            setTimeout(() => {
                form.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.add('show');
                }
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send melding';
            }, 1500);
        }
    });

    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const fieldName = field.getAttribute('id');
        clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    showFieldError(field, 'Vennligst fyll inn navnet ditt');
                }
                break;
            case 'email':
                if (!isValidEmail(field.value)) {
                    showFieldError(field, 'Vennligst fyll inn en gyldig e-postadresse');
                }
                break;
            case 'phone':
                if (field.value.trim() && !isValidPhone(field.value)) {
                    showFieldError(field, 'Vennligst fyll inn et gyldig telefonnummer');
                }
                break;
            case 'treatment':
                if (!field.value) {
                    showFieldError(field, 'Vennligst velg en behandlingstype');
                }
                break;
            case 'message':
                if (!field.value.trim()) {
                    showFieldError(field, 'Vennligst skriv en melding');
                }
                break;
        }
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function clearErrors() {
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });

        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.remove();
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isValidPhone(phone) {
        const cleaned = phone.replace(/\s/g, '');
        const re = /^(\+47)?[0-9]{8}$/;
        return re.test(cleaned);
    }
}

/* ----------------------------------------
   Active Navigation Highlight
   ---------------------------------------- */
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ----------------------------------------
   Utility Functions
   ---------------------------------------- */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit = 100) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ----------------------------------------
   Lazy Loading Images (Native Support)
   ---------------------------------------- */
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
