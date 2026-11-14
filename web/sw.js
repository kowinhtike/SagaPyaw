/**
 * App-shell cache. Deliberately knows nothing about the 181 MB voice files:
 * those live in the Cache API under `sagapyaw-model-v1` and are managed by the page,
 * so a shell update can never invalidate a model the user already downloaded.
 */
const SHELL = 'sagapyaw-shell-v1';

const ASSETS = [
  './index.html',
  './player.js',
  './model-store.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  '../dist/sagapyaw.mjs',
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
            if (!res.ok) return;
            // Some hosts answer /index.html with a 307 to /. Caching a redirected
            // response is allowed, but returning one for a navigation throws in
            // Safari ("the response has a redirect flag") — and the PWA start_url
            // is exactly that request. Re-wrap it as a plain 200 before caching.
            // Headers are rebuilt rather than copied: content-encoding and
            // content-length describe the wire form, not the decoded blob.
            if (res.redirected) {
              const body = await res.blob();
              const type = res.headers.get('content-type') ?? 'application/octet-stream';
              await cache.put(url, new Response(body, { status: 200, headers: { 'content-type': type } }));
            } else {
              await cache.put(url, res);
            }
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
      await Promise.all(names.filter((n) => n.startsWith('sagapyaw-shell-') && n !== SHELL).map((n) => caches.delete(n)));
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
      // A redirected response must never satisfy a navigation (Safari throws).
      // Entries written by an older version of this file could be redirected, so
      // fall through to the network instead and let the put below heal the cache.
      if (hit && !hit.redirected) return hit;
      const res = await fetch(request);
      if (res.ok && res.type === 'basic' && !res.redirected) {
        cache.put(request, res.clone()).catch(() => {});
      }
      return res;
    })(),
  );
});
