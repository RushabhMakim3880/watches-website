// User Dropdown Menu with Dark Mode Toggle
(function () {
    'use strict';

    // Check if user is logged in
    function isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    // Get user data
    function getUserData() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Initialize dropdown
    function initUserDropdown() {
        const token = localStorage.getItem('token');
        const userDropdown = document.getElementById('userDropdown');
        const loginBtn = document.getElementById('loginBtn');

        if (!userDropdown) return;

        if (token) {
            // User is logged in - show dropdown, hide login
            userDropdown.classList.add('active');
            if (loginBtn) loginBtn.style.display = 'none';

            // Load user data
            const user = getUserData();
            if (user) {
                updateUserInfo(user);
            }
        } else {
            // User is not logged in - hide dropdown, show login
            userDropdown.classList.remove('active');
            if (loginBtn) loginBtn.style.display = 'inline-flex';
        }
    }

    // Update user info in dropdown
    function updateUserInfo(user) {
        const userName = document.getElementById('dropdownUserName');
        const userNameLarge = document.getElementById('dropdownUserNameLarge');
        const userEmail = document.getElementById('dropdownUserEmail');
        const userAvatar = document.getElementById('dropdownUserAvatar');
        const userAvatarLarge = document.getElementById('dropdownUserAvatarLarge');

        const avatarUrl = user.profile_picture || 'images/default-avatar.png';
        const name = user.name || 'User';
        const email = user.email || '';

        if (userName) userName.textContent = name;
        if (userNameLarge) userNameLarge.textContent = name;
        if (userEmail) userEmail.textContent = email;
        if (userAvatar) userAvatar.src = avatarUrl;
        if (userAvatarLarge) userAvatarLarge.src = avatarUrl;
    }

    // Toggle dropdown
    function toggleDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.toggle('open');
        }
    }

    // Close dropdown when clicking outside
    function closeDropdownOnClickOutside(event) {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove('open');
        }
    }

    // Dark mode toggle
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const savedTheme = localStorage.getItem('theme');

        // Apply saved theme
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }

        // Toggle dark mode
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function () {
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }

    // Logout function
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        }
    }

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function () {
        initUserDropdown();
        initDarkMode();

        // Dropdown trigger click
        const dropdownTrigger = document.getElementById('userDropdownTrigger');
        if (dropdownTrigger) {
            dropdownTrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleDropdown();
            });
        }

        // Close dropdown on outside click
        document.addEventListener('click', closeDropdownOnClickOutside);

        // Logout button
        const logoutBtn = document.getElementById('dropdownLogout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        }

        // Close dropdown when clicking menu items (except theme toggle)
        const dropdownItems = document.querySelectorAll('.user-dropdown-item:not(.theme-toggle)');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function () {
                const userDropdown = document.getElementById('userDropdown');
                if (userDropdown) {
                    userDropdown.classList.remove('open');
                }
            });
        });
    });

    // Expose functions globally if needed
    window.userDropdownUtils = {
        initUserDropdown,
        updateUserInfo,
        logout
    };
})();
