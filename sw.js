'use strict';
// Cache application files only. Records, OAuth callbacks and Microsoft requests
// are never written to Cache Storage by this worker.
const PREFIX = 'little-ledger-shell-' + encodeURIComponent(new URL(self.registration.scope).pathname) + '-';
const CACHE = PREFIX + 'v18';
const BUILD='r18';
const FILES = ['./', 'bootstrap.js', 'index.html', 'style.css', 'excel.js', 'cloud.js', 'app.js', 'pwa.js', 'history.js', 'admin.js', 'admin-ui.js', 'performance.js', 'performance-ui.js', 'marksheet-export.js', 'school-documents.js', 'navigation.js', 'admissions.js', 'assets/little-wings-logo.jpg',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];
const URLS = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...URLS].map(url=>new Request(url,{cache:"reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const clean = new URL(url.href); clean.search = ''; clean.hash = '';
  if (!URLS.has(clean.href)) return;
  const navigation = request.mode === 'navigate';
  // Query-bearing non-navigation requests (including arbitrary data) stay online.
  const versionedAsset=!navigation&&url.search==='?v='+BUILD;
  if (url.search && !navigation && !versionedAsset) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request,{cache:"no-cache"});
      if (response.ok && response.type === 'basic' && (!url.search||versionedAsset)) await cache.put(clean.href, response.clone());
      return response;
    } catch (error) {
      const saved = await cache.match(navigation ? new URL('index.html', self.registration.scope).href : clean.href);
      if (saved) return saved;
      throw error;
    }
  })());
});
