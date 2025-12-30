// ============================================
// PWA INSTALLER & SERVICE WORKER REGISTRATION
// ============================================

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Register service worker
        this.registerServiceWorker();

        // Handle install prompt
        this.setupInstallPrompt();

        // Check if already installed
        this.checkInstallStatus();

        // Handle app installed event
        this.handleAppInstalled();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js', {
                    scope: '/'
                });

                console.log('[PWA] Service Worker registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('[PWA] New Service Worker found');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

                // Auto-update check every hour
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 60);

            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');

            // Prevent default prompt
            e.preventDefault();

            // Store for later use
            this.deferredPrompt = e;

            // Show custom install button
            this.showInstallButton();
        });
    }

    showInstallButton() {
        // Create install banner
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="pwa-banner-text">
                    <strong>Install TM WATCH App</strong>
                    <p>Get faster access and offline support</p>
                </div>
                <div class="pwa-banner-actions">
                    <button class="pwa-install-btn" id="pwa-install-btn">
                        <i class="fas fa-download"></i> Install
                    </button>
                    <button class="pwa-close-btn" id="pwa-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('pwa-install-btn').addEventListener('click', () => {
            this.promptInstall();
        });

        document.getElementById('pwa-close-btn').addEventListener('click', () => {
            banner.remove();
            localStorage.setItem('pwa-install-dismissed', Date.now());
        });

        // Show banner with animation
        setTimeout(() => banner.classList.add('show'), 100);
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('[PWA] Install prompt not available');
            return;
        }

        // Show install prompt
        this.deferredPrompt.prompt();

        // Wait for user response
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('[PWA] Install outcome:', outcome);

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted install');
            this.trackInstall('accepted');
        } else {
            console.log('[PWA] User dismissed install');
            this.trackInstall('dismissed');
        }

        // Clear prompt
        this.deferredPrompt = null;

        // Remove banner
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.remove();
        }
    }

    handleAppInstalled() {
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.isInstalled = true;
            this.trackInstall('installed');
            this.showInstalledMessage();
        });
    }

    checkInstallStatus() {
        // Check if running as installed app
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            console.log('[PWA] Running as installed app');
            this.isInstalled = true;
            document.body.classList.add('pwa-installed');
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-update-content">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button id="pwa-update-btn">Update</button>
            </div>
        `;

        document.body.appendChild(notification);

        document.getElementById('pwa-update-btn').addEventListener('click', () => {
            window.location.reload();
        });

        setTimeout(() => notification.classList.add('show'), 100);
    }

    showInstalledMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>App installed successfully!</span>
        `;

        document.body.appendChild(message);
        setTimeout(() => message.classList.add('show'), 100);
        setTimeout(() => message.remove(), 3000);
    }

    trackInstall(action) {
        // Track install events (integrate with your analytics)
        console.log('[PWA] Track install:', action);

        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: action
            });
        }
    }
}

// ============================================
// PWA STYLES
// ============================================
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    /* PWA Install Banner */
    .pwa-install-banner {
        position: fixed;
        bottom: 70px;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #FF006E 0%, #D6005C 100%);
        color: white;
        padding: 16px;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
        z-index: 999;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    }

    .pwa-install-banner.show {
        transform: translateY(0);
    }

    .pwa-banner-content {
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 600px;
        margin: 0 auto;
    }

    .pwa-banner-icon {
        font-size: 32px;
        flex-shrink: 0;
    }

    .pwa-banner-text {
        flex: 1;
    }

    .pwa-banner-text strong {
        display: block;
        font-size: 16px;
        margin-bottom: 4px;
    }

    .pwa-banner-text p {
        margin: 0;
        font-size: 13px;
        opacity: 0.9;
    }

    .pwa-banner-actions {
        display: flex;
        gap: 8px;
    }

    .pwa-install-btn,
    .pwa-close-btn {
        background: white;
        color: #FF006E;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }

    .pwa-close-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 10px 12px;
    }

    .pwa-install-btn:hover {
        transform: scale(1.05);
    }

    .pwa-close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* PWA Update Notification */
    .pwa-update-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }

    .pwa-update-notification.show {
        transform: translateX(0);
    }

    .pwa-update-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .pwa-update-content i {
        font-size: 20px;
        animation: spin 2s linear infinite;
    }

    #pwa-update-btn {
        background: white;
        color: #4CAF50;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
    }

    /* PWA Success Message */
    .pwa-success-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: white;
        padding: 24px 32px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;
        font-weight: 600;
        transition: transform 0.3s ease;
    }

    .pwa-success-message.show {
        transform: translate(-50%, -50%) scale(1);
    }

    .pwa-success-message i {
        color: #4CAF50;
        font-size: 32px;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Hide install banner on desktop */
    @media (min-width: 969px) {
        .pwa-install-banner {
            display: none;
        }
    }

    /* Adjust for mobile with bottom nav */
    @media (max-width: 968px) {
        .pwa-install-banner {
            bottom: 70px;
        }
    }
`;
document.head.appendChild(pwaStyles);

// ============================================
// INITIALIZE PWA
// ============================================
let pwaInstaller;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaInstaller = new PWAInstaller();
    });
} else {
    pwaInstaller = new PWAInstaller();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.pwaInstaller = pwaInstaller;
}
