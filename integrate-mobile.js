// ============================================
// MOBILE INTEGRATION SCRIPT
// Automatically adds mobile features to all pages
// ============================================

const fs = require('fs');
const path = require('path');

// Mobile CSS files to add
const mobileCSSLinks = `
  <!-- Mobile Optimization Stylesheets -->
  <link rel="stylesheet" href="css/mobile-navigation.css">
  <link rel="stylesheet" href="css/mobile-responsive.css">`;

// Mobile JS files to add
const mobileJSScripts = `
  <!-- Mobile Optimization Scripts -->
  <script src="js/lazy-loading.js"></script>
  <script src="js/mobile-navigation.js"></script>
  <script src="js/touch-gestures.js"></script>
  <script src="js/pwa-installer.js"></script>`;

// PWA meta tags
const pwaMeta = `
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#FF006E">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="TM WATCH">
  <link rel="apple-touch-icon" href="images/icons/icon-192x192.png">
  <link rel="manifest" href="manifest.json">`;

// Get all HTML files
const htmlFiles = [
    'authenticity-guarantee.html',
    'best-sellers.html',
    'blog.html',
    'brands.html',
    'cart.html',
    'checkout.html',
    'compare.html',
    'contact-us.html',
    'cookie-policy.html',
    'faq.html',
    'men.html',
    'new-arrivals.html',
    'order-confirmation.html',
    'payment.html',
    'privacy-policy.html',
    'product-detail.html',
    'returns.html',
    'secure-payment.html',
    'shipping.html',
    'terms-of-service.html',
    'track-order.html',
    'warranty.html',
    'wishlist.html',
    'women.html'
];

function addMobileFeatures(filename) {
    const filePath = path.join(__dirname, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${filename} - file not found`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has mobile features
    if (content.includes('mobile-navigation.css')) {
        console.log(`✅ ${filename} - already has mobile features`);
        return;
    }

    // Add PWA meta tags after viewport meta
    if (!content.includes('apple-mobile-web-app-capable')) {
        content = content.replace(
            /<meta name="viewport"[^>]*>/,
            match => match + pwaMeta
        );
    }

    // Add mobile CSS before </head>
    if (!content.includes('mobile-navigation.css')) {
        content = content.replace(
            /<\/head>/,
            mobileCSSLinks + '\n</head>'
        );
    }

    // Add mobile JS before </body>
    if (!content.includes('mobile-navigation.js')) {
        content = content.replace(
            /<\/body>/,
            mobileJSScripts + '\n</body>'
        );
    }

    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename} - mobile features added`);
}

// Process all files
console.log('🚀 Starting mobile integration...\n');
htmlFiles.forEach(addMobileFeatures);
console.log('\n✅ Mobile integration complete!');
