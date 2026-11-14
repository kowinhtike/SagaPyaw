#!/usr/bin/env node
/**
 * End-to-end check of the browser demo: loads the app in headless
 * Chromium, waits for a synthesis to finish, and reports what the page measured.
 *
 *   node tools/serve.mjs 8100 &
 *   node tools/test_browser.mjs http://localhost:8100/web/synth.html
 */
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

await mkdir('out', { recursive: true });
const url = process.argv[2] ?? 'http://localhost:8100/web/index.html';

// Same resolver as test_wav.mjs: chromium is /usr/bin on Linux, but Chrome lives in
// /Applications on macOS. CHROME_PATH overrides both.
const CHROME =
  process.env.CHROME_PATH ??
  (existsSync('/usr/bin/chromium')
    ? '/usr/bin/chromium'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const logs = [];
  page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));

  const target = new URL(url);
  // `?auto=read` runs the Realtime button; `?auto=export` the Export one.
  if (!target.searchParams.has('auto')) target.searchParams.set('auto', 'read');
  // The page starts with an empty box, so the harness has to supply the sentence
  // it wants spoken. `?text=` is the same switch a shared link would use.
  if (!target.searchParams.has('text')) {
    target.searchParams.set('text', 'မင်္ဂလာပါ။ ဒီနေ့ ရာသီဥတု ကောင်းတယ်။');
  }
  // The primary button is play and stop at once, so the harness has to see the
  // label change while the run is live. Sampling starts before any page script
  // runs, and a run lasts seconds, so a 25 ms poll cannot miss it.
  await page.evaluateOnNewDocument(() => {
    window.__labels = [];
    setInterval(() => {
      const button = document.getElementById('read');
      const label = button?.textContent.trim();
      if (label && window.__labels[window.__labels.length - 1] !== label) window.__labels.push(label);
    }, 25);
  });

  await page.goto(target.href, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.title.startsWith('ok ') || document.title.startsWith('error '), {
    timeout: 180000,
    polling: 500,
  });

  const result = await page.evaluate(() => ({
    title: document.title,
    status: document.getElementById('status').innerText,
    env: document.getElementById('env').innerText,
    phon: document.getElementById('phon').innerText,
    stats: document.getElementById('stats').innerText,
    synth: window.__lastSynth ?? null,
    isolated: self.crossOriginIsolated,
    labels: window.__labels ?? [],
    hint: document.getElementById('hint').hidden ? null : document.getElementById('hint').textContent.trim(),
  }));

  console.log('env      ', result.env);
  console.log('status   ', result.status);
  console.log('phonemes ', result.phon);
  console.log('stats    ', result.stats.replace(/\s+/g, ' '));
  console.log('measured ', JSON.stringify(result.synth));
  console.log('labels   ', result.labels.join(' → '));
  if (logs.length) console.log('console  ', logs.join('\n           '));

  await page.screenshot({ path: 'out/browser-demo.png' });
  console.log('screenshot out/browser-demo.png');
  // A run that never showed ရပ် means the single button stopped doubling as stop.
  const toggled = result.labels.includes('ရပ်');
  console.log(`button   ${toggled ? 'ok' : 'FAIL'} · primary toggled to ရပ် while running`);

  // ...and it has to come back once the last chunk has played out. A stuck ရပ်
  // would leave the app with no way to start again.
  const settled = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const started = Date.now();
        const tick = () => {
          const label = document.getElementById('read').textContent.trim();
          if (label === 'ဖတ်ပါ' || Date.now() - started > 15000) resolve(label);
          else setTimeout(tick, 100);
        };
        tick();
      }),
  );
  const back = settled === 'ဖတ်ပါ';
  console.log(`button   ${back ? 'ok' : 'FAIL'} · returned to ဖတ်ပါ after the audio drained (${settled})`);

  // The fall-behind note is a function of the measurement, not of the machine:
  // dead air is what realtime cost beyond the length of the audio. Asserting the
  // rule (rather than "it appeared") keeps this honest on a fast desktop and on
  // a phone that cannot keep up, without a threshold to tune.
  const synth = result.synth ?? {};
  const deadAir = (synth.synthMs ?? 0) / 1000 - (synth.seconds ?? 0);
  const shouldHint = (synth.mode ?? '') === 'stream' && !synth.stopped && deadAir >= 2.5;
  const hintOk = Boolean(result.hint) === shouldHint;
  console.log(
    `hint     ${hintOk ? 'ok' : 'FAIL'} · ${shouldHint ? 'shown' : 'hidden'} with ${deadAir.toFixed(1)}s dead air` +
      (result.hint ? ` · ${result.hint.slice(0, 40)}` : ''),
  );

  if (!result.title.startsWith('ok ') || !toggled || !back || !hintOk) process.exitCode = 1;
} finally {
  await browser.close();
}
