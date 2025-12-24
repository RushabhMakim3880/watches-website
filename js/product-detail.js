// ============================================
// CHRONOLUX - Product Detail Page Logic
// ============================================

/**
 * Initialize product detail page
 * Loads product data from URL parameter and populates the page
 */
function initProductDetail() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Validate product ID and products array
    if (!productId || !products) {
        console.error('Invalid product ID or products not loaded');
        window.location.href = 'index.html';
        return;
    }

    // Find product by ID
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found`);
        window.location.href = 'index.html';
        return;
    }

    // Populate page with product data
    populateProductDetails(product);
    populateProductSpecs(product);
    populateProductFeatures();
    setupProductActions(product);
    loadRelatedProducts(product);
    updatePageMeta(product);
}

/**
 * Populate basic product details
 */
function populateProductDetails(product) {
    // Update page title
    document.title = `${product.name} - CHRONOLUX`;

    // Product image
    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;
    }

    // Brand
    const productBrand = document.getElementById('productBrand');
    if (productBrand) {
        productBrand.textContent = product.brand;
    }

    // Title
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = product.name;
    }

    // Breadcrumb product name
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = product.name;
    }

    // Price
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        if (product.originalPrice) {
            productPrice.innerHTML = `
                <span style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$${product.price.toLocaleString()}</span>
                <span style="font-size: 1.2rem; color: var(--dark-grey); text-decoration: line-through; margin-left: var(--space-md);">$${product.originalPrice.toLocaleString()}</span>
                <span style="background: var(--error-red); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; margin-left: var(--space-sm);">-${product.discount}%</span>
            `;
        } else {
            productPrice.textContent = '$' + product.price.toLocaleString();
        }
    }

    // Rating
    const productRating = document.getElementById('productRating');
    if (productRating) {
        productRating.innerHTML = generateStars(product.rating);
    }

    // Reviews count
    const reviewsCount = document.querySelector('.reviews-count');
    if (reviewsCount) {
        reviewsCount.textContent = `(${product.reviews} reviews)`;
    }

    // Category link
    const categoryLink = document.getElementById('categoryLink');
    if (categoryLink) {
        const categoryName = product.gender === 'men' ? "Men's" : product.gender === 'women' ? "Women's" : product.category;
        categoryLink.textContent = categoryName + ' Watches';
        categoryLink.href = product.gender ? `${product.gender}.html` : 'index.html';
    }

    // Description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.textContent = product.description || getDefaultDescription(product);
    }
}

/**
 * Get default description based on product category
 */
function getDefaultDescription(product) {
    const descriptions = {
        'chronograph': 'Precision-engineered chronograph with Swiss movement and sapphire crystal. Features multiple sub-dials for timing functions and a tachymeter scale.',
        'automatic': 'Sophisticated automatic timepiece with self-winding movement. Features exhibition caseback showcasing the intricate mechanical movement.',
        'sport': 'Rugged sport watch built for active lifestyles. Water-resistant with luminous hands and durable construction.',
        'luxury-leather': 'Elegant timepiece with premium leather strap. Combines classic styling with modern precision.',
        'smart': 'Hybrid smartwatch combining traditional watch design with modern smart features. Track fitness, receive notifications, and more.'
    };
    return descriptions[product.category] || 'Premium timepiece crafted with precision and attention to detail.';
}

/**
 * Populate product specifications
 */
function populateProductSpecs(product) {
    const specs = [
        { label: 'Movement', value: formatMovement(product.movement) },
        { label: 'Case Material', value: product.caseMaterial || 'Stainless Steel' },
        { label: 'Case Diameter', value: product.diameter || '42mm' },
        { label: 'Water Resistance', value: product.waterResistance || '100m' },
        { label: 'Crystal', value: 'Sapphire' },
        { label: 'Strap Type', value: formatStrapType(product.strapType) },
        { label: 'Dial Color', value: formatDialColor(product.dialColor) }
    ];

    const specsHtml = specs.map(spec =>
        `<div style="display: flex; justify-content: space-between; padding: var(--space-sm) 0; border-bottom: 1px solid var(--medium-grey);">
            <span style="font-weight: 600;">${spec.label}:</span>
            <span style="color: var(--dark-grey);">${spec.value}</span>
        </div>`
    ).join('');

    const productSpecs = document.getElementById('productSpecs');
    if (productSpecs) {
        productSpecs.innerHTML = specsHtml;
    }
}

/**
 * Format movement type for display
 */
function formatMovement(movement) {
    const movements = {
        'automatic': 'Automatic',
        'quartz': 'Quartz',
        'smart': 'Smart/Digital'
    };
    return movements[movement] || movement;
}

/**
 * Format strap type for display
 */
function formatStrapType(strapType) {
    const straps = {
        'leather': 'Leather',
        'metal': 'Metal Bracelet',
        'rubber': 'Rubber/Silicone'
    };
    return straps[strapType] || strapType;
}

/**
 * Format dial color for display
 */
function formatDialColor(dialColor) {
    if (!dialColor) return 'Black';
    return dialColor.charAt(0).toUpperCase() + dialColor.slice(1);
}

/**
 * Populate product features
 */
function populateProductFeatures() {
    const features = [
        '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i> <span>Manufacturer Warranty Included</span>',
        '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i> <span>Free Shipping on Orders Over $500</span>',
        '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i> <span>30-Day Return Policy</span>',
        '<i class="fas fa-check-circle" style="color: var(--primary-color);"></i> <span>Authenticity Guaranteed</span>'
    ];

    const featuresHtml = features.map(feature =>
        `<div style="display: flex; align-items: center; gap: var(--space-sm);">${feature}</div>`
    ).join('');

    const productFeatures = document.getElementById('productFeatures');
    if (productFeatures) {
        productFeatures.innerHTML = featuresHtml;
    }
}

/**
 * Setup product action buttons (Add to Cart, Add to Wishlist)
 */
function setupProductActions(product) {
    // Add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            if (typeof addToCart === 'function') {
                addToCart(product.id);
                showNotification(`${product.name} added to cart!`);
            } else {
                console.error('addToCart function not found');
            }
        });
    }

    // Add to wishlist button
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');
    if (addToWishlistBtn) {
        // Check if product is already in wishlist
        const isInWishlist = wishlist && wishlist.includes(product.id);
        if (isInWishlist) {
            addToWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            addToWishlistBtn.classList.add('active');
        }

        addToWishlistBtn.addEventListener('click', function () {
            if (typeof toggleWishlist === 'function') {
                toggleWishlist(product.id);
                const isNowInWishlist = wishlist && wishlist.includes(product.id);
                if (isNowInWishlist) {
                    addToWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
                    addToWishlistBtn.classList.add('active');
                    showNotification(`${product.name} added to wishlist!`);
                } else {
                    addToWishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
                    addToWishlistBtn.classList.remove('active');
                    showNotification(`${product.name} removed from wishlist`);
                }
            } else {
                console.error('toggleWishlist function not found');
            }
        });
    }

    // Social sharing buttons
    setupSocialSharing(product);
}

/**
 * Setup social sharing functionality
 */
function setupSocialSharing(product) {
    const shareBtn = document.getElementById('shareProductBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', function () {
        showSocialShareModal(product);
    });
}

/**
 * Show social share modal with sharing options
 */
function showSocialShareModal(product) {
    const productUrl = encodeURIComponent(window.location.href);
    const productTitle = encodeURIComponent(`${product.name} - CHRONOLUX`);
    const productImage = encodeURIComponent(window.location.origin + '/' + product.image);
    const productDescription = encodeURIComponent(`Check out this ${product.brand} watch for $${product.price}!`);

    const shareContent = `
        <div style="padding: var(--space-lg);">
            <h3 style="margin-bottom: var(--space-lg); text-align: center;">Share this product</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg);">
                <button onclick="shareToFacebook('${productUrl}')" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm);">
                    <i class="fab fa-facebook-f"></i> Facebook
                </button>
                <button onclick="shareToTwitter('${productUrl}', '${productTitle}')" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm); background: #1DA1F2;">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="shareToPinterest('${productUrl}', '${productImage}', '${productDescription}')" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm); background: #E60023;">
                    <i class="fab fa-pinterest"></i> Pinterest
                </button>
                <button onclick="shareViaEmail('${productTitle}', '${productUrl}')" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm); background: #666;">
                    <i class="fas fa-envelope"></i> Email
                </button>
            </div>
            <div style="display: flex; gap: var(--space-sm); align-items: center;">
                <input type="text" id="shareUrlInput" value="${decodeURIComponent(productUrl)}" readonly style="flex: 1; padding: var(--space-md); border: 1px solid var(--light-grey); border-radius: var(--radius-sm); background: var(--light-grey);">
                <button onclick="copyShareLink()" class="btn btn-secondary">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        </div>
    `;

    if (typeof modalSystem !== 'undefined') {
        modalSystem.show({
            id: 'share-modal',
            title: '',
            content: shareContent,
            size: 'small',
            closeOnBackdrop: true
        });
    }
}

/**
 * Share to Facebook
 */
function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

/**
 * Share to Twitter
 */
function shareToTwitter(url, title) {
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

/**
 * Share to Pinterest
 */
function shareToPinterest(url, image, description) {
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${description}`, '_blank', 'width=600,height=400');
}

/**
 * Share via Email
 */
function shareViaEmail(title, url) {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check out this product: ${decodeURIComponent(url)}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Copy share link to clipboard
 */
function copyShareLink() {
    const input = document.getElementById('shareUrlInput');
    if (input) {
        input.select();
        document.execCommand('copy');
        if (typeof showNotification === 'function') {
            showNotification('Link copied to clipboard!');
        }
    }
}

/**
 * Load and display related products
 */
function loadRelatedProducts(product) {
    // Get related products (same category or gender, different product)
    let relatedProducts = products
        .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
        .slice(0, 4);

    // If not enough related products, add more from other categories
    if (relatedProducts.length < 4) {
        const additionalProducts = products
            .filter(p => p.id !== product.id && !relatedProducts.includes(p))
            .slice(0, 4 - relatedProducts.length);
        relatedProducts = [...relatedProducts, ...additionalProducts];
    }

    const relatedHtml = relatedProducts.map(p => `
        <div class="product-card" data-product-id="${p.id}" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor: pointer;">
            <div class="product-image-container">
                <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
                ${p.discount ? `<div class="product-badge">-${p.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStars(p.rating)}</span>
                    <span class="rating-count">(${p.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${p.price.toLocaleString()}</span>
                    ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toLocaleString()}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (relatedProductsContainer) {
        relatedProductsContainer.innerHTML = relatedHtml;
    }
}

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

/**
 * Update page meta tags for SEO
 */
function updatePageMeta(product) {
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = `${product.name} by ${product.brand} - $${product.price}. ${product.description || getDefaultDescription(product)}`;

    // Add Open Graph tags
    updateMetaTag('og:title', `${product.name} - CHRONOLUX`);
    updateMetaTag('og:description', metaDescription.content);
    updateMetaTag('og:image', window.location.origin + '/' + product.image);
    updateMetaTag('og:url', window.location.href);
}

/**
 * Update or create meta tag
 */
function updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.content = content;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initProductDetail);
