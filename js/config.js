// ============================================
// TM WATCH - Configuration
// ============================================

const siteConfig = {
    // Social Media Links (Update these with your real URLs)
    socialMedia: {
        facebook: 'https://facebook.com/tmwatch',
        instagram: 'https://instagram.com/tmwatch',
        twitter: 'https://twitter.com/tmwatch',
        youtube: 'https://youtube.com/@tmwatch'
    },

    // Contact Information
    contact: {
        email: 'support@tmwatch.com',
        phone: '+91-1234567890',
        whatsapp: '+911234567890', // Update with your WhatsApp Business number
        address: 'Mumbai, Maharashtra, India'
    },

    // Business Hours
    businessHours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
    },

    // Feature Flags
    features: {
        demoMode: true, // Set to false when backend is ready
        realPayments: false,
        emailNotifications: false,
        orderTracking: false
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.siteConfig = siteConfig;
}
