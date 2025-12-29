// ============================================
// Social Media Links Updater
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Check if config is loaded
    if (typeof siteConfig === 'undefined' || !siteConfig.socialMedia) {
        console.warn('Site config not loaded. Social media links will use defaults.');
        return;
    }

    const social = siteConfig.socialMedia;

    // Update all social media links on the page
    const socialContainers = document.querySelectorAll('.social-icons');

    socialContainers.forEach(container => {
        // Only update if it hasn't been updated already
        if (!container.dataset.updated) {
            container.innerHTML = `
                <a href="${social.facebook}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Facebook">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="${social.instagram}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="${social.twitter}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Twitter">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="${social.youtube}" target="_blank" rel="noopener noreferrer" class="social-icon" title="YouTube">
                    <i class="fab fa-youtube"></i>
                </a>
            `;
            container.dataset.updated = 'true';
        }
    });
});
