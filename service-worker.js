// ============================================
// SERVICE WORKER - PWA FUNCTIONALITY
// Enables offline support and faster loads
// ============================================

const CACHE_VERSION = 'tm-watch-v1.0.0';
const CACHE_NAME = `tm-watch-cache-${CACHE_VERSION}`;

// Files to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/css/mobile-navigation.css',
    '/css/mobile-responsive.css',
    '/js/config.js',
    '/js/mobile-navigation.js',
    '/js/lazy-loading.js',
    '/script.js',
    '/images/default-avatar.png',
    '/manifest.json'
];

// Runtime cache for dynamic content
const RUNTIME_CACHE = 'tm-watch-runtime';
const IMAGE_CACHE = 'tm-watch-images';
const API_CACHE = 'tm-watch-api';

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// ============================================
// INSTALL EVENT - Cache essential files
// ============================================
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Precache failed:', error);
            })
    );
});

// ============================================
// ACTIVATE EVENT - Clean up old caches
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME &&
                            cacheName !== RUNTIME_CACHE &&
                            cacheName !== IMAGE_CACHE &&
                            cacheName !== API_CACHE) {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH EVENT - Serve from cache or network
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Determine cache strategy based on request type
    if (request.url.includes('/api/')) {
        // API requests: Network first, cache fallback
        event.respondWith(networkFirst(request, API_CACHE));
    } else if (request.destination === 'image') {
        // Images: Cache first, network fallback
        event.respondWith(cacheFirst(request, IMAGE_CACHE));
    } else if (request.url.includes('.css') || request.url.includes('.js')) {
        // Static assets: Stale while revalidate
        event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
    } else {
        // HTML pages: Network first
        event.respondWith(networkFirst(request, RUNTIME_CACHE));
    }
});

// ============================================
// CACHE STRATEGIES
// ============================================

// Cache First: Try cache, fallback to network
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[ServiceWorker] Fetch failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network First: Try network, fallback to cache
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await cache.match('/offline.html');
            if (offlinePage) {
                return offlinePage;
            }
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stale While Revalidate: Return cache, update in background
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });

    return cached || fetchPromise;
}

// ============================================
// BACKGROUND SYNC - Retry failed requests
// ============================================
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);

    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    } else if (event.tag === 'sync-wishlist') {
        event.waitUntil(syncWishlist());
    }
});

async function syncCart() {
    // Sync cart data when back online
    console.log('[ServiceWorker] Syncing cart...');
    // Implementation depends on your backend
}

async function syncWishlist() {
    // Sync wishlist data when back online
    console.log('[ServiceWorker] Syncing wishlist...');
    // Implementation depends on your backend
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'TM WATCH';
    const options = {
        body: data.body || 'New notification',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            { action: 'open', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked');

    event.notification.close();

    if (event.action === 'open' || !event.action) {
        const url = event.notification.data || '/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});

// ============================================
// MESSAGE HANDLER - Communication with app
// ============================================
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);

    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    } else if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Clean up old cache entries
async function cleanupCache(cacheName, maxItems = 50) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxItems) {
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(
            keysToDelete.map((key) => cache.delete(key))
        );
    }
}

// Periodic cache cleanup
setInterval(() => {
    cleanupCache(IMAGE_CACHE, 100);
    cleanupCache(API_CACHE, 50);
}, 1000 * 60 * 60); // Every hour

console.log('[ServiceWorker] Loaded successfully');
