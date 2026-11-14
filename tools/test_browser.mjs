#!/usr/bin/env node
/**
 * End-to-end check of the browser demo: loads the app in headless
 * Chromium, waits for a synthesis to finish, and reports what the page measured.
 *
 *   node tools/serve.mjs 8100 &
 *   node tools/test_browser.mjs http://localhost:8100/web/synth.html
 */
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

await mkdir('out', { recursive: true });
const url = process.argv[2] ?? 'http://localhost:8100/web/index.html';
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
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
  target.searchParams.set('auto', '1');
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
  }));

  console.log('env      ', result.env);
  console.log('status   ', result.status);
  console.log('phonemes ', result.phon);
  console.log('stats    ', result.stats.replace(/\s+/g, ' '));
  console.log('measured ', JSON.stringify(result.synth));
  if (logs.length) console.log('console  ', logs.join('\n           '));

  await page.screenshot({ path: 'out/browser-demo.png' });
  console.log('screenshot out/browser-demo.png');
  if (!result.title.startsWith('ok ')) process.exitCode = 1;
} finally {
  await browser.close();
}
