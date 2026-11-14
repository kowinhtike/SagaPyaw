/**
 * Model store: download the three voice files once, keep them in the Cache API.
 *
 * Two things matter here on a phone:
 *   1. 181 MB must never be held twice in memory. The download is piped straight
 *      into the cache with a counting TransformStream, so only one copy exists
 *      at any time (the one we read back for onnxruntime).
 *   2. A phone may evict the cache. `persist()` is requested, and the UI says so
 *      when it is refused.
 */

const CACHE = 'nara-model-v1';

export function cacheAvailable() {
  return typeof caches !== 'undefined';
}

/** True when every file for this voice is already on disk. */
export async function isCached(urls) {
  if (!cacheAvailable()) return false;
  const cache = await caches.open(CACHE);
  for (const url of urls) {
    if (!(await cache.match(url))) return false;
  }
  return true;
}

async function readCached(cache, url, onProgress, label) {
  const hit = await cache.match(url);
  if (!hit) return null;
  const total = Number(hit.headers.get('content-length') ?? 0);
  if (!hit.body || !total) {
    onProgress?.(1, label);
    return new Uint8Array(await hit.arrayBuffer());
  }
  const reader = hit.body.getReader();
  const out = new Uint8Array(total);
  let at = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out.set(value, at);
    at += value.length;
    onProgress?.(at / total, label);
  }
  return out;
}

/**
 * Fetch a file, streaming it into the cache while reporting progress.
 * Returns the bytes as a Uint8Array.
 *
 * A model too large for the host's per-file limit is shipped as `<name>.p00`,
 * `.p01`, … next to a `<name>.json` manifest (see `tools/pack.mjs --split`).
 * The split is invisible here: parts are reassembled into one buffer and cached
 * under the *original* URL, so `isCached()` and every later load behave exactly
 * as if the file had never been split.
 */
export async function loadFile(url, { onProgress, label = url } = {}) {
  const cache = cacheAvailable() ? await caches.open(CACHE) : null;

  if (cache) {
    const cached = await readCached(cache, url, onProgress, label);
    if (cached) return cached;
  }

  // A split bundle (pack --split) knows it is split, so ask for the manifest
  // first instead of taking a guaranteed 404 on the unsplit URL. Only the
  // weights are ever split, so voice.json still goes straight to its URL.
  const partsFirst = globalThis.__SPLIT_MODELS === 1 && url.endsWith('.onnx');
  if (partsFirst) {
    const joined = await loadParts(url, cache, { onProgress, label, status: 0 });
    if (joined) return joined;
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    if (!partsFirst) {
      const joined = await loadParts(url, cache, { onProgress, label, status: res.status });
      if (joined) return joined;
    }
    throw new Error(`${label}: HTTP ${res.status}`);
  }
  const total = Number(res.headers.get('content-length') ?? 0);

  // Stream through a counter straight into the cache: one copy in flight, none
  // accumulated in JS memory.
  if (cache && res.body && total) {
    let seen = 0;
    let failed = null;
    const counted = res.body.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          seen += chunk.byteLength;
          onProgress?.(seen / total, label);
          controller.enqueue(chunk);
        },
        flush() {
          if (failed) throw failed;
        },
      }),
    );
    try {
      await cache.put(
        url,
        new Response(counted, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(total),
          },
        }),
      );
      const bytes = await readCached(cache, url, null, label);
      if (bytes) return bytes;
    } catch {
      // Safari and some private modes refuse streaming bodies in cache.put.
      // Fall through to the buffered path below.
    }
  }

  const buf = await res.arrayBuffer();
  if (cache) {
    try {
      await cache.put(
        url,
        new Response(buf, {
          headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(buf.byteLength) },
        }),
      );
    } catch {
      /* cache is a bonus, not a requirement */
    }
  }
  onProgress?.(1, label);
  return new Uint8Array(buf);
}

/* ------------------------------------------------------------- split files -- */

/**
 * Reassemble a file that was split to dodge a host's per-file limit.
 * Returns null when there is no manifest, i.e. the file really is missing.
 */
async function loadParts(url, cache, { onProgress, label, status }) {
  const base = new URL(url, document.baseURI);
  let man;
  try {
    const res = await fetch(`${url}.json`, { cache: 'no-store' });
    if (!res.ok) return null;
    man = await res.json();
  } catch {
    return null;
  }
  if (!Array.isArray(man?.parts) || !man.parts.length) return null;

  // One preallocated buffer: peak memory is `size + one part`, never `2 × size`.
  const out = new Uint8Array(man.size);
  let at = 0;
  for (const part of man.parts) {
    const res = await fetch(new URL(part.name, base).href, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${label} ${part.name}: HTTP ${res.status}`);
    if (!res.body) {
      const buf = new Uint8Array(await res.arrayBuffer());
      out.set(buf, at);
      at += buf.length;
    } else {
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        out.set(value, at);
        at += value.length;
        onProgress?.(at / man.size, label);
      }
    }
  }
  if (at !== man.size) throw new Error(`${label}: ${at}/${man.size} bytes reassembled`);

  // Integrity is opt-in: SHA-256 of 107 MB needs a second copy of the buffer,
  // which is exactly what a low-end phone cannot spare. `?verify=1` to force it.
  if (man.sha256 && /(^|[?&])verify=1/.test(location.search) && globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', out);
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex !== man.sha256) throw new Error(`${label}: sha256 ${hex.slice(0, 12)}… ≠ ${man.sha256.slice(0, 12)}…`);
    console.info(`[model] ${label} · ${man.parts.length} parts · sha256 ok`);
  } else {
    console.info(`[model] ${label} · ${man.parts.length} parts reassembled (was HTTP ${status})`);
  }

  onProgress?.(1, label);
  if (cache) {
    try {
      await cache.put(
        url,
        new Response(out, {
          headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(man.size) },
        }),
      );
    } catch {
      /* cache is a bonus, not a requirement */
    }
  }
  return out;
}

/** Ask the browser not to evict us. Returns true when granted. */
export async function requestPersistence() {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}

export async function storageEstimate() {
  if (!navigator.storage?.estimate) return null;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { usage, quota };
}

export async function clearModelCache() {
  if (!cacheAvailable()) return;
  await caches.delete(CACHE);
}
