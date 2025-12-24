// ============================================
// CHRONOLUX - Accessibility Enhancements
// ============================================

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    setupKeyboardNavigation();
    setupFocusManagement();
    setupARIALabels();
    addSkipToContent();
    setupModalAccessibility();
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    // Handle Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            if (typeof modalSystem !== 'undefined' && modalSystem.close) {
                modalSystem.close();
            }

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    });

    // Handle Enter/Space on clickable elements
    const clickableElements = document.querySelectorAll('[onclick], .product-card, .collection-card');
    clickableElements.forEach(el => {
        // Make focusable if not already
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
        *:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        *:focus:not(:focus-visible) {
            outline: none;
        }

        *:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // Track focus for better UX
    let lastFocusedElement = null;

    document.addEventListener('focusin', (e) => {
        lastFocusedElement = e.target;
    });

    // Return focus when modal closes
    window.addEventListener('modalClosed', () => {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    });
}

/**
 * Setup ARIA labels for better screen reader support
 */
function setupARIALabels() {
    // Add ARIA labels to icon-only buttons
    const iconButtons = document.querySelectorAll('.nav-icon');
    iconButtons.forEach(btn => {
        if (!btn.hasAttribute('aria-label')) {
            const icon = btn.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-search')) {
                    btn.setAttribute('aria-label', 'Search');
                } else if (icon.classList.contains('fa-heart')) {
                    btn.setAttribute('aria-label', 'Wishlist');
                } else if (icon.classList.contains('fa-shopping-cart')) {
                    btn.setAttribute('aria-label', 'Shopping Cart');
                } else if (icon.classList.contains('fa-user')) {
                    btn.setAttribute('aria-label', 'Account');
                }
            }
        }
    });

    // Add ARIA live region for cart/wishlist updates
    if (!document.getElementById('aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    }

    // Add role="navigation" to nav elements
    const navElements = document.querySelectorAll('nav');
    navElements.forEach(nav => {
        if (!nav.hasAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
    });

    // Add role="main" to main content
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
        mainContent.id = mainContent.id || 'main-content';
    }
}

/**
 * Add skip to content link
 */
function addSkipToContent() {
    if (document.getElementById('skip-to-content')) return;

    const skipLink = document.createElement('a');
    skipLink.id = 'skip-to-content';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Setup modal accessibility (focus trap)
 */
function setupModalAccessibility() {
    // This will be called when a modal opens
    window.addEventListener('modalOpened', (e) => {
        const modal = e.detail.modal;
        if (modal) {
            trapFocus(modal);
        }
    });
}

/**
 * Trap focus within an element (for modals)
 * @param {HTMLElement} element - Element to trap focus in
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement.focus();

    // Handle Tab key
    const handleTab = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };

    element.addEventListener('keydown', handleTab);

    // Remove listener when modal closes
    window.addEventListener('modalClosed', () => {
        element.removeEventListener('keydown', handleTab);
    }, { once: true });
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Respect user's motion preferences
 */
function respectMotionPreferences() {
    if (prefersReducedMotion()) {
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize accessibility when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAccessibility();
        respectMotionPreferences();
    });
} else {
    initAccessibility();
    respectMotionPreferences();
}

// Export functions
if (typeof window !== 'undefined') {
    window.accessibility = {
        trapFocus,
        announceToScreenReader,
        prefersReducedMotion
    };
}
