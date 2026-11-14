#!/usr/bin/env node
/**
 * End-to-end check of the app in file mode: synthesises a sentence, waits for the
 * <audio> element to get a blob URL, then saves that blob so the file can be
 * inspected with `npm run verify`.
 *
 *   node tools/serve.mjs 8100 &
 *   node tools/test_wav.mjs 'http://localhost:8100/web/index.html?mode=file'
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://localhost:8100/web/index.html';
const out = process.argv[3] ?? 'out/wav-mode.wav';
await mkdir('out', { recursive: true });

// The binary is not in the same place on every OS: Linux distros put chromium in
// /usr/bin, macOS keeps Chrome in /Applications. CHROME_PATH wins when both guesses
// are wrong (a Playwright download, a beta channel, a Chromium build).
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
  target.searchParams.set('auto', '1');
  await page.goto(target.href, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.title.startsWith('ok ') || document.title.startsWith('error '), {
    timeout: 180000,
    polling: 500,
  });

  const result = await page.evaluate(async () => {
    const audio = document.getElementById('audio');
    const dl = document.getElementById('dl');
    let bytes = null;
    if (dl.href.startsWith('blob:')) {
      const buf = new Uint8Array(await (await fetch(dl.href)).arrayBuffer());
      let bin = '';
      for (let i = 0; i < buf.length; i += 1) bin += String.fromCharCode(buf[i]);
      bytes = btoa(bin);
    }
    return {
      title: document.title,
      status: document.getElementById('status').innerText,
      stats: document.getElementById('stats').innerText.replace(/\s+/g, ' '),
      size: document.getElementById('size').innerText,
      download: dl.download,
      duration: audio.duration,
      hasSrc: audio.src.startsWith('blob:'),
      playerShown: document.getElementById('out').classList.contains('show'),
      wav: window.__lastSynth ?? null,
      bytes,
    };
  });

  console.log('status   ', result.status);
  console.log('stats    ', result.stats);
  console.log('size     ', result.size);
  console.log('download ', result.download);
  console.log('audio    ', `src=${result.hasSrc} duration=${Number.isFinite(result.duration) ? result.duration.toFixed(2) : result.duration} visible=${result.playerShown}`);
  console.log('measured ', JSON.stringify(result.wav));
  if (logs.length) console.log('console  ', logs.join('\n           '));

  if (result.bytes) {
    const data = Buffer.from(result.bytes, 'base64');
    await writeFile(out, data);
    const riff = data.subarray(0, 4).toString('ascii');
    const wave = data.subarray(8, 12).toString('ascii');
    console.log(`saved    ${out} · ${data.length} bytes · header ${riff}/${wave}`);
  }

  await page.screenshot({ path: 'out/wav-mode.png' });
  console.log('screenshot out/wav-mode.png');
  if (!result.title.startsWith('ok ') || !result.bytes) process.exitCode = 1;
} finally {
  await browser.close();
}
