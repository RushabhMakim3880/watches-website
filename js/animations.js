// ============================================
// CHRONOLUX - Animations & UX Enhancements
// ============================================

/**
 * Initialize all animations and UX enhancements
 */
function initAnimations() {
    setupScrollReveal();
    setupProductCardAnimations();
    setupLoadingStates();
    setupSmoothScroll();
}

/**
 * Setup scroll reveal animations using Intersection Observer
 */
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Auto-add reveal class to common elements
    const autoRevealSelectors = [
        '.product-card',
        '.collection-card',
        '.blog-card',
        '.feature-card',
        'section'
    ];

    autoRevealSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                // Add stagger delay
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            }
        });
    });
}

/**
 * Setup product card hover animations
 */
function setupProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const image = card.querySelector('.product-image');

        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
            });

            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
    });
}

/**
 * Setup loading states and skeleton screens
 */
function setupLoadingStates() {
    // Add loading class to elements that need it
    const loadingElements = document.querySelectorAll('[data-loading]');

    loadingElements.forEach(el => {
        el.classList.add('skeleton');

        // Simulate loading completion
        setTimeout(() => {
            el.classList.remove('skeleton');
            el.classList.add('loaded');
        }, 1000);
    });
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Create skeleton loading screen
 * @param {HTMLElement} container - Container element
 * @param {number} count - Number of skeleton items
 */
function createSkeletonScreen(container, count = 4) {
    const skeletonHTML = Array(count).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
        </div>
    `).join('');

    container.innerHTML = skeletonHTML;
}

/**
 * Show loading indicator
 * @param {string} message - Loading message
 * @returns {HTMLElement} Loading element
 */
function showLoading(message = 'Loading...') {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-indicator';
    loadingEl.innerHTML = `
        <div class="spinner"></div>
        <p>${message}</p>
    `;
    loadingEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: var(--space-xl);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        text-align: center;
    `;

    document.body.appendChild(loadingEl);
    return loadingEl;
}

/**
 * Hide loading indicator
 * @param {HTMLElement} loadingEl - Loading element to remove
 */
function hideLoading(loadingEl) {
    if (loadingEl && loadingEl.parentElement) {
        loadingEl.remove();
    }
}

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element containing the number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Animation duration in ms
 */
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';

    let opacity = 0;
    const increment = 16 / duration;

    const timer = setInterval(() => {
        opacity += increment;
        if (opacity >= 1) {
            element.style.opacity = '1';
            clearInterval(timer);
        } else {
            element.style.opacity = opacity.toString();
        }
    }, 16);
}

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Animation duration in ms
 */
function fadeOut(element, duration = 300) {
    let opacity = 1;
    const increment = 16 / duration;

    const timer = setInterval(() => {
        opacity -= increment;
        if (opacity <= 0) {
            element.style.opacity = '0';
            element.style.display = 'none';
            clearInterval(timer);
        } else {
            element.style.opacity = opacity.toString();
        }
    }, 16);
}

/**
 * Slide down element
 * @param {HTMLElement} element - Element to slide down
 * @param {number} duration - Animation duration in ms
 */
function slideDown(element, duration = 300) {
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    const targetHeight = element.scrollHeight;
    let height = 0;
    const increment = (targetHeight / duration) * 16;

    const timer = setInterval(() => {
        height += increment;
        if (height >= targetHeight) {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
            clearInterval(timer);
        } else {
            element.style.height = height + 'px';
        }
    }, 16);
}

/**
 * Slide up element
 * @param {HTMLElement} element - Element to slide up
 * @param {number} duration - Animation duration in ms
 */
function slideUp(element, duration = 300) {
    const targetHeight = element.scrollHeight;
    element.style.height = targetHeight + 'px';
    element.style.overflow = 'hidden';

    let height = targetHeight;
    const increment = (targetHeight / duration) * 16;

    const timer = setInterval(() => {
        height -= increment;
        if (height <= 0) {
            element.style.height = '0';
            element.style.display = 'none';
            clearInterval(timer);
        } else {
            element.style.height = height + 'px';
        }
    }, 16);
}

/**
 * Add parallax effect to element
 * @param {HTMLElement} element - Element for parallax
 * @param {number} speed - Parallax speed (0-1)
 */
function addParallax(element, speed = 0.5) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const offset = scrolled * speed;
        element.style.transform = `translateY(${offset}px)`;
    });
}

/**
 * Add CSS class with animation
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to add
 * @param {number} duration - Duration to keep class (0 = permanent)
 */
function addClassWithAnimation(element, className, duration = 0) {
    element.classList.add(className);

    if (duration > 0) {
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }
}

/**
 * Pulse animation
 * @param {HTMLElement} element - Element to pulse
 * @param {number} count - Number of pulses
 */
function pulse(element, count = 1) {
    let pulseCount = 0;

    const doPulse = () => {
        element.style.animation = 'pulse 0.5s ease-in-out';

        setTimeout(() => {
            element.style.animation = '';
            pulseCount++;

            if (pulseCount < count) {
                setTimeout(doPulse, 100);
            }
        }, 500);
    };

    doPulse();
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.animations = {
        fadeIn,
        fadeOut,
        slideDown,
        slideUp,
        pulse,
        animateNumber,
        showLoading,
        hideLoading,
        createSkeletonScreen,
        addParallax,
        addClassWithAnimation
    };
}
