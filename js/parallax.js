/* ============================================
   PARALLAX SCROLLING FUNCTIONALITY
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        // Update scroll progress
        function updateScrollProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateScrollProgress);

        // Scroll reveal functionality
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

        function revealOnScroll() {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;

                // Reveal when element is 20% into viewport
                if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                    element.classList.add('revealed');
                }
            });
        }

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check

        // Add scroll reveal classes to existing elements
        function addScrollRevealClasses() {
            // Add to collection cards
            document.querySelectorAll('.collection-card').forEach((card, index) => {
                if (index % 2 === 0) {
                    card.classList.add('scroll-reveal-left');
                } else {
                    card.classList.add('scroll-reveal-right');
                }
            });

            // Add to product cards
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.add('scroll-reveal-scale');
            });

            // Add to blog cards
            document.querySelectorAll('.blog-card').forEach(card => {
                card.classList.add('scroll-reveal');
            });

            // Add to section headers
            document.querySelectorAll('.section-header').forEach(header => {
                header.classList.add('scroll-reveal');
            });
        }

        addScrollRevealClasses();

        // Parallax effect for images and elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        function applyParallax() {
            const scrolled = window.scrollY;

            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(?{yPos}px)`;
            });
        }

        window.addEventListener('scroll', applyParallax);

        // Mouse parallax effect for product cards
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                const img = card.querySelector('.product-image-container');
                if (img) {
                    img.style.transform = `perspective(1000px) rotateX(?{rotateX}deg) rotateY(?{rotateY}deg) translateZ(20px)`;
                }
            });

            card.addEventListener('mouseleave', function () {
                const img = card.querySelector('.product-image-container');
                if (img) {
                    img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                }
            });
        });

        // Parallax background for sections
        const parallaxSections = document.querySelectorAll('.section');

        function createParallaxBackground() {
            parallaxSections.forEach((section, index) => {
                // Skip hero section
                if (section.classList.contains('unique-hero')) return;

                // Add parallax effect to every other section
                if (index % 2 === 0) {
                    section.style.position = 'relative';
                    section.style.overflow = 'hidden';

                    const parallaxBg = document.createElement('div');
                    parallaxBg.className = 'parallax-layer parallax-layer-back';
                    parallaxBg.style.cssText = `
            position: absolute;
            top: -50%;
            left: -10%;
            width: 120%;
            height: 200%;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(255, 0, 110, 0.05));
            pointer-events: none;
            z-index: 0;
          `;
                    section.insertBefore(parallaxBg, section.firstChild);

                    // Make sure content is above background
                    Array.from(section.children).forEach(child => {
                        if (child !== parallaxBg) {
                            child.style.position = 'relative';
                            child.style.zIndex = '1';
                        }
                    });
                }
            });
        }

        createParallaxBackground();

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Stagger animation for product grids
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.classList.add('stagger-animation');
        }

        const collectionsGrid = document.querySelector('.collections-grid');
        if (collectionsGrid) {
            collectionsGrid.classList.add('stagger-animation');
        }

        // Parallax text effect
        const parallaxTexts = document.querySelectorAll('h1, h2, h3');

        function parallaxTextEffect() {
            const scrolled = window.scrollY;

            parallaxTexts.forEach(text => {
                const rect = text.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = 0.3;
                    const yPos = (window.innerHeight - rect.top) * speed;
                    text.style.transform = `translateY(-?{yPos * 0.1}px)`;
                }
            });
        }

        window.addEventListener('scroll', parallaxTextEffect);

        // Performance optimization: throttle scroll events
        let ticking = false;

        function optimizedScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateScrollProgress();
                    revealOnScroll();
                    applyParallax();
                    parallaxTextEffect();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', optimizedScroll);

        // Intersection Observer for better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all scroll reveal elements
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
            observer.observe(el);
        });

        console.log('✨ Parallax effects initialized');
    });

})();
