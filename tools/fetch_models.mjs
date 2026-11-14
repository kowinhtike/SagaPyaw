#!/usr/bin/env node
/**
 * Download voice ONNX graphs from Hugging Face into models/<voice>/.
 *
 *   node tools/fetch_models.mjs                     # shoon (default)
 *   node tools/fetch_models.mjs htet-myat           # one other voice
 *   node tools/fetch_models.mjs --all               # all four (~725 MB)
 *   node tools/fetch_models.mjs --all --force       # re-download
 *
 * Each voice is a separate encoder + decoder pair (weights differ, topology is
 * identical), so voices cannot share files. ~181 MB per voice.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://huggingface.co/YeeNyunn/nara-mini-v1/resolve/main/onnx';
const FILES = ['encoder.onnx', 'decoder.onnx', 'voice.json'];

const ALL_VOICES = ['shoon', 'htet-myat', 'ko-banyar', 'thazin'];

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const voices = argv.includes('--all')
  ? ALL_VOICES
  : argv.filter((a) => !a.startsWith('--'));

if (voices.length === 0) voices.push('shoon');

const bad = voices.filter((v) => !ALL_VOICES.includes(v));
if (bad.length) {
  console.error(`unknown voice: ${bad.join(', ')}`);
  console.error(`available: ${ALL_VOICES.join(', ')}`);
  process.exit(1);
}

async function exists(path) {
  try {
    const s = await stat(path);
    return s.size > 0;
  } catch {
    return false;
  }
}

let downloaded = 0;

for (const voice of voices) {
  const dest = join(root, 'models', voice);
  await mkdir(dest, { recursive: true });
  console.log(`\n${voice}  ->  models/${voice}/`);

  for (const name of FILES) {
    const target = join(dest, name);
    if (!force && (await exists(target))) {
      console.log(`  skip   ${name} (already present)`);
      continue;
    }
    const res = await fetch(`${REPO}/${voice}/${name}`, { redirect: 'follow' });
    if (!res.ok || !res.body) {
      console.log(`  get    ${name}  FAILED (HTTP ${res.status})`);
      process.exitCode = 1;
      continue;
    }
    const total = Number(res.headers.get('content-length') ?? 0);
    let seen = 0;
    let last = 0;
    const started = Date.now();
    const body = Readable.fromWeb(res.body);
    body.on('data', (chunk) => {
      seen += chunk.length;
      const now = Date.now();
      if (now - last < 400) return;
      last = now;
      const pct = total ? ((seen / total) * 100).toFixed(0) : '?';
      const rate = (seen / 1048576 / ((now - started) / 1000)).toFixed(1);
      process.stdout.write(`\r  get    ${name}  ${pct}%  ${(seen / 1048576).toFixed(1)} MB  ${rate} MB/s   `);
    });
    await pipeline(body, createWriteStream(target));
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`\r  get    ${name}  done  ${(seen / 1048576).toFixed(1)} MB in ${secs}s            `);
    downloaded += seen;
  }
}

console.log(`\n${(downloaded / 1048576).toFixed(1)} MB downloaded.  Serve with: npm run serve`);
console.log(`  http://localhost:8100/?voice=${voices[0]}`);
