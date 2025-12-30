// Show/hide profile and login buttons based on auth status
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profileBtn = document.getElementById('profileBtn');
    const loginBtn = document.getElementById('loginBtn');

    if (token) {
        // User is logged in - show profile, hide login
        if (profileBtn) profileBtn.style.display = 'inline-flex';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        // User is not logged in - hide profile, show login
        if (profileBtn) profileBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-flex';
    }
});
