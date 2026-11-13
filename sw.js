// Service Worker for Vibhav Nirmal Portfolio
const CACHE_NAME = 'vibhav-portfolio-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/resources/css/unified-portfolio.css',
    '/resources/css/feed-components.css',
    '/resources/js/social-feed.js',
    '/resources/data.json',
    '/resources/images/logos/vin.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('Failed to cache static assets:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, cache fallback when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests for social media embeds
    if (event.request.url.includes('linkedin.com') || 
        event.request.url.includes('youtube.com') ||
        event.request.url.includes('github.com')) {
        return;
    }

    // Range requests (video seeking) return 206 and cannot be cached; let the browser handle them.
    if (event.request.headers.has('range')) return;

    // Network first, so visitors always get the latest pages and data.json; cache is only the offline fallback.
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request)
                .then(cached => cached || (event.request.mode === 'navigate' ? caches.match('/index.html') : Response.error())))
    );
});
