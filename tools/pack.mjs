#!/usr/bin/env node
/**
 * Assemble a deployable static site in `site/`.
 *
 *   node tools/pack.mjs                 # app shell + runtime, no model (≈12 MB)
 *   node tools/pack.mjs --with-models   # + models/shoon (≈193 MB)
 *   node tools/pack.mjs --with-models --all --split 20   # all four voices (≈736 MB)
 *
 * The app needs COOP/COEP headers for multi-threaded WASM; `_headers` (Netlify,
 * Cloudflare Pages) and `vercel.json` are written next to the output so a plain
 * upload gets them. Without those headers the page still works, at threads=1.
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = process.cwd();
const site = join(root, 'site');
const withModels = process.argv.includes('--with-models');
// Every voice the app offers. Each is a full 181 MB encoder+decoder pair, so
// shipping all four is ~725 MB; `--voice=` still packs a single one.
const ALL_VOICES = ['shoon', 'thazin', 'htet-myat', 'ko-banyar'];
const voiceArg = process.argv.find((a) => a.startsWith('--voice='))?.split('=')[1];
const voices = process.argv.includes('--all')
  ? ALL_VOICES
  : voiceArg
    ? voiceArg.split(',').filter(Boolean)
    : [ALL_VOICES[0]];

// `--split 20` splits the weights so no single file exceeds a host's per-file
// cap (Cloudflare Pages: 25 MiB). Parsed up front because the pages need to know
// whether to look for parts before the plain URL.
const splitArg = process.argv.find((a) => a.startsWith('--split'));
let partMiB = 0;
if (splitArg) {
  const raw = splitArg.includes('=')
    ? splitArg.split('=')[1]
    : process.argv[process.argv.indexOf(splitArg) + 1];
  partMiB = Number(raw) > 0 ? Number(raw) : 20;
}
const willSplit = partMiB > 0 && withModels;

await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });

// --- app shell -----------------------------------------------------------------
for (const file of ['player.js', 'model-store.js', 'sw.js', 'manifest.webmanifest']) {
  await cp(join(root, 'web', file), join(site, file));
}
await cp(join(root, 'web', 'icons'), join(site, 'icons'), { recursive: true });
await cp(join(root, 'web', 'vendor'), join(site, 'vendor'), { recursive: true });
await cp(join(root, 'dist'), join(site, 'dist'), { recursive: true });

// The page lives one level deeper in the repo (web/index.html next to ../dist),
// so promote it to the site root and drop the "../" prefixes.
async function promote(name, out) {
  const html = await readFile(join(root, 'web', name), 'utf8');
  const rewritten = html
    .replaceAll("'../dist/sagapyaw.mjs'", "'./dist/sagapyaw.mjs'")
    .replaceAll("'../dist/", "'./dist/")
    .replaceAll('`../models/${', '`./models/${')
    // Tell model-store.js to read the manifest first: avoids a guaranteed 404 on
    // the unsplit URL, which would otherwise show up as a console error.
    .replace('<head>', `<head>\n${willSplit ? '<script>window.__SPLIT_MODELS=1</script>\n' : ''}`);
  await writeFile(join(site, out), rewritten);
}

await promote('index.html', 'index.html');

const sw = (await readFile(join(root, 'web', 'sw.js'), 'utf8')).replaceAll("'../dist/", "'./dist/");
await writeFile(join(site, 'sw.js'), sw);

// --- model ---------------------------------------------------------------------
if (withModels) {
  for (const voice of voices) {
    const from = join(root, 'models', voice);
    if (!existsSync(from)) {
      console.error(`models/${voice} not found — run: npm run fetch-models -- --all`);
      process.exit(1);
    }
    await cp(from, join(site, 'models', voice), { recursive: true });
  }
} else {
  await mkdir(join(site, 'models'), { recursive: true });
}

// --- split oversized weights ----------------------------------------------------
// Cloudflare Pages rejects any single file over 25 MiB, and the decoder is 107 MB.
// Splitting keeps the model on the same domain as the app — one deploy, no second
// host — at the cost of one manifest and a reassembly step in model-store.js.
const splitReport = [];
if (willSplit) {
  const partSize = Math.floor(partMiB * 1024 * 1024);
  for (const voice of voices) {
    const dir = join(site, 'models', voice);
    for (const name of ['encoder.onnx', 'decoder.onnx']) {
      const file = join(dir, name);
      if (!existsSync(file)) continue;
      const buf = await readFile(file);
      const parts = [];
      for (let offset = 0, i = 0; offset < buf.length; offset += partSize, i += 1) {
        const slice = buf.subarray(offset, Math.min(offset + partSize, buf.length));
        const partName = `${name}.p${String(i).padStart(2, '0')}`;
        await writeFile(join(dir, partName), slice);
        parts.push({ name: partName, size: slice.length });
      }
      const sha256 = createHash('sha256').update(buf).digest('hex');
      await writeFile(
        join(dir, `${name}.json`),
        `${JSON.stringify({ file: name, size: buf.length, sha256, partMiB, parts }, null, 1)}\n`,
      );
      await rm(file);
      splitReport.push(`models/${voice}/${name} → ${parts.length} × ≤${partMiB} MiB`);
    }
  }
}

// --- hosting config ------------------------------------------------------------
const headers = `# Multi-threaded WASM needs cross-origin isolation.
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Resource-Policy: cross-origin
  X-Content-Type-Options: nosniff

/sw.js
  Cache-Control: no-cache

/index.html
  Cache-Control: no-cache

/vendor/*
  Cache-Control: public, max-age=31536000, immutable

/dist/*
  Cache-Control: public, max-age=31536000, immutable

/models/*
  Cache-Control: public, max-age=31536000, immutable
`;
await writeFile(join(site, '_headers'), headers);

const vercel = {
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
      ],
    },
    {
      source: '/(vendor|dist|models)/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
  ],
};
await writeFile(join(site, 'vercel.json'), `${JSON.stringify(vercel, null, 2)}\n`);

console.log(`site/  ready  ${withModels ? `(with models/${voices.join(', models/')})` : '(no models — run fetch-models on the host or copy models/ in)'}`);
if (splitReport.length) {
  console.log(`  split: ${splitReport.length} graphs → ≤${partMiB} MiB parts`);
  console.log('         model-store.js reassembles them on first load, then caches as one file');
} else if (partMiB && !withModels) {
  console.log('  --split ignored: needs --with-models');
}
console.log('  deploy: upload site/ to Netlify / Cloudflare Pages / Vercel');
console.log('  _headers + vercel.json already carry COOP/COEP');
