// ============================================
// IMAGE LAZY LOADING SYSTEM
// Improves page load performance
// ============================================

class LazyImageLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.01,
            loadingClass: options.loadingClass || 'lazy-loading',
            loadedClass: options.loadedClass || 'lazy-loaded',
            errorClass: options.errorClass || 'lazy-error',
            ...options
        };

        this.observer = null;
        this.images = [];
        this.init();
    }

    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.setupObserver();
            this.observeImages();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }

        // Re-observe on dynamic content
        this.setupMutationObserver();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
    }

    observeImages() {
        // Find all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');

        lazyImages.forEach(img => {
            this.images.push(img);
            if (this.observer) {
                this.observer.observe(img);
            }
        });
    }

    loadImage(img) {
        // Add loading class
        img.classList.add(this.options.loadingClass);

        // Create a new image to preload
        const tempImage = new Image();

        tempImage.onload = () => {
            this.applyImage(img, tempImage);
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.loadedClass);

            // Dispatch custom event
            img.dispatchEvent(new CustomEvent('lazyloaded', { detail: { img } }));
        };

        tempImage.onerror = () => {
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.errorClass);

            // Set fallback image if specified
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }

            // Dispatch error event
            img.dispatchEvent(new CustomEvent('lazyerror', { detail: { img } }));
        };

        // Start loading
        if (img.dataset.srcset) {
            tempImage.srcset = img.dataset.srcset;
        }
        if (img.dataset.src) {
            tempImage.src = img.dataset.src;
        }
    }

    applyImage(img, tempImage) {
        // Apply srcset if available
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }

        // Apply src
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        // Apply sizes if available
        if (img.dataset.sizes) {
            img.sizes = img.dataset.sizes;
            img.removeAttribute('data-sizes');
        }
    }

    loadAllImages() {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            }
        });
    }

    setupMutationObserver() {
        // Watch for new images added to the DOM
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the node itself is a lazy image
                        if (node.tagName === 'IMG' && (node.dataset.src || node.dataset.srcset)) {
                            if (this.observer) {
                                this.observer.observe(node);
                            }
                        }

                        // Check for lazy images within the node
                        const lazyImages = node.querySelectorAll?.('img[data-src], img[data-srcset]');
                        lazyImages?.forEach(img => {
                            if (this.observer) {
                                this.observer.observe(img);
                            }
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public method to manually trigger loading
    loadNow(selector) {
        const images = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];

        images.forEach(img => {
            if (img && (img.dataset.src || img.dataset.srcset)) {
                this.loadImage(img);
                if (this.observer) {
                    this.observer.unobserve(img);
                }
            }
        });
    }

    // Destroy the lazy loader
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ============================================
// BACKGROUND IMAGE LAZY LOADING
// ============================================

class LazyBackgroundLoader {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const bgImage = element.dataset.bgSrc;

                        if (bgImage) {
                            element.style.backgroundImage = `url(${bgImage})`;
                            element.removeAttribute('data-bg-src');
                            element.classList.add('bg-loaded');
                            observer.unobserve(element);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observe all elements with data-bg-src
            document.querySelectorAll('[data-bg-src]').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback
            document.querySelectorAll('[data-bg-src]').forEach(el => {
                el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
                el.removeAttribute('data-bg-src');
            });
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Convert existing images to lazy loading
function convertToLazyLoading(container = document) {
    const images = container.querySelectorAll('img[src]:not([data-src])');

    images.forEach(img => {
        // Skip if already converted or if it's above the fold
        if (img.dataset.src || img.getBoundingClientRect().top < window.innerHeight) {
            return;
        }

        // Store original src in data-src
        img.dataset.src = img.src;

        // Set a placeholder or blur
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E';

        // Add loading class
        img.classList.add('lazy-image');
    });
}

// Preload critical images
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

function initLazyLoading() {
    // Initialize image lazy loading
    window.lazyImageLoader = new LazyImageLoader({
        rootMargin: '100px',
        threshold: 0.01
    });

    // Initialize background lazy loading
    window.lazyBackgroundLoader = new LazyBackgroundLoader();

    // Add loading animation CSS
    addLazyLoadingStyles();
}

function addLazyLoadingStyles() {
    if (document.getElementById('lazy-loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'lazy-loading-styles';
    style.textContent = `
        /* Lazy loading states */
        img[data-src],
        img[data-srcset] {
            background-color: #f0f0f0;
            background-image: linear-gradient(
                90deg,
                #f0f0f0 0px,
                #f8f8f8 40px,
                #f0f0f0 80px
            );
            background-size: 200% 100%;
            animation: lazy-loading-shimmer 1.5s infinite;
        }

        img.lazy-loading {
            opacity: 0.6;
        }

        img.lazy-loaded {
            animation: lazy-fade-in 0.3s ease-in;
            background: none;
        }

        img.lazy-error {
            background-color: #ffebee;
            background-image: none;
        }

        @keyframes lazy-loading-shimmer {
            0% {
                background-position: -100% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }

        @keyframes lazy-fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Background lazy loading */
        [data-bg-src] {
            background-color: #f0f0f0;
        }

        [data-bg-src].bg-loaded {
            animation: lazy-fade-in 0.5s ease-in;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            img[data-src],
            img[data-srcset],
            [data-bg-src] {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LazyImageLoader = LazyImageLoader;
    window.LazyBackgroundLoader = LazyBackgroundLoader;
    window.convertToLazyLoading = convertToLazyLoading;
    window.preloadImages = preloadImages;
}
