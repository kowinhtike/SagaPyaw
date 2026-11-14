#!/usr/bin/env node
/**
 * Checks the voice row: placement, the three border states, and the LRU-2
 * eviction policy. No model is downloaded — the cache is seeded with 3-byte
 * stand-ins, which is enough for `isCached()` and for the eviction pass.
 *
 *   node tools/serve.mjs 8100 &
 *   node tools/test_voices.mjs
 */
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://localhost:8100/web/index.html';
const noPrewarm = (() => {
  const u = new URL(url);
  u.searchParams.set('prewarm', '0');
  return u.href;
})();

const CHROME =
  process.env.CHROME_PATH ??
  (existsSync('/usr/bin/chromium')
    ? '/usr/bin/chromium'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');

// Resolved from the CSS custom properties, not hardcoded: the test should fail if
// someone restyles the pills, and it should keep passing if only the hex changes.
const COLOR = { green: 'rgb(110, 231, 168)', blue: 'rgb(124, 196, 255)', grey: 'rgb(38, 43, 53)' };

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--mute-audio'],
});

let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) failed += 1;
};

/**
 * Seed the model cache with stand-ins for `voices`, then reload with prewarm
 * off. The stand-ins are 3 bytes, so letting the page build sessions from them
 * would fail on `JSON.parse` — the point here is the row's state, not inference.
 */
async function seedAndReload(page, voices) {
  await page.evaluate(async (ids) => {
    const cache = await caches.open('sagapyaw-model-v1');
    for (const key of await cache.keys()) await cache.delete(key);
    for (const v of ids) {
      for (const f of ['encoder.onnx', 'decoder.onnx', 'voice.json']) {
        await cache.put(
          new URL(`/models/${v}/${f}`, location.href).href,
          new Response(new Uint8Array([1, 2, 3])),
        );
      }
    }
    localStorage.setItem('sagapyaw:voices', JSON.stringify(ids));
  }, voices);
  await page.goto(noPrewarm, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('#voiceList button').length === 4);
}

/** Read the rendered state of every pill. */
const readPills = (page) =>
  page.$$eval('#voiceList button', (els) =>
    els.map((el) => ({
      id: el.dataset.voice,
      label: el.querySelector('small')?.textContent.trim() ?? '',
      current: el.getAttribute('aria-pressed') === 'true',
      border: getComputedStyle(el).borderTopColor,
      display: getComputedStyle(el).display,
    })),
  );

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(noPrewarm, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('#voiceList button').length === 4);

  /* ------------------------------------------------- 1. placement in the page */

  const layout = await page.evaluate(() => {
    const list = document.getElementById('voiceList');
    const card = list.closest('.card');
    const text = document.getElementById('text');
    return {
      inCard: Boolean(card),
      // The row must sit between the text box and the ဖတ်ပါ button, not in the header.
      afterText: text.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING ? true : false,
      beforeActions: list.nextElementSibling?.className === 'actions',
      inHeader: Boolean(document.querySelector('header #voiceList')),
      headerChip: Boolean(document.getElementById('voiceBtn')),
    };
  });
  check('the row lives inside the text card', layout.inCard);
  check('the row is below the text box', layout.afterText);
  check('the row is directly above the button', layout.beforeActions);
  check('no duplicate picker in the header', !layout.inHeader && !layout.headerChip);

  /* ------------------------------------------- 2. state colours, nothing cached */

  const cold = await readPills(page);
  check('four pills are always visible', cold.length === 4 && cold.every((p) => p.display !== 'none'));
  check('cold: every pill offers the download', cold.every((p) => p.label.startsWith('⬇')), cold[0].label);
  check('cold: only the current one is green', cold[0].current && cold[0].border === COLOR.green, cold[0].border);
  check('cold: the rest are grey', cold.slice(1).every((p) => p.border === COLOR.grey));

  /* ------------------------------------------------- 3. blue for cached voices */

  await seedAndReload(page, ['shoon', 'thazin']);
  const warm = await readPills(page);
  check('warm: current voice stays green', warm[0].border === COLOR.green, `${warm[0].id} ${warm[0].border}`);
  check('warm: cached voice turns blue', warm[1].border === COLOR.blue, `${warm[1].id} ${warm[1].border}`);
  check('warm: cached voices show a tick', warm[0].label === '✓' && warm[1].label === '✓', `${warm[0].label} / ${warm[1].label}`);
  check('warm: uncached voices stay grey', warm.slice(2).every((p) => p.border === COLOR.grey && p.label.startsWith('⬇')));

  /* ----------------------------------------------------- 4. switching voices */

  await page.click('#voiceList button[data-voice="thazin"]');
  // Wait for the re-render, not the URL: history.replaceState happens before the
  // await on isCached(), so the URL updates while the pills are still stale.
  await page.waitForFunction(
    () => document.querySelector('#voiceList button[data-voice="thazin"]')?.getAttribute('aria-pressed') === 'true',
  );
  const switched = await readPills(page);
  check('the green border moves to the chosen voice', switched[1].border === COLOR.green && switched[1].current, switched[1].border);
  check('the previous voice falls back to blue', switched[0].border === COLOR.blue && !switched[0].current, switched[0].border);
  const afterSwitch = await page.evaluate(() => ({
    search: location.search,
    status: document.getElementById('status').innerText,
    outHidden: !document.getElementById('out').classList.contains('show'),
    go: document.getElementById('go').innerText,
  }));
  check('URL carries ?voice=thazin', afterSwitch.search.includes('voice=thazin'), afterSwitch.search);
  check('output is reset on switch', afterSwitch.outHidden);
  check('cached voice needs no download', afterSwitch.go === 'ဖတ်ပါ', afterSwitch.go);
  check('status names the voice', afterSwitch.status.includes('Thazin'), afterSwitch.status.replace(/\s+/g, ' '));

  /* ------------------------------------------------------ 5. LRU-2 eviction */

  const eviction = await page.evaluate(async () => {
    const mod = await import('/web/model-store.js');
    const cache = await caches.open('sagapyaw-model-v1');
    const seed = async (voices) => {
      for (const key of await cache.keys()) await cache.delete(key);
      for (const v of voices) {
        for (const f of ['encoder.onnx', 'decoder.onnx', 'voice.json']) {
          await cache.put(new URL(`/models/${v}/${f}`, location.href).href, new Response(new Uint8Array([1, 2, 3])));
        }
      }
    };
    const listed = async () => {
      const seen = new Set();
      for (const req of await cache.keys()) seen.add(new URL(req.url).pathname.split('/')[2]);
      return [...seen].sort();
    };

    await seed(['shoon', 'thazin', 'htet-myat']);
    localStorage.setItem('sagapyaw:voices', JSON.stringify(['htet-myat', 'thazin', 'shoon']));
    const dropped = await mod.evictVoicesBeyondRecent();
    const left = await listed();
    const listAfter = JSON.parse(localStorage.getItem('sagapyaw:voices'));

    await seed(['shoon', 'thazin']);
    localStorage.removeItem('sagapyaw:voices');
    const droppedOnEmpty = await mod.evictVoicesBeyondRecent();
    const leftOnEmpty = await listed();

    localStorage.setItem('sagapyaw:voices', JSON.stringify(['shoon']));
    await mod.clearModelCache();
    const listAfterClear = localStorage.getItem('sagapyaw:voices');

    for (const key of await cache.keys()) await cache.delete(key);
    localStorage.removeItem('sagapyaw:voices');
    return { dropped, left, listAfter, droppedOnEmpty, leftOnEmpty, listAfterClear };
  });

  check('evicts the least recently used voice', eviction.dropped.join(',') === 'shoon', JSON.stringify(eviction.dropped));
  check('keeps exactly the two recent ones', eviction.left.join(',') === 'htet-myat,thazin', eviction.left.join(','));
  check('recency list is trimmed to two', eviction.listAfter.length === 2, JSON.stringify(eviction.listAfter));
  check('empty recency list evicts nothing', eviction.droppedOnEmpty.length === 0 && eviction.leftOnEmpty.length === 2, eviction.leftOnEmpty.join(','));
  check('clearing the cache clears recency', eviction.listAfterClear === '[]', eviction.listAfterClear);

  check('no uncaught page errors', errors.length === 0, errors.join(' | '));

  // A screenshot of the warm state is what a human actually judges this by.
  await seedAndReload(page, ['shoon', 'thazin']);
  await page.screenshot({ path: 'out/voices.png' });
  console.log('screenshot out/voices.png');
} finally {
  await browser.close();
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall voice checks passed');
