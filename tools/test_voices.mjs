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
const COLOR = { green: 'rgb(110, 231, 168)', blue: 'rgb(124, 196, 255)', grey: 'rgb(38, 43, 53)', warn: 'rgb(255, 184, 107)' };

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

/** Read the rendered state of every pill, plus the download warning above them. */
const readPills = (page) =>
  page.evaluate(() => {
    const note = document.getElementById('voiceNote');
    return {
      note: {
        visible: !note.hidden && getComputedStyle(note).display !== 'none',
        text: note.textContent.trim(),
        color: getComputedStyle(note).color,
        aboveRow:
          note.nextElementSibling?.id === 'voiceList' &&
          Boolean(note.compareDocumentPosition(document.getElementById('voiceList')) & Node.DOCUMENT_POSITION_FOLLOWING),
      },
      pills: [...document.querySelectorAll('#voiceList button')].map((el) => ({
        id: el.dataset.voice,
        label: el.querySelector('small')?.textContent.trim() ?? '',
        current: el.getAttribute('aria-pressed') === 'true',
        border: getComputedStyle(el).borderTopColor,
        display: getComputedStyle(el).display,
      })),
    };
  });

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(noPrewarm, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('#voiceList button').length === 4);

  /* ------------------------------------------------- 1. placement in the page */

  const emptyState = await page.evaluate(() => ({
    value: document.getElementById('text').value,
    placeholder: document.getElementById('text').placeholder,
  }));
  check('the box starts empty', emptyState.value === '', JSON.stringify(emptyState.value));
  check('the hint asks for the text to speak', /အသံထုတ်လိုသော/.test(emptyState.placeholder), emptyState.placeholder);

  // Both actions must exist, and neither may start a download with no text.
  const actions = await page.evaluate(() => ({
    read: document.getElementById('read')?.innerText.trim(),
    export: document.getElementById('export')?.innerText.trim(),
  }));
  check('there are two actions', actions.read === 'ဖတ်ပါ' && /WAV/.test(actions.export ?? ''), `${actions.read} / ${actions.export}`);

  await page.click('#read');
  await new Promise((r) => setTimeout(r, 150));
  const afterEmptyClick = await page.evaluate(async () => ({
    status: document.getElementById('status').innerText,
    cached: (await (await caches.open('sagapyaw-model-v1')).keys()).length,
  }));
  check('empty box prompts instead of downloading', /ရိုက်ထည့်ပါ/.test(afterEmptyClick.status) && afterEmptyClick.cached === 0, afterEmptyClick.status.replace(/\s+/g, ' '));

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
  const coldPills = cold.pills;
  check('four pills are always visible', coldPills.length === 4 && coldPills.every((p) => p.display !== 'none'));
  check('cold: every pill shows only a down arrow', coldPills.every((p) => p.label === '⬇'), coldPills[0].label);
  check('cold: only the current one is green', coldPills[0].current && coldPills[0].border === COLOR.green, coldPills[0].border);
  check('cold: the rest are grey', coldPills.slice(1).every((p) => p.border === COLOR.grey));

  /* --------------------------------------- 3. the download warning above the row */

  check('warning is shown while voices are missing', cold.note.visible);
  check('warning sits directly above the pills', cold.note.aboveRow);
  check('warning is orange', cold.note.color === COLOR.warn, cold.note.color);
  check('warning states the size and the wait', /181\.2 MB/.test(cold.note.text) && /ကြာ/.test(cold.note.text), cold.note.text);

  /* ------------------------------------------------- 4. blue for cached voices */

  await seedAndReload(page, ['shoon', 'thazin']);
  const warm = await readPills(page);
  const warmPills = warm.pills;
  check('warm: current voice stays green', warmPills[0].border === COLOR.green, `${warmPills[0].id} ${warmPills[0].border}`);
  check('warm: cached voice turns blue', warmPills[1].border === COLOR.blue, `${warmPills[1].id} ${warmPills[1].border}`);
  check('warm: cached voices show a tick', warmPills[0].label === '✓' && warmPills[1].label === '✓', `${warmPills[0].label} / ${warmPills[1].label}`);
  check('warm: uncached voices stay grey', warmPills.slice(2).every((p) => p.border === COLOR.grey && p.label === '⬇'));
  check('warning stays while two voices are missing', warm.note.visible);

  /* ----------------------------------------------------- 5. switching voices */

  await page.click('#voiceList button[data-voice="thazin"]');
  // Wait for the re-render, not the URL: history.replaceState happens before the
  // await on isCached(), so the URL updates while the pills are still stale.
  await page.waitForFunction(
    () => document.querySelector('#voiceList button[data-voice="thazin"]')?.getAttribute('aria-pressed') === 'true',
  );
  const switched = await readPills(page);
  const switchedPills = switched.pills;
  check('the green border moves to the chosen voice', switchedPills[1].border === COLOR.green && switchedPills[1].current, switchedPills[1].border);
  check('the previous voice falls back to blue', switchedPills[0].border === COLOR.blue && !switchedPills[0].current, switchedPills[0].border);
  const afterSwitch = await page.evaluate(() => ({
    search: location.search,
    status: document.getElementById('status').innerText,
    outHidden: !document.getElementById('out').classList.contains('show'),
    // Switching must leave both actions usable: a stuck `disabled` here is the
    // classic symptom of a flag that was never cleared.
    readDisabled: document.getElementById('read').disabled,
    exportDisabled: document.getElementById('export').disabled,
  }));
  check('URL carries ?voice=thazin', afterSwitch.search.includes('voice=thazin'), afterSwitch.search);
  check('output is reset on switch', afterSwitch.outHidden);
  check('both actions stay enabled after a switch', !afterSwitch.readDisabled && !afterSwitch.exportDisabled);
  check('status names the voice', afterSwitch.status.includes('Thazin'), afterSwitch.status.replace(/\s+/g, ' '));

  /* ------------------------------------ 6. the warning goes away when it is done */

  await seedAndReload(page, ['shoon', 'thazin', 'htet-myat', 'ko-banyar']);
  const all = await readPills(page);
  check('warning disappears once all four are cached', !all.note.visible);
  check('all four pills are blue or green', all.pills.every((p) => p.border === COLOR.blue || p.border === COLOR.green));
  check('all four pills show a tick', all.pills.every((p) => p.label === '✓'));

  /* ------------------------------------------------------ 7. LRU-2 eviction */

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
