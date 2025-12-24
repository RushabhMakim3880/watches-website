// ============================================
// UNIQUE HERO BANNER - Animations & Effects
// ============================================

class UniqueHero {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.typingAnimation();
        this.parallaxEffect();
        this.countUpAnimation();
        this.scrollTriggeredAnimations();
        this.mouseFollowEffect();
    }

    // Typing Animation for Subtitle
    typingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const texts = [
            'Precision Crafted Timepieces',
            'Swiss Engineering Excellence',
            'Timeless Luxury Watches',
            'Horological Masterpieces'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Pause at end
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        type();
    }

    // Enhanced Parallax Effect with Momentum
    parallaxEffect() {
        const watchCards = document.querySelectorAll('.watch-card');
        const particles = document.querySelectorAll('.particle');
        if (watchCards.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    // Parallax for watch cards
                    watchCards.forEach((card, index) => {
                        const speed = 0.3 * (index + 1);
                        const yPos = -(scrolled * speed);
                        card.style.transform = `translateY(${yPos}px)`;
                    });

                    // Parallax for particles
                    particles.forEach((particle, index) => {
                        const speed = 0.1 * (index % 3 + 1);
                        const yPos = -(scrolled * speed);
                        particle.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Count Up Animation for Numbers
    countUpAnimation() {
        const counters = document.querySelectorAll('.feature-number');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        };

        // Intersection Observer to trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Scroll-Triggered Animations
    scrollTriggeredAnimations() {
        const heroSection = document.querySelector('.unique-hero');
        if (!heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;

            // Fade out hero as user scrolls
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                heroSection.style.opacity = opacity;
            }
        });
    }

    // Mouse Follow Effect for Watch Cards
    mouseFollowEffect() {
        const watchCards = document.querySelectorAll('.watch-card');
        if (watchCards.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            watchCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;

                const deltaX = (this.mouseX - cardCenterX) / 50;
                const deltaY = (this.mouseY - cardCenterY) / 50;

                // Subtle tilt based on mouse position
                card.style.setProperty('--mouse-x', `${deltaX}deg`);
                card.style.setProperty('--mouse-y', `${deltaY}deg`);
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const uniqueHero = new UniqueHero();
});

// Smooth scroll for CTA buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
