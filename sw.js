// sw.js

const CACHE_NAME = 'jenergy-cache';

// Install event
self.addEventListener('install', event => {
  // Activate the service worker immediately after installation
  self.skipWaiting();
});

// Fetch event - Serve cached resources and update cache in the background
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Only cache valid responses (status 200)
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // Return cached response if available, else wait for network response
        return cachedResponse || fetchPromise;
      });
    })
  );
});
