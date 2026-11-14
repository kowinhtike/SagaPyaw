/** Bundle the port into a single self-contained ESM file for the browser. */
import { build } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

const result = await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  target: ['es2022'],
  platform: 'neutral',
  outfile: 'dist/sagapyaw.mjs',
  loader: { '.tsv': 'text' },
  legalComments: 'none',
  minify: false,
  metafile: true,
});

const bytes = Object.values(result.metafile.outputs)[0].bytes;
console.log(`dist/sagapyaw.mjs  ${(bytes / 1024).toFixed(1)} KB`);

await copyFile('src/data/tables.json', 'dist/tables.json');

// Vendor the onnxruntime-web runtime so web/ works from a plain static server.
await mkdir('web/vendor', { recursive: true });
const ortDist = 'node_modules/onnxruntime-web/dist';
for (const f of [
  'ort.wasm.bundle.min.mjs',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
]) {
  await copyFile(`${ortDist}/${f}`, `web/vendor/${f}`);
}
console.log('web/vendor  onnxruntime-web runtime copied');
