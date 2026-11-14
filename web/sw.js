/**
 * App-shell cache. Deliberately knows nothing about the 181 MB voice files:
 * those live in the Cache API under `nara-model-v1` and are managed by the page,
 * so a shell update can never invalidate a model the user already downloaded.
 */
const SHELL = 'nara-shell-v1';

const ASSETS = [
  './index.html',
  './player.js',
  './model-store.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  '../dist/nara-g2p.mjs',
  '../dist/tables.json',
  './vendor/ort.wasm.bundle.min.mjs',
  './vendor/ort-wasm-simd-threaded.mjs',
  './vendor/ort-wasm-simd-threaded.wasm',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      await Promise.all(
        ASSETS.map(async (path) => {
          const url = new URL(path, self.registration.scope).href;
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res.ok) await cache.put(url, res);
          } catch {
            /* a missing optional asset must not break installation */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.startsWith('nara-shell-') && n !== SHELL).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // The model has its own cache and its own progress reporting.
  if (url.pathname.includes('/models/')) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      const hit = await cache.match(request, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(request);
      if (res.ok && res.type === 'basic') cache.put(request, res.clone()).catch(() => {});
      return res;
    })(),
  );
});
