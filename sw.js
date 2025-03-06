// Dynamic cache name with version and timestamp
const CACHE_NAME = `jenergy-cache-v1-${Date.now()}`;

// Files to cache
const FILES_TO_CACHE = [
  '/jenergy-web-app/index.html',
  '/jenergy-web-app/styles/styles.css',
  '/jenergy-web-app/scripts/script.js',
  '/jenergy-web-app/header.html',
  '/jenergy-web-app/footer.html',
  '/jenergy-web-app/evCharging.html',
  '/jenergy-web-app/generalElectrical.html',
  '/jenergy-web-app/portfolio.html',
  '/jenergy-web-app/contactUs.html',
  '/jenergy-web-app/services.html',
  '/jenergy-web-app/site.webmanifest',
  '/jenergy-web-app/aboutUs.html',
  '/jenergy-web-app/batterySystems.html',
  '/jenergy-web-app/solarSystems.html',
  '/jenergy-web-app/favicon.ico',
  '/jenergy-web-app/styles/images/landingMain.jpg',
  '/jenergy-web-app/styles/images/apple-touch-icon.png',
  '/jenergy-web-app/styles/images/favicon-32x32.png',
  '/jenergy-web-app/styles/images/favicon-16x16.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate the service worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell...');
      return cache.addAll(FILES_TO_CACHE);
    }).catch(error => {
      console.error('Failed to cache files during install:', error);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheName.startsWith('jenergy-cache-v1')) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Old caches cleared!');
    }).catch(error => {
      console.error('Failed to clear old caches during activation:', error);
    })
  );
  self.clients.claim(); // Immediately take control of all pages
});

// Fetch event
self.addEventListener('fetch', event => {
  console.log('Fetch request for:', event.request.url);

  if (event.request.mode === 'navigate') {
    // Handle navigation requests and serve the cached `index.html`
    event.respondWith(
      caches.match('/jenergy-web-app/index.html').then(cachedResponse => {
        return cachedResponse || fetch('/jenergy-web-app/index.html');
      }).catch(error => {
        console.error('Failed to serve index.html for navigation:', error);
        throw error;
      })
    );
  } else {
    // Handle other requests normally
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          console.log('Serving cached:', event.request.url);
          return cachedResponse;
        }
        // Fetch from network and cache it
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            return caches.open(CACHE_NAME).then(cache => {
              console.log('Caching new resource:', event.request.url);
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        }).catch(error => {
          console.error('Network fetch failed for:', event.request.url, error);
          throw error;
        });
      })
    );
  }
});
