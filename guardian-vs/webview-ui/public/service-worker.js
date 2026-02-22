// Guardian VS Service Worker
// Version: 1.0.0
// Purpose: Enable offline functionality and asset caching for VS Code webview

const CACHE_NAME = 'guardian-vs-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/assets/index.js',
  '/assets/index.css',
  // Core assets that should work offline
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // For VS Code webview, we want to cache assets but allow API calls through
  const url = new URL(event.request.url);
  
  // Cache asset requests (JS, CSS, fonts, images)
  if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return response;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              // Don't cache if not a successful response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response to cache it
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(error => {
              console.error('[Service Worker] Fetch failed:', error);
              // For assets, we could return a fallback if we had one
              throw error;
            });
        })
    );
  }
  
  // For API requests, just fetch from network
  // (we could add caching logic here for specific API endpoints if needed)
});

// Message event - handle messages from the webview
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync (if needed in the future)
// self.addEventListener('sync', event => {
//   if (event.tag === 'sync-data') {
//     event.waitUntil(syncData());
//   }
// });

// async function syncData() {
//   // Implement background sync logic here
//   console.log('[Service Worker] Background sync started');
// }