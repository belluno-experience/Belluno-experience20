// Update: interests popup
// Belluno Experience 2.0 - cache della sola struttura locale (demo)
const CACHE = 'belluno-experience-pwa-v173-controls';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/logo-ufficiale-estratto.png', './logos/negozio-01.svg', './logos/negozio-02.svg', './logos/negozio-03.svg', './logos/negozio-04.svg', './logos/negozio-05.svg', './logos/negozio-06.svg', './logos/negozio-07.svg', './logos/negozio-08.svg', './logos/negozio-09.svg', './logos/negozio-10.svg', './logos/negozio-11.svg', './logos/negozio-12.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
