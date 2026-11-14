/**
 * App-shell cache. Deliberately knows nothing about the 181 MB voice files:
 * those live in the Cache API under `sagapyaw-model-v1` and are managed by the page,
 * so a shell update can never invalidate a model the user already downloaded.
 *
 * Strategy: **network first** for everything the build produces, cache only as
 * the offline fallback. The first version of this file served the shell cache
 * first, which meant a returning visitor kept the HTML and JS of whichever
 * build they happened to install — a normal refresh showed the old UI forever,
 * and only a hard reload (which bypasses the worker) or clearing site data
 * showed the new one. Nothing in the file names changes between builds, so
 * cache-first had no way to notice.
 *
 * `vendor/` is the one exception: 11 MB of onnxruntime wasm that only changes
 * when the dependency is upgraded, and whose URL is pinned by `immutable`
 * headers. Re-downloading it on every load would cost more than the staleness
 * it would prevent.
 */
const SHELL = 'sagapyaw-shell-v2';

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

/** Cache-first: pinned, content-addressed by version, expensive to refetch. */
const PINNED = /\/vendor\//;

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
      const stale = names.filter((n) => n.startsWith('sagapyaw-shell-') && n !== SHELL);
      await Promise.all(stale.map((n) => caches.delete(n)));
      await self.clients.claim();
      // Replacing an older shell means the open pages are still showing the
      // build that shell was made for, and that old page cannot fix itself — it
      // predates the reload-on-update code below. Reload them here instead, so
      // the first visit after a deploy lands on the new build. A first install
      // has no stale shell, so nothing is reloaded under a new visitor.
      if (!stale.length) return;
      const windows = await self.clients.matchAll({ type: 'window' });
      await Promise.all(windows.map((client) => client.navigate(client.url).catch(() => {})));
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

  event.respondWith(url.pathname.includes('/vendor/') ? cachedFirst(request) : networkFirst(request, url));
});

/** Pinned dependency: the cached copy wins, the network only fills a gap. */
async function cachedFirst(request) {
  const cache = await caches.open(SHELL);
  const hit = await cache.match(request);
  // A redirected response must never satisfy a navigation (Safari throws).
  // Entries written by an older version of this file could be redirected, so
  // fall through to the network instead and let the put below heal the cache.
  if (hit && !hit.redirected) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === 'basic' && !res.redirected) {
    cache.put(request, res.clone()).catch(() => {});
  }
  return res;
}

/**
 * Everything else: ask the network, fall back to the cache when offline.
 *
 * `cache: 'no-cache'` is what makes this work against the old `immutable`
 * headers — a stored copy is revalidated instead of being trusted for a year.
 * For navigations the cache key drops the query string, because `?text=` and
 * `?auto=` are parameters of one document, not separate documents; storing each
 * variant would leave a shelf of stale HTML behind.
 */
async function networkFirst(request, url) {
  const cache = await caches.open(SHELL);
  const key = request.mode === 'navigate' ? `${url.origin}${url.pathname}` : request;
  try {
    const res = await fetch(request, { cache: 'no-cache' });
    // Redirects are returned untouched: caching one breaks the next navigation.
    if (res.ok && res.type === 'basic' && !res.redirected) {
      cache.put(key, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    const hit = await cache.match(key, { ignoreSearch: true });
    if (hit && !hit.redirected) return hit;
    throw err;
  }
}
