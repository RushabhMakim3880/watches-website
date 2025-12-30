// ============================================
// MOBILE NAVIGATION SYSTEM
// Handles hamburger menu, drawer, and bottom nav
// ============================================

class MobileNavigation {
    constructor() {
        this.menuToggle = null;
        this.menuDrawer = null;
        this.menuOverlay = null;
        this.bottomNav = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createMobileMenu();
        this.createBottomNav();
        this.attachEventListeners();
        this.updateUserSection();
    }

    createMobileMenu() {
        // Check if mobile menu already exists
        if (document.querySelector('.mobile-menu-drawer')) {
            return;
        }

        // Create mobile menu toggle button
        const header = document.querySelector('.header .container');
        if (!header) return;

        const navIcons = header.querySelector('.nav-icons');
        if (!navIcons) return;

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle mobile menu');
        toggleBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        navIcons.appendChild(toggleBtn);
        this.menuToggle = toggleBtn;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        this.menuOverlay = overlay;

        // Create drawer
        const drawer = document.createElement('div');
        drawer.className = 'mobile-menu-drawer';
        drawer.innerHTML = this.getMobileMenuHTML();
        document.body.appendChild(drawer);
        this.menuDrawer = drawer;
    }

    getMobileMenuHTML() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userName') || 'Guest';
        const userEmail = localStorage.getItem('userEmail') || '';

        return `
            <div class="mobile-menu-header">
                <div class="logo">TM WATCH</div>
                <button class="mobile-menu-close" aria-label="Close menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="mobile-menu-content">
                ${isLoggedIn ? `
                    <div class="mobile-menu-user">
                        <div class="user-info">
                            <div class="user-avatar">${userName.charAt(0).toUpperCase()}</div>
                            <div class="user-details">
                                <h4>${userName}</h4>
                                <p>${userEmail}</p>
                            </div>
                        </div>
                        <div class="mobile-menu-actions">
                            <a href="profile.html" class="btn btn-primary btn-sm">My Profile</a>
                        </div>
                    </div>
                ` : `
                    <div class="mobile-menu-user logged-out">
                        <p style="margin-bottom: 12px; color: var(--dark-grey);">Sign in for the best experience</p>
                        <div class="mobile-menu-actions">
                            <a href="login.html" class="btn btn-primary btn-sm">Login</a>
                            <a href="login.html" class="btn btn-secondary btn-sm">Sign Up</a>
                        </div>
                    </div>
                `}

                <ul class="mobile-nav-links">
                    <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="men.html"><i class="fas fa-male"></i> Men's Watches</a></li>
                    <li><a href="women.html"><i class="fas fa-female"></i> Women's Watches</a></li>
                    <li><a href="collections.html"><i class="fas fa-gem"></i> Collections</a></li>
                    <li><a href="new-arrivals.html"><i class="fas fa-star"></i> New Arrivals</a></li>
                    <li><a href="sale.html"><i class="fas fa-tag"></i> Sale</a></li>
                    <li><a href="about.html"><i class="fas fa-info-circle"></i> About Us</a></li>
                    <li><a href="contact.html"><i class="fas fa-envelope"></i> Contact</a></li>
                    <li><a href="track-order.html"><i class="fas fa-shipping-fast"></i> Track Order</a></li>
                    ${isLoggedIn ? '<li><a href="#" id="mobile-logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>' : ''}
                </ul>
            </div>
        `;
    }

    createBottomNav() {
        // Check if bottom nav already exists
        if (document.querySelector('.bottom-nav')) {
            return;
        }

        const bottomNav = document.createElement('div');
        bottomNav.className = 'bottom-nav';
        bottomNav.innerHTML = this.getBottomNavHTML();
        document.body.appendChild(bottomNav);
        this.bottomNav = bottomNav;

        // Update active state based on current page
        this.updateBottomNavActive();
    }

    getBottomNavHTML() {
        const cartCount = this.getCartCount();
        const wishlistCount = this.getWishlistCount();
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        return `
            <div class="bottom-nav-container">
                <a href="index.html" class="bottom-nav-item" data-page="home">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <a href="collections.html" class="bottom-nav-item" data-page="collections">
                    <i class="fas fa-th"></i>
                    <span>Shop</span>
                </a>
                <a href="cart.html" class="bottom-nav-item" data-page="cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                    ${cartCount > 0 ? `<span class="badge">${cartCount}</span>` : ''}
                </a>
                <a href="wishlist.html" class="bottom-nav-item" data-page="wishlist">
                    <i class="fas fa-heart"></i>
                    <span>Wishlist</span>
                    ${wishlistCount > 0 ? `<span class="badge">${wishlistCount}</span>` : ''}
                </a>
                <a href="${isLoggedIn ? 'profile.html' : 'login.html'}" class="bottom-nav-item" data-page="profile">
                    <i class="fas fa-user"></i>
                    <span>Account</span>
                </a>
            </div>
        `;
    }

    attachEventListeners() {
        // Toggle menu
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu
        if (this.menuDrawer) {
            const closeBtn = this.menuDrawer.querySelector('.mobile-menu-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeMenu());
            }

            // Logout button
            const logoutBtn = this.menuDrawer.querySelector('#mobile-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
        }

        // Close on overlay click
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.closeMenu());
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Prevent body scroll when menu is open
        this.menuDrawer?.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.stopPropagation();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.menuToggle?.classList.add('active');
        this.menuDrawer?.classList.add('active');
        this.menuOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.isOpen = false;
        this.menuToggle?.classList.remove('active');
        this.menuDrawer?.classList.remove('active');
        this.menuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateUserSection() {
        if (!this.menuDrawer) return;

        const content = this.menuDrawer.querySelector('.mobile-menu-content');
        if (content) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const userName = localStorage.getItem('userName') || 'Guest';
            const userEmail = localStorage.getItem('userEmail') || '';

            const userSection = content.querySelector('.mobile-menu-user');
            if (userSection) {
                if (isLoggedIn) {
                    userSection.className = 'mobile-menu-user';
                    userSection.innerHTML = `
                        <div class="user-info">
                            <div class="user-avatar">${userName.charAt(0).toUpperCase()}</div>
                            <div class="user-details">
                                <h4>${userName}</h4>
                                <p>${userEmail}</p>
                            </div>
                        </div>
                        <div class="mobile-menu-actions">
                            <a href="profile.html" class="btn btn-primary btn-sm">My Profile</a>
                        </div>
                    `;
                } else {
                    userSection.className = 'mobile-menu-user logged-out';
                    userSection.innerHTML = `
                        <p style="margin-bottom: 12px; color: var(--dark-grey);">Sign in for the best experience</p>
                        <div class="mobile-menu-actions">
                            <a href="login.html" class="btn btn-primary btn-sm">Login</a>
                            <a href="login.html" class="btn btn-secondary btn-sm">Sign Up</a>
                        </div>
                    `;
                }
            }
        }
    }

    updateBottomNavActive() {
        if (!this.bottomNav) return;

        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const items = this.bottomNav.querySelectorAll('.bottom-nav-item');

        items.forEach(item => {
            const page = item.getAttribute('data-page');
            if (currentPage.includes(page) || (currentPage === 'index' && page === 'home')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateCartBadge() {
        const cartCount = this.getCartCount();
        const cartItem = this.bottomNav?.querySelector('[data-page="cart"]');

        if (cartItem) {
            const existingBadge = cartItem.querySelector('.badge');
            if (cartCount > 0) {
                if (existingBadge) {
                    existingBadge.textContent = cartCount;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = cartCount;
                    cartItem.appendChild(badge);
                }
            } else {
                existingBadge?.remove();
            }
        }
    }

    updateWishlistBadge() {
        const wishlistCount = this.getWishlistCount();
        const wishlistItem = this.bottomNav?.querySelector('[data-page="wishlist"]');

        if (wishlistItem) {
            const existingBadge = wishlistItem.querySelector('.badge');
            if (wishlistCount > 0) {
                if (existingBadge) {
                    existingBadge.textContent = wishlistCount;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = wishlistCount;
                    wishlistItem.appendChild(badge);
                }
            } else {
                existingBadge?.remove();
            }
        }
    }

    getCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            return cart.reduce((total, item) => total + (item.quantity || 1), 0);
        } catch {
            return 0;
        }
    }

    getWishlistCount() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            return wishlist.length;
        } catch {
            return 0;
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        }
    }

    refresh() {
        this.updateUserSection();
        this.updateCartBadge();
        this.updateWishlistBadge();
        this.updateBottomNavActive();
    }
}

// Initialize mobile navigation
const mobileNav = new MobileNavigation();

// Update badges when cart/wishlist changes
window.addEventListener('storage', () => {
    mobileNav.refresh();
});

// Custom event for cart/wishlist updates
window.addEventListener('cartUpdated', () => {
    mobileNav.updateCartBadge();
});

window.addEventListener('wishlistUpdated', () => {
    mobileNav.updateWishlistBadge();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.mobileNav = mobileNav;
}
