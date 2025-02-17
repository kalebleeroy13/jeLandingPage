const CACHE_NAME = `jenergy-cache-${new Date().toISOString()}`;

// Install event
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        // Add the initial resources you want to cache here
        '/index.html',
        '/styles/styles.css',
        '/scripts/script.js',
        '/header.html',
        '/footer.html',
        '/evCharging.html',
        '/generalElectrical.html',
        '/portfolio.html',
        '/contactUs.html',
        '/services.html',
        '/site.webmanifest',
        '/aboutUs.html',
        '/batterySystems.html',
        '/solarSystems.html'
      ]);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
