// Cache version
const CACHE_NAME = 'jenergy-cache-v1';

// List of assets to cache
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/aboutUs.html',
    '/batterySystems.html',
    '/contactUs.html',
    '/evCharging.html',
    '/generalElectrical.html',
    '/portfolio.html',
    '/services.html',
    '/solarSystems.html',
    '/styles/styles.css',
    '/styles/images/jenergyLogo.jpg',
    '/styles/images/solarImg1.jpg',
    '/styles/images/solarImg2.jpg',
    '/styles/images/batteryImg1.jpg',
    '/styles/images/batteryImg2.jpg',
    '/styles/images/evChargingImg1.jpg',
    '/styles/images/evChargingImg2.jpg',
    '/styles/images/genElectricalImg1.jpg',
    '/styles/images/genElectricalImg2.jpg',
    '/styles/images/hero.jpg',
    '/scripts/script.js',
    '/favicon.ico'
];

// Install event - Cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => console.error('Failed to cache assets', error))
    );
});

// Fetch event - Serve cached resources, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Serve from cache if available
                if (response) {
                    // Fetch and update the cache in the background
                    fetch(event.request).then(networkResponse => {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }).catch(error => console.error('Failed to fetch resource from network', error));
                    return response;
                }

                // Fallback to network if not in cache
                return fetch(event.request).then(networkResponse => {
                    // Update cache with the latest version
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                });
            }).catch(error => console.error('Failed to match or fetch resource', error))
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background Sync (optional) - Example for syncing data when online
self.addEventListener('sync', event => {
    if (event.tag === 'sync-updated-content') {
        event.waitUntil(fetchLatestContent());
    }
});

async function fetchLatestContent() {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_CACHE);
    console.log('Content synced and cache updated.');
}
