// Service Worker para cache y performance - Optimizado para empresas
const CACHE_NAME = 'maykolsalgado-v4';
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v4';
const IMAGE_CACHE = 'images-v4';

const STATIC_ASSETS = [
  '/',
  '/projects',
  '/blog',
  '/contact',
  '/404.html',
  '/logo.svg',
  '/favicon.svg',
  '/favicon.ico',
  '/images/og-maykol-salgado.svg',
  '/performance-optimizer.js'
];

const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for images
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE)
    ])
    .then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker install failed:', error);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker activation failed:', error);
      })
  );
});

// Fetch event - estrategia Network First para páginas, Cache First para assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Skip requests with query parameters (pueden ser dinámicas)
  const url = new URL(event.request.url);
  if (url.search) return;
  
  console.log('SW handling request:', event.request.url);
  
  // Estrategia diferente para páginas vs assets
  if (event.request.destination === 'document') {
    // Network First para páginas HTML
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          console.log('Network failed, trying cache for:', event.request.url);
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback específico para páginas principales
              if (event.request.url.includes('/projects')) {
                return caches.match('/projects');
              }
              if (event.request.url.includes('/blog')) {
                return caches.match('/blog');
              }
              // Fallback final a página 404 personalizada
              return caches.match('/404.html').then(fallback => {
                return fallback || caches.match('/');
              });
            });
        })
    );
  } else {
    // Cache First para assets (CSS, JS, imágenes)
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch((error) => {
              console.error('Fetch failed for asset:', event.request.url, error);
              return new Response('Asset not available offline', { status: 503 });
            });
        })
    );
  }
});
