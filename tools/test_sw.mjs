#!/usr/bin/env node
/**
 * The app shell must update on a plain refresh.
 *
 * This is a regression test for a bug that was invisible to every other check:
 * the service worker served `index.html` and `dist/sagapyaw.mjs` cache-first, so
 * a returning visitor kept whichever build they first installed. A normal
 * refresh showed the old UI; only a hard reload (which bypasses the worker) or
 * clearing site data showed the new one. File names never change between
 * builds, so cache-first had no way to tell.
 *
 * It works on a throwaway copy of the shell, so nothing in the repo is touched:
 *
 *   node tools/test_sw.mjs
 *
 * The copy is served with the *production* cache headers — `immutable` on
 * `/dist/*` included — so the first scenario also proves the worker's
 * `cache: 'no-cache'` override beats a year-long fresh copy in the HTTP cache.
 * The second scenario replays the situation real users are in right now: a page
 * already running the old cache-first worker when the fix is deployed.
 */
import { cp, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CHROME =
  process.env.CHROME_PATH ??
  (statExists('/usr/bin/chromium') ? '/usr/bin/chromium' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');

function statExists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
};

// Same rules the deploy ships: the pinned 11 MB of wasm is immutable, the app's
// own JS is not. `/dist/*` being immutable is exactly the trap this test guards.
function cacheControl(url) {
  if (url.startsWith('/vendor/')) return 'public, max-age=31536000, immutable';
  if (url.startsWith('/dist/')) return 'public, max-age=31536000, immutable';
  return 'no-cache';
}

/**
 * The worker as it was deployed before the fix: shell cache first, forever.
 * Only `install` and `fetch` matter here; the point is the staleness it causes.
 */
const OLD_WORKER = `
const SHELL = 'sagapyaw-shell-v1';
const ASSETS = ['./index.html', './player.js', './model-store.js', '../dist/sagapyaw.mjs', '../dist/tables.json'];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all(ASSETS.map(async (path) => {
      const url = new URL(path, self.registration.scope).href;
      const res = await fetch(url, { cache: 'reload' });
      if (res.ok) await cache.put(url, res.redirected ? new Response(await res.blob(), { status: 200 }) : res);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/models/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit && !hit.redirected) return hit;
    const res = await fetch(request);
    if (res.ok && res.type === 'basic' && !res.redirected) cache.put(request, res.clone()).catch(() => {});
    return res;
  })());
});
`;

// --- throwaway copy of the shell -------------------------------------------------
const dir = await mkdtemp(join(tmpdir(), 'sagapyaw-sw-'));
await cp(join(root, 'web'), join(dir, 'web'), { recursive: true });
await cp(join(root, 'dist'), join(dir, 'dist'), { recursive: true });
const newWorker = await readFile(join(dir, 'web', 'sw.js'), 'utf8');
const htmlPath = join(dir, 'web', 'index.html');
const jsPath = join(dir, 'dist', 'sagapyaw.mjs');

const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (url === '/') url = '/web/index.html';
  const path = join(dir, normalize(url).replace(/^(\.\.[/\\])+/, ''));
  try {
    const size = statSync(path).size;
    res.writeHead(200, {
      'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream',
      'Content-Length': size,
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': cacheControl(url),
    });
    createReadStream(path).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(0, resolve));
const origin = `http://localhost:${server.address().port}`;
const startUrl = `${origin}/web/index.html?prewarm=0`;

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) failed += 1;
};

/** A browser with its own profile: a worker from another run would skew control. */
async function withBrowser(profile, fn) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: join(dir, `profile-${profile}`),
    args: ['--no-sandbox', '--mute-audio'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  try {
    await fn(page, errors);
  } finally {
    await browser.close();
  }
}

/** Put a marker inside <head> — a comment after </html> is outside documentElement. */
async function deploy(marker) {
  const html = await readFile(htmlPath, 'utf8');
  await writeFile(htmlPath, html.replace('<head>', `<head>\n<!-- ${marker} -->`));
  await writeFile(jsPath, `${await readFile(jsPath, 'utf8')}\n// ${marker}\n`);
  return html.includes('<head>');
}

try {
  // --- scenario 1: a normal refresh must show the next build ---------------------
  await withBrowser('fresh', async (page, errors) => {
    await page.goto(startUrl, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 15000 });
    check('first load registers and is controlled by a worker', true);

    const shells = await page.evaluate(() =>
      caches.keys().then((n) => n.filter((k) => k.startsWith('sagapyaw-shell-'))),
    );
    check('one shell cache, named for the current version', shells.join() === 'sagapyaw-shell-v2', shells.join());

    // Stand in for a downloaded voice: a shell update must never evict it.
    await page.evaluate(async () => {
      const cache = await caches.open('sagapyaw-model-v1');
      await cache.put(new URL('/models/shoon/voice.json', location.href).href, new Response('{"marker":1}'));
    });

    check('the marker was written into the fixture', await deploy('build-2'));
    // A plain refresh — no cache bypass, which is what the user actually does.
    await page.reload({ waitUntil: 'load' });

    const head = await page.evaluate(() => document.head.innerHTML);
    check('a normal refresh shows the new HTML', head.includes('build-2'));

    // The same trap one layer down: the HTML could update while the module stayed
    // a year-fresh copy in the HTTP cache. Ask through the worker, as the page does.
    const js = await page.evaluate(() =>
      fetch('/dist/sagapyaw.mjs')
        .then((r) => r.text())
        .catch(() => ''),
    );
    check('a normal refresh shows the new JS', js.includes('build-2'), `${js.length} bytes`);

    // Offline still has to work — the cache is now a fallback, not the source.
    await page.setOfflineMode(true);
    let offlineOk = false;
    try {
      await page.reload({ waitUntil: 'load' });
      offlineOk = await page.evaluate(
        () => Boolean(document.getElementById('read')) && document.title.includes('SagaPyaw'),
      );
    } catch {
      offlineOk = false;
    }
    check('offline reload is served from the cache', offlineOk);
    await page.setOfflineMode(false);

    const kept = await page.evaluate(async () => {
      const cache = await caches.open('sagapyaw-model-v1');
      const hit = await cache.match(new URL('/models/shoon/voice.json', location.href).href);
      return hit ? await hit.text() : '';
    });
    check('the downloaded model survives a shell update', kept.includes('marker'), kept.slice(0, 40));
    check('no page errors', errors.length === 0, errors.join(' | '));
  });

  // --- scenario 2: the upgrade path for pages already running the old worker ----
  await withBrowser('upgrade', async (page, errors) => {
    await writeFile(join(dir, 'web', 'sw.js'), OLD_WORKER);
    await page.goto(startUrl, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 15000 });
    const old = await page.evaluate(() =>
      caches.keys().then((n) => n.filter((k) => k.startsWith('sagapyaw-shell-'))),
    );
    check('old worker installed for the upgrade scenario', old.join() === 'sagapyaw-shell-v1', old.join());

    // Ship the fix plus a new build, then refresh exactly once.
    await writeFile(join(dir, 'web', 'sw.js'), newWorker);
    check('the marker was written into the fixture', await deploy('build-3'));
    await page.reload({ waitUntil: 'load' });

    // The old worker answers with the stale shell, installs the new one, and the
    // new one reloads the page itself — no second refresh from the user.
    let healed = true;
    try {
      await page.waitForFunction(() => document.head.innerHTML.includes('build-3'), { timeout: 20000 });
    } catch {
      healed = false;
    }
    check('one refresh is enough to leave the old worker behind', healed);
    const shells = await page.evaluate(() =>
      caches.keys().then((n) => n.filter((k) => k.startsWith('sagapyaw-shell-'))),
    );
    check('the stale shell cache is gone', shells.join() === 'sagapyaw-shell-v2', shells.join());
    check('no page errors', errors.length === 0, errors.join(' | '));
  });
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(dir, { recursive: true, force: true });
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exitCode = failed ? 1 : 0;
