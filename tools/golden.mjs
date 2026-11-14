/**
 * Compare the TypeScript port against the reference Python output.
 *
 *   python3 tools/gen_corpus.py && python3 tools/ref.py && node tools/golden.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { textToPhonemes } from '../dist/sagapyaw.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(readFileSync(join(here, name), 'utf8'));

const args = process.argv.slice(2);
const corpusName = args[0] ?? 'corpus.json';
const expectedName = args[1] ?? 'expected.json';
const corpus = read(corpusName);
const expected = read(expectedName);

const cp = (s) => Array.from(s).map((c) => c.codePointAt(0).toString(16).padStart(4, '0'));

function firstDiff(a, b) {
  const A = Array.from(a);
  const B = Array.from(b);
  const n = Math.min(A.length, B.length);
  for (let i = 0; i < n; i += 1) if (A[i] !== B[i]) return i;
  return n;
}

function describe(text, want, got) {
  const i = firstDiff(want, got);
  const A = Array.from(want);
  const B = Array.from(got);
  const from = Math.max(0, i - 12);
  return {
    text,
    want,
    got,
    at: i,
    wantSlice: A.slice(from, i + 12).join(''),
    gotSlice: B.slice(from, i + 12).join(''),
    wantCp: cp(A.slice(i, i + 3).join('')),
    gotCp: cp(B.slice(i, i + 3).join('')),
  };
}

let pass = 0;
const failures = [];
const errorTypes = { py: new Set(), js: new Set() };

for (let i = 0; i < corpus.length; i += 1) {
  const text = corpus[i];
  const want = expected[i];
  let got;
  try {
    got = textToPhonemes(text).phon;
  } catch (err) {
    got = { error: err?.constructor?.name ?? 'Error' };
  }

  const wantIsError = typeof want === 'object';
  const gotIsError = typeof got === 'object';
  if (wantIsError) errorTypes.py.add(want.error);
  if (gotIsError) errorTypes.js.add(got.error);

  if (wantIsError || gotIsError) {
    // Both failing on the same input is a pass; only one failing is a divergence.
    if (wantIsError && gotIsError) pass += 1;
    else failures.push({ text, want: wantIsError ? want.error : want, got: gotIsError ? got.error : got, kind: 'error-mismatch' });
    continue;
  }

  if (want === got) {
    pass += 1;
  } else {
    failures.push({ ...describe(text, want, got), kind: 'phoneme-mismatch' });
  }
}

const total = corpus.length;
const rate = ((pass / total) * 100).toFixed(3);

console.log(`cases        ${total}`);
console.log(`match        ${pass}  (${rate}%)`);
console.log(`mismatch     ${failures.length}`);
console.log(`py errors    ${[...errorTypes.py].join(', ') || '-'}`);
console.log(`js errors    ${[...errorTypes.js].join(', ') || '-'}`);

if (failures.length) {
  console.log('\nfirst 25 mismatches:');
  for (const f of failures.slice(0, 25)) {
    console.log('─'.repeat(70));
    console.log('input   ', JSON.stringify(f.text));
    if (f.kind === 'error-mismatch') {
      console.log('want    ', f.want);
      console.log('got     ', f.got);
    } else {
      console.log(`want[${f.at}]`, JSON.stringify(f.wantSlice), f.wantCp.join(' '));
      console.log(`got [${f.at}]`, JSON.stringify(f.gotSlice), f.gotCp.join(' '));
    }
  }
  writeFileSync(join(here, 'failures.json'), JSON.stringify(failures, null, 1), 'utf8');
  console.log(`\nfull list -> tools/failures.json`);
  process.exitCode = 1;
} else {
  console.log('\nAll cases match the reference implementation.');
}
