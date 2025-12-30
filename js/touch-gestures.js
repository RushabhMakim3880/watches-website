// ============================================
// TOUCH GESTURES FOR MOBILE
// Swipe, pinch-to-zoom, long-press
// ============================================

class TouchGestures {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
        this.longPressTimer = null;
        this.pinchDistance = 0;

        this.init();
    }

    init() {
        this.setupProductImageSwipe();
        this.setupPinchZoom();
        this.setupPullToRefresh();
        this.setupSwipeToDelete();
    }

    // ============================================
    // PRODUCT IMAGE SWIPE GALLERY
    // ============================================
    setupProductImageSwipe() {
        const imageContainers = document.querySelectorAll('.product-image-gallery, .product-detail-images');

        imageContainers.forEach(container => {
            let currentIndex = 0;
            const images = container.querySelectorAll('img');

            if (images.length <= 1) return;

            container.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.touchEndY = e.changedTouches[0].screenY;

                const deltaX = this.touchEndX - this.touchStartX;
                const deltaY = Math.abs(e.changedTouches[0].screenY - this.touchStartY);

                // Only swipe if horizontal movement is greater than vertical
                if (Math.abs(deltaX) > 50 && deltaY < 50) {
                    if (deltaX > 0 && currentIndex > 0) {
                        // Swipe right - previous image
                        currentIndex--;
                        this.showImage(images, currentIndex);
                    } else if (deltaX < 0 && currentIndex < images.length - 1) {
                        // Swipe left - next image
                        currentIndex++;
                        this.showImage(images, currentIndex);
                    }
                }
            }, { passive: true });

            // Add indicators
            this.addImageIndicators(container, images.length, currentIndex);
        });
    }

    showImage(images, index) {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });

        // Update indicators
        const indicators = document.querySelectorAll('.image-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    addImageIndicators(container, count, activeIndex) {
        if (count <= 1) return;

        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'image-indicators';

        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'image-indicator';
            if (i === activeIndex) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        }

        container.appendChild(indicatorsContainer);
    }

    // ============================================
    // PINCH TO ZOOM
    // ============================================
    setupPinchZoom() {
        const zoomableImages = document.querySelectorAll('.product-image, .zoomable');

        zoomableImages.forEach(img => {
            let scale = 1;
            let initialDistance = 0;

            img.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                    this.pinchDistance = initialDistance;
                }
            }, { passive: true });

            img.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();

                    const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                    const scaleChange = currentDistance / initialDistance;
                    scale = Math.min(Math.max(1, scaleChange), 3); // Limit between 1x and 3x

                    img.style.transform = `scale(${scale})`;
                    img.style.transition = 'none';
                }
            });

            img.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    // Reset zoom with animation
                    setTimeout(() => {
                        img.style.transition = 'transform 0.3s ease';
                        img.style.transform = 'scale(1)';
                    }, 100);
                }
            }, { passive: true });
        });
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ============================================
    // PULL TO REFRESH
    // ============================================
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pulling = false;
        const threshold = 80;

        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-to-refresh-indicator';
        refreshIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
        document.body.insertBefore(refreshIndicator, document.body.firstChild);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;

            currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;

            if (pullDistance > 0 && pullDistance < threshold * 2) {
                refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
                refreshIndicator.style.opacity = Math.min(pullDistance / threshold, 1);

                if (pullDistance > threshold) {
                    refreshIndicator.classList.add('ready');
                } else {
                    refreshIndicator.classList.remove('ready');
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (!pulling) return;

            const pullDistance = currentY - startY;

            if (pullDistance > threshold) {
                refreshIndicator.classList.add('refreshing');
                this.refreshPage();
            }

            refreshIndicator.style.transform = 'translateY(0)';
            refreshIndicator.style.opacity = '0';
            refreshIndicator.classList.remove('ready');

            pulling = false;
        }, { passive: true });
    }

    refreshPage() {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    // ============================================
    // SWIPE TO DELETE (Cart Items)
    // ============================================
    setupSwipeToDelete() {
        const cartItems = document.querySelectorAll('.cart-item, .swipeable-item');

        cartItems.forEach(item => {
            let startX = 0;
            let currentX = 0;
            let swiping = false;

            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                swiping = true;
            }, { passive: true });

            item.addEventListener('touchmove', (e) => {
                if (!swiping) return;

                currentX = e.touches[0].clientX;
                const deltaX = currentX - startX;

                // Only allow left swipe
                if (deltaX < 0) {
                    item.style.transform = `translateX(${Math.max(deltaX, -100)}px)`;
                    item.style.transition = 'none';
                }
            }, { passive: true });

            item.addEventListener('touchend', () => {
                if (!swiping) return;

                const deltaX = currentX - startX;

                if (deltaX < -50) {
                    // Show delete button
                    item.style.transform = 'translateX(-80px)';
                    item.classList.add('swiped');
                    this.showDeleteButton(item);
                } else {
                    // Reset position
                    item.style.transform = 'translateX(0)';
                    item.classList.remove('swiped');
                }

                item.style.transition = 'transform 0.3s ease';
                swiping = false;
            }, { passive: true });
        });
    }

    showDeleteButton(item) {
        if (item.querySelector('.swipe-delete-btn')) return;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'swipe-delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.onclick = () => {
            item.style.transform = 'translateX(-100%)';
            setTimeout(() => item.remove(), 300);
        };

        item.appendChild(deleteBtn);
    }

    // ============================================
    // LONG PRESS
    // ============================================
    setupLongPress(element, callback) {
        element.addEventListener('touchstart', (e) => {
            this.longPressTimer = setTimeout(() => {
                callback(e);
                navigator.vibrate?.(50); // Haptic feedback
            }, 500);
        }, { passive: true });

        element.addEventListener('touchend', () => {
            clearTimeout(this.longPressTimer);
        }, { passive: true });

        element.addEventListener('touchmove', () => {
            clearTimeout(this.longPressTimer);
        }, { passive: true });
    }
}

// ============================================
// TOUCH GESTURE STYLES
// ============================================
const gestureStyles = document.createElement('style');
gestureStyles.textContent = `
    /* Image Indicators */
    .image-indicators {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        z-index: 10;
    }

    .image-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transition: all 0.3s;
    }

    .image-indicator.active {
        background: white;
        width: 24px;
        border-radius: 4px;
    }

    /* Pull to Refresh */
    .pull-to-refresh-indicator {
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 40px;
        background: #FF006E;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.2s;
    }

    .pull-to-refresh-indicator.ready i {
        animation: spin 1s linear infinite;
    }

    .pull-to-refresh-indicator.refreshing i {
        animation: spin 0.5s linear infinite;
    }

    /* Swipe to Delete */
    .cart-item,
    .swipeable-item {
        position: relative;
        overflow: hidden;
    }

    .swipe-delete-btn {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: #f44336;
        color: white;
        border: none;
        padding: 0 20px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1;
    }

    /* Pinch Zoom */
    .product-image,
    .zoomable {
        touch-action: pan-x pan-y pinch-zoom;
        user-select: none;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(gestureStyles);

// ============================================
// INITIALIZE TOUCH GESTURES
// ============================================
let touchGestures;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        touchGestures = new TouchGestures();
    });
} else {
    touchGestures = new TouchGestures();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.touchGestures = touchGestures;
}
