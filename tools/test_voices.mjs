#!/usr/bin/env node
/**
 * Checks the two pieces of the voice feature that a synthesis test cannot reach:
 *
 *   1. the LRU-2 eviction policy, against fake cache entries (no downloads);
 *   2. the picker's state machine — four options, header, URL, output reset.
 *
 * Neither part downloads a model: selecting a voice only inspects the cache, and
 * eviction is exercised on 3-byte stand-ins for the 181 MB graphs.
 *
 *   node tools/serve.mjs 8100 &
 *   node tools/test_voices.mjs
 */
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://localhost:8100/web/index.html';

const CHROME =
  process.env.CHROME_PATH ??
  (existsSync('/usr/bin/chromium')
    ? '/usr/bin/chromium'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');

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

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // `auto` is deliberately absent: this test drives the UI, it does not synthesise.
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.getElementById('voiceBtn') !== null);

  /* ---------------------------------------------- 1. picker renders 4 voices */

  await page.click('#voiceBtn');
  await page.waitForFunction(() => document.querySelectorAll('#voiceList button').length > 0);
  const opened = await page.$eval('#voiceList', (el) => getComputedStyle(el).display);
  check('the list is actually visible when opened', opened === 'flex', opened);
  const options = await page.$$eval('#voiceList button', (els) =>
    els.map((el) => ({ text: el.innerText.trim(), pressed: el.getAttribute('aria-pressed') })),
  );
  check('picker lists four voices', options.length === 4, `(${options.length})`);
  check(
    'labels are the display names',
    options.map((o) => o.text.split('\n')[0]).join(',') === 'Shoon,Thazin,Htet Myat,Ko Banyar',
    options.map((o) => o.text.split('\n')[0]).join(','),
  );
  check('the default voice is marked selected', options[0].pressed === 'true');

  /* ------------------------------------- 2. selecting a voice does not download */

  await page.evaluate(() => {
    [...document.querySelectorAll('#voiceList button')].find((b) => b.innerText.includes('Thazin')).click();
  });
  await page.waitForFunction(() => document.getElementById('voiceName').textContent === 'Thazin');
  const afterSwitch = await page.evaluate(async () => ({
    header: document.getElementById('voiceName').textContent,
    search: location.search,
    status: document.getElementById('status').innerText,
    listHidden: document.getElementById('voiceList').hidden,
    listDisplay: getComputedStyle(document.getElementById('voiceList')).display,
    go: document.getElementById('go').innerText,
    // `caches.has()` is the wrong question: isCached() opens the cache, which
    // creates it. What matters is whether any model file was stored.
    cached: (await (await caches.open('sagapyaw-model-v1')).keys()).length,
  }));
  check('header shows the new voice', afterSwitch.header === 'Thazin');
  check('URL carries ?voice=thazin', afterSwitch.search.includes('voice=thazin'), afterSwitch.search);
  check('list closes after picking', afterSwitch.listHidden === true && afterSwitch.listDisplay === 'none', afterSwitch.listDisplay);
  check('status says a download is needed', /181|MB/.test(afterSwitch.status), afterSwitch.status.replace(/\s+/g, ' '));
  check('button offers download + read', /ဒေါင်းလုပ်/.test(afterSwitch.go), afterSwitch.go);
  check('nothing was cached by selecting', afterSwitch.cached === 0, `${afterSwitch.cached} entries`);

  /* ------------------------------------------------------ 3. LRU-2 eviction */

  const eviction = await page.evaluate(async () => {
    const mod = await import('/web/model-store.js');
    const cache = await caches.open('sagapyaw-model-v1');
    const seed = async (voices) => {
      for (const key of await cache.keys()) await cache.delete(key);
      for (const v of voices) {
        for (const f of ['encoder.onnx', 'decoder.onnx', 'voice.json']) {
          await cache.put(
            new URL(`/models/${v}/${f}`, location.href).href,
            new Response(new Uint8Array([1, 2, 3])),
          );
        }
      }
    };
    const listed = async () => {
      const seen = new Set();
      for (const req of await cache.keys()) seen.add(new URL(req.url).pathname.split('/')[2]);
      return [...seen].sort();
    };

    // Three cached voices, three recent uses: the oldest goes.
    await seed(['shoon', 'thazin', 'htet-myat']);
    localStorage.setItem('sagapyaw:voices', JSON.stringify(['htet-myat', 'thazin', 'shoon']));
    const dropped = await mod.evictVoicesBeyondRecent();
    const left = await listed();
    const listAfter = JSON.parse(localStorage.getItem('sagapyaw:voices'));

    // A cleared recency list must not wipe a full cache.
    await seed(['shoon', 'thazin']);
    localStorage.removeItem('sagapyaw:voices');
    const droppedOnEmpty = await mod.evictVoicesBeyondRecent();
    const leftOnEmpty = await listed();

    // Clearing the cache also clears the recency list.
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

  /* ---------------------------------------------- 4. the page survives all that */

  check('no uncaught page errors', errors.length === 0, errors.join(' | '));

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
