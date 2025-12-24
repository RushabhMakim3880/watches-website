// ============================================
// CHRONOLUX - Authentication System
// ============================================

/**
 * Authentication state management using localStorage
 */
const auth = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} remember - Remember me flag
     * @returns {boolean} Success status
     */
    login(email, password, remember = false) {
        // Validate inputs
        if (!email || !password) {
            console.error('Email and password are required');
            return false;
        }

        // In a real app, this would make an API call
        // For now, we'll simulate authentication
        const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString(),
            remember: remember
        };

        // Store user session
        if (remember) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', this.generateToken());
        } else {
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('authToken', this.generateToken());
        }

        console.log('User logged in successfully:', user.email);
        return true;
    },

    /**
     * Signup new user
     * @param {string} name - User full name
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {boolean} Success status
     */
    signup(name, email, password) {
        // Validate inputs
        if (!name || !email || !password) {
            console.error('Name, email, and password are required');
            return false;
        }

        // Check if user already exists (in localStorage)
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.find(u => u.email === email)) {
            console.error('User with this email already exists');
            return false;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password), // In real app, hash on server
            createdAt: new Date().toISOString()
        };

        // Save to users list
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Auto-login after signup
        this.login(email, password, false);

        console.log('User signed up successfully:', email);
        return true;
    },

    /**
     * Logout current user
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        console.log('User logged out');

        // Redirect to home page
        window.location.href = 'index.html';
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        const user = this.getCurrentUser();
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        return !!(user && token);
    },

    /**
     * Get current logged-in user
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    /**
     * Update user profile
     * @param {Object} updates - User profile updates
     * @returns {boolean} Success status
     */
    updateProfile(updates) {
        const user = this.getCurrentUser();
        if (!user) {
            console.error('No user logged in');
            return false;
        }

        const updatedUser = { ...user, ...updates };

        // Update in storage
        if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }

        console.log('User profile updated');
        return true;
    },

    /**
     * Check if route requires authentication
     * @param {string} returnUrl - URL to return to after login
     */
    checkProtectedRoute(returnUrl = null) {
        if (!this.isAuthenticated()) {
            // Store return URL
            if (returnUrl) {
                sessionStorage.setItem('returnUrl', returnUrl);
            }
            // Redirect to login
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Get return URL after login
     * @returns {string} Return URL or default
     */
    getReturnUrl() {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl');
        return returnUrl || 'index.html';
    },

    /**
     * Generate simple auth token (for demo purposes)
     * @returns {string} Auth token
     */
    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    },

    /**
     * Simple password hashing (for demo purposes only)
     * In production, use proper hashing on server-side
     * @param {string} password - Password to hash
     * @returns {string} Hashed password
     */
    hashPassword(password) {
        // This is NOT secure - just for demo
        return btoa(password);
    },

    /**
     * Update UI based on authentication status
     */
    updateUI() {
        const user = this.getCurrentUser();
        const accountIcon = document.getElementById('accountIcon');

        if (user && accountIcon) {
            // Show user name or email initial
            const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
            accountIcon.innerHTML = `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">${initial}</div>`;
            accountIcon.title = user.name || user.email;
        }
    }
};

/**
 * Initialize authentication on page load
 */
function initAuth() {
    // Update UI based on auth status
    auth.updateUI();

    // Add logout functionality to account dropdown (if exists)
    const accountIcon = document.getElementById('accountIcon');
    if (accountIcon && auth.isAuthenticated()) {
        accountIcon.addEventListener('click', () => {
            const user = auth.getCurrentUser();
            if (user) {
                showAccountModal();
            }
        });
    }
}

/**
 * Show account modal for logged-in users
 */
function showAccountModal() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const accountContent = `
        <div class="account-info" style="text-align: center; padding: var(--space-xl);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 600; margin: 0 auto var(--space-md);">
                ${user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <h3 style="margin-bottom: var(--space-sm);">${user.name || 'User'}</h3>
            <p style="color: var(--dark-grey); margin-bottom: var(--space-xl);">${user.email}</p>
            
            <div style="display: grid; gap: var(--space-md);">
                <button class="btn btn-secondary" onclick="window.location.href='track-order.html'">
                    <i class="fas fa-box"></i> My Orders
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='wishlist.html'">
                    <i class="fas fa-heart"></i> My Wishlist
                </button>
                <button class="btn btn-secondary" onclick="modalSystem.close(); auth.logout();" style="background: var(--error-red); color: white;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;

    if (typeof modalSystem !== 'undefined') {
        modalSystem.show({
            id: 'account-modal',
            title: 'My Account',
            content: accountContent,
            size: 'small',
            closeOnBackdrop: true
        });
    }
}

// Initialize auth when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
