/* ============================================
   DARK MODE FUNCTIONALITY
   ============================================ */

(function () {
    'use strict';

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Wait for DOM to load
    document.addEventListener('DOMContentLoaded', function () {

        // Create theme toggle button
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.setAttribute('role', 'button');
        themeToggle.innerHTML = `
      <i class="fas fa-sun"></i>
      <i class="fas fa-moon"></i>
    `;
        document.body.appendChild(themeToggle);

        // Toggle theme on click
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Add rotation animation
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);

            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Optional: Show toast notification
            showThemeToast(newTheme);
        });

        // Show theme change notification
        function showThemeToast(theme) {
            const toast = document.createElement('div');
            toast.className = 'theme-toast';
            toast.textContent = theme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled';
            toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--gradient-luxury);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: var(--shadow-xl);
      `;
            document.body.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 10);

            // Remove after 2 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }

        // Keyboard accessibility
        themeToggle.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Make focusable
        themeToggle.setAttribute('tabindex', '0');
    });

})();
