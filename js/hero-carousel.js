// ============================================
// HERO CAROUSEL - Dynamic Watch Display
// ============================================

class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.prevBtn = document.querySelector('.carousel-arrow.prev');
        this.nextBtn = document.querySelector('.carousel-arrow.next');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.isPlaying = true;

        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        // Set first slide as active
        this.showSlide(0);

        // Add event listeners
        this.addEventListeners();

        // Start autoplay
        this.startAutoPlay();
    }

    addEventListeners() {
        // Navigation arrows
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
                this.resetAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }

        // Navigation dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Pause on hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });

        // Touch/Swipe support for mobile
        this.addTouchSupport();
    }

    addTouchSupport() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;

        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.previousSlide();
            }
            this.resetAutoPlay();
        }
    }

    showSlide(index) {
        // Remove active class from all slides and dots
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        if (!this.isPlaying) return;

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        if (this.isPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }

    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroCarousel = new HeroCarousel();

    // Make it globally accessible if needed
    window.heroCarousel = heroCarousel;
});

// Smooth scroll function for CTA buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
