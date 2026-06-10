// Service worker simples: cache do "shell" da app.
// Os dados (Supabase) são sempre buscados online.
const CACHE = 'stock-clinicas-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Nunca colocar em cache chamadas à API (Supabase) nem CDNs externos
  if (url.includes('supabase.co') || url.includes('cdn.jsdelivr.net') || url.includes('fonts.')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
