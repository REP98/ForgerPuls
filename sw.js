importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "ForgerPuls-cache";
const offlineFallbackPage = "index.html";

// Recursos estáticos a cachear durante la instalación
const images = [
    'images/portada.png',
    'images/manifiesto.png',
    'images/KnotForge_01.png',
    'images/KnotForge_02.png',
    'images/KnotForge_03.png',
    'images/KnotForge_04.png',
    'images/KnotForge_05.png',
    'images/KnotForge_06.png',
    'images/KnotForge_07.png',
    'images/precision_01.png',
    'images/precision_02.png',
    'images/medidas.png',
    'images/contacto.png'
];

const staticAssets = [
    offlineFallbackPage,
    'app.js',
    'favicon-32x32.png',
    'sw.js'
];

// Combina todos los recursos para precachear
const precacheResources = [...staticAssets, ...images];

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => {
                console.log('[SW] Precacheando recursos...');
                return cache.addAll(precacheResources);
            })
            .catch((err) => {
                console.error('[SW] Error al precachear:', err);
            })
    );
    self.skipWaiting(); // Activar inmediatamente
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim(); // Tomar control de clientes inmediatamente
});

if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}

// Estrategia Cache-First para imágenes, CSS y JS (recursos estáticos)
workbox.routing.registerRoute(
    ({ request }) => 
        request.destination === 'image' ||
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font' ||
        request.url.includes('favicon'),
    new workbox.strategies.CacheFirst({
        cacheName: CACHE,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            }),
        ],
    })
);

// Estrategia Stale-While-Revalidate para navegación (HTML)
workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE,
    })
);

// Fallback offline para navegación
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;
                if (preloadResp) return preloadResp;

                const networkResp = await fetch(event.request);
                return networkResp;
            } catch (error) {
                const cache = await caches.open(CACHE);
                const cachedResp = await cache.match(offlineFallbackPage);
                return cachedResp || new Response('Offline - No cache available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                });
            }
        })());
    }
});
