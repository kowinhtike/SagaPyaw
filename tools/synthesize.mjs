#!/usr/bin/env node
/**
 * Synthesize speech with the shoon voice, headless, through onnxruntime-web's
 * WASM backend — the same code path the browser uses.
 *
 *   node tools/synthesize.mjs --text "မင်္ဂလာပါ။" --out out/hello.wav
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { NaraSynthesizer, encodeWav } from '../dist/nara-g2p.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const text = flag('text', 'မင်္ဂလာပါ။ ဒီနေ့ ရာသီဥတု ကောင်းတယ်။');
const outPath = flag('out', 'out/speech.wav');
const voice = flag('voice', 'shoon');
const threads = Number(flag('threads', '4'));
const quiet = args.includes('--quiet');

// Resolve onnxruntime-web's dist folder so the WASM artifacts load under Node.
const ortDir = join(root, 'node_modules', 'onnxruntime-web', 'dist');
const ort = await import(pathToFileURL(join(ortDir, 'ort.wasm.bundle.min.mjs')).href);
ort.env.wasm.wasmPaths = `${ortDir}/`;
ort.env.wasm.numThreads = threads;

const modelDir = join(root, 'models', voice);
const t0 = performance.now();
const [encoder, decoder, metadata] = [
  readFileSync(join(modelDir, 'encoder.onnx')),
  readFileSync(join(modelDir, 'decoder.onnx')),
  JSON.parse(readFileSync(join(modelDir, 'voice.json'), 'utf8')),
];

const synth = await NaraSynthesizer.create(
  ort,
  { encoder: new Uint8Array(encoder), decoder: new Uint8Array(decoder), metadata },
  { executionProviders: ['wasm'], graphOptimizationLevel: 'all' },
);
const t1 = performance.now();

const samples = await synth.synthesize(text);
const t2 = performance.now();

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, encodeWav(samples, synth.sampleRate));

const seconds = samples.length / synth.sampleRate;
if (!quiet) {
  console.log(`voice      ${voice}  (${metadata.styles.length} style bins)`);
  console.log(`text       ${text}`);
  console.log(`audio      ${seconds.toFixed(2)} s @ ${synth.sampleRate} Hz`);
  console.log(`init       ${((t1 - t0) / 1000).toFixed(2)} s  (threads=${threads})`);
  console.log(`synth      ${((t2 - t1) / 1000).toFixed(2)} s  RTF ${((t2 - t1) / 1000 / seconds).toFixed(2)}`);
  console.log(`wrote      ${outPath}`);
}
