// ============================================
// CHRONOLUX - Premium Effects & Interactions
// Advanced visual effects for luxury experience
// ============================================

/**
 * Initialize all premium effects
 */
function initPremiumEffects() {
    setupScrollAnimations();
    setupImageLazyLoad();
    setupHoverEffects();
    setupButtonRipples();
    setupParallax();
    setupCursorEffects();
}

/**
 * Enhanced scroll animations with stagger effect
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Auto-add reveal class to product cards
    document.querySelectorAll('.product-card, .collection-card, .blog-card').forEach((el, index) => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 0.05}s`;
            observer.observe(el);
        }
    });
}

/**
 * Enhanced lazy loading with blur-up effect
 */
function setupImageLazyLoad() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add blur effect initially
                img.style.filter = 'blur(10px)';
                img.style.transition = 'filter 0.3s';

                // Load the image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }

                // Remove blur when loaded
                img.onload = () => {
                    img.style.filter = 'blur(0)';
                    img.classList.add('loaded');
                };

                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all lazy images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Enhanced hover effects for product cards
 */
function setupHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const image = card.querySelector('.product-image');
        const addToCartBtn = card.querySelector('.add-to-cart');

        if (image) {
            card.addEventListener('mouseenter', () => {
                // Smooth zoom effect
                image.style.transform = 'scale(1.1)';

                // Show add to cart button
                if (addToCartBtn) {
                    addToCartBtn.style.opacity = '1';
                    addToCartBtn.style.transform = 'translateY(0)';
                }
            });

            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';

                if (addToCartBtn) {
                    addToCartBtn.style.opacity = '0';
                    addToCartBtn.style.transform = 'translateY(10px)';
                }
            });
        }
    });
}

/**
 * Material Design ripple effect for buttons
 */
function setupButtonRipples() {
    const buttons = document.querySelectorAll('.btn, button');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calculate position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Style ripple
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            // Add to button
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Parallax scrolling effect for hero sections
 */
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image, [data-parallax]');

    if (parallaxElements.length === 0) return;

    // Use requestAnimationFrame for smooth performance
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                parallaxElements.forEach(el => {
                    const speed = el.dataset.parallaxSpeed || 0.5;
                    const offset = scrolled * speed;
                    el.style.transform = `translateY(${offset}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Custom cursor effects for premium feel
 */
function setupCursorEffects() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update dot immediately
        dotX = mouseX;
        dotY = mouseY;
    });

    // Smooth cursor follow
    function animateCursor() {
        // Smooth follow with easing
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Expand cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .product-card, input, select');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

/**
 * Smooth scroll to element with offset
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset from top in pixels
 */
function smoothScrollTo(elementId, offset = 100) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Add shine effect to element
 * @param {HTMLElement} element - Element to add shine to
 */
function addShineEffect(element) {
    element.classList.add('hover-shine');
}

/**
 * Create floating particles effect
 * @param {HTMLElement} container - Container for particles
 * @param {number} count - Number of particles
 */
function createParticles(container, count = 20) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation delay
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';

        container.appendChild(particle);
    }
}

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element containing number
 * @param {number} target - Target number
 * @param {number} duration - Duration in ms
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuad = progress * (2 - progress);
        const current = Math.floor(easeOutQuad * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/**
 * Create toast notification with animation
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, info
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;

    // Add icon based on type
    const icon = document.createElement('i');
    if (type === 'success') icon.className = 'fas fa-check-circle';
    else if (type === 'error') icon.className = 'fas fa-exclamation-circle';
    else icon.className = 'fas fa-info-circle';

    toast.prepend(icon);

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * Add loading overlay to element
 * @param {HTMLElement} element - Element to add overlay to
 * @returns {HTMLElement} Overlay element
 */
function addLoadingOverlay(element) {
    const overlay = document.createElement('div');
    overlay.classList.add('loading-overlay');
    overlay.innerHTML = `
        <div class="spinner"></div>
        <p>Loading...</p>
    `;

    element.style.position = 'relative';
    element.appendChild(overlay);

    return overlay;
}

/**
 * Remove loading overlay
 * @param {HTMLElement} overlay - Overlay element to remove
 */
function removeLoadingOverlay(overlay) {
    if (overlay && overlay.parentElement) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

/**
 * Stagger animation for multiple elements
 * @param {NodeList} elements - Elements to animate
 * @param {string} animationClass - Animation class to add
 * @param {number} delay - Delay between elements in ms
 */
function staggerAnimation(elements, animationClass, delay = 100) {
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add(animationClass);
        }, index * delay);
    });
}

// Add CSS for custom cursor and ripple effect
const premiumStyles = document.createElement('style');
premiumStyles.textContent = `
    /* Custom Cursor */
    .custom-cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-red);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s, opacity 0.2s;
        opacity: 0.5;
    }
    
    .custom-cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--accent-red);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor.cursor-hover {
        transform: scale(1.5);
        opacity: 1;
    }
    
    /* Ripple Effect */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Toast Notifications */
    .toast {
        position: fixed;
        top: 100px;
        right: -300px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-xl);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transition: right 0.3s ease-out;
        min-width: 250px;
    }
    
    .toast-show {
        right: 20px;
    }
    
    .toast i {
        font-size: 1.25rem;
    }
    
    .toast-success {
        border-left: 4px solid var(--success-green);
    }
    
    .toast-success i {
        color: var(--success-green);
    }
    
    .toast-error {
        border-left: 4px solid var(--error-red);
    }
    
    .toast-error i {
        color: var(--error-red);
    }
    
    .toast-info {
        border-left: 4px solid var(--info-blue);
    }
    
    .toast-info i {
        color: var(--info-blue);
    }
    
    /* Loading Overlay */
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100;
        backdrop-filter: blur(5px);
    }
    
    .loading-overlay.fade-out {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    /* Particles */
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-red);
        border-radius: 50%;
        opacity: 0.3;
        animation: float 3s ease-in-out infinite;
    }
`;

document.head.appendChild(premiumStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumEffects);
} else {
    initPremiumEffects();
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.premiumEffects = {
        smoothScrollTo,
        addShineEffect,
        createParticles,
        animateCounter,
        showToast,
        addLoadingOverlay,
        removeLoadingOverlay,
        staggerAnimation
    };
}
