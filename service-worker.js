// Belluno Experience 2.0 - cache della sola struttura locale (demo)
const CACHE_PREFIX = 'belluno-experience-pwa-';
const CACHE = CACHE_PREFIX + 'v174-navigation';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/logo-ufficiale-estratto.png', './logos/negozio-01.svg', './logos/negozio-02.svg', './logos/negozio-03.svg', './logos/negozio-04.svg', './logos/negozio-05.svg', './logos/negozio-06.svg', './logos/negozio-07.svg', './logos/negozio-08.svg', './logos/negozio-09.svg', './logos/negozio-10.svg', './logos/negozio-11.svg', './logos/negozio-12.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(path => new Request(path, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok) {
        try { await cache.put(request, response.clone()); }
        catch (error) { console.warn('Cache non aggiornata:', error); }
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request);
      if (cached) return cached;
      return request.mode === 'navigate' ? (await cache.match('./index.html')) || Response.error() : Response.error();
    }
  })());
});
