# AGENTS.md — working on SagaPyaw

Context for any AI agent (or human) picking this repo up. Read this before changing code:
several invariants here are not obvious and are easy to break in ways that only show up on a
phone, three days later.

## What this is

A Burmese (Myanmar) text-to-speech client that runs **entirely in the browser**. No backend,
no API keys, no server-side inference: the ONNX weights ship with the site, get cached on the
device once, and inference runs in a WASM worker. The repo also contains a TypeScript port of
the model's Python text frontend (G2P) that is verified to be bit-identical to the original.

- Name: **SagaPyaw** (`စကားပြော` — "speech"). Package `sagapyaw`, bundle
  `dist/sagapyaw.mjs`, class `SagaSynthesizer`, caches `sagapyaw-*`. The *model* keeps its own
  name everywhere it appears; do not rename `nara-mini-v1` or `src/naraNames.ts`.
- Model: `YeeNyunn/nara-mini-v1` (Apache-2.0), Kokoro-style encoder + decoder, 24 kHz mono.
- Product: one page (`web/index.html`) — text box, the four-voice row, one button.
  Everything else is tooling.
- The UI copy is Burmese. Keep it that way unless asked.
- `web/index.html` has a two-line footer: the model credit (link to the Hugging Face repo —
  that is the Apache-2.0 attribution, keep it) and the author line, where `kowinhtike` links to
  this repo. Those two are the only outbound links on the page.

## Hard rules

Break one of these and the app silently degrades instead of failing loudly.

1. **Never remove the COOP/COEP headers.** `Cross-Origin-Opener-Policy: same-origin` +
   `Cross-Origin-Embedder-Policy: require-corp` are what enable `SharedArrayBuffer`, which is
   what gives onnxruntime-web more than one thread. They live in `tools/serve.mjs`,
   `tools/pack.mjs` (`_headers` and `vercel.json`). Without them the page still *works* — at
   `threads=1`, roughly half speed, and stuttering on a phone.
2. **Never test with `python3 -m http.server`.** It sends no COOP/COEP and the wrong MIME for
   `.wasm`. Use `npm run serve`.
3. **The G2P output must stay identical to `reference/` (the Python original).**
   `npm run check` runs 11,854 golden cases; `npm run fuzz` runs 4,000 random ones. If a change
   alters phonemes, that is a regression unless the reference changed too — never "fix" the
   golden files to make a test pass.
4. **The model is not reproducible under WASM.** Same text, same chunk, different run: mean
   |Δ| ≈ 0.005 against 0.11 RMS. Do not write hash-based or byte-equality audio tests. Compare
   sample counts exactly and correlation (> 0.99) instead — that is what `tools/verify_audio.py`
   does.
5. **Memory is the binding constraint on phones.** At most one ONNX graph in memory at a time
   (`web/index.html` loads encoder, builds the session, then loads decoder). Never hold two
   copies of the 181 MB weights, never `arrayBuffer()` a model file that is also cached.
   **Switching voices must call `synth.dispose()` before the next voice is fetched** — two
   voices is ~360 MB of weights plus two ORT heaps, and that is what makes a phone reload.
6. **Cache names are user data.** `sagapyaw-model-v1` (Cache API) holds the 181 MB of weights and
   `sagapyaw-shell-v2` (service worker) holds the app shell. Never put the model inside the
   service worker cache.
   The shell is **network first** and the model is **cache first**, and the difference matters:
   the shell changes with every deploy under file names that never change, so cache-first there
   meant a returning visitor kept the old UI until they hard-reloaded or cleared site data
   (`npm run test:sw` is the guard). The model is 181 MB and effectively immutable, so the cache
   is the source of truth for it. Bump `SHELL` only when the *contents* of the cache change
   shape — a stale shell is deleted and its open pages are reloaded by `activate`.
   `/dist/*` must stay `no-cache` in `_headers`: a year-fresh copy under a stable name is a year
   of the old app, and no service worker fix can rescue that.
7. **iOS specifics.** `AudioContext` must be created/resumed inside a user gesture, and
   `navigator.audioSession.type = 'playback'` is what makes audio ignore the silent switch
   (iOS 16.4+). Do not move either out of `player.unlock()`.
8. **No new runtime dependencies.** The shipped bundle is plain ES modules + onnxruntime-web.
   Build-time tools (esbuild, typescript, puppeteer-core) are fine.
9. **Keep it one page.** The user asked explicitly for fewer choices. Do not add pages, tabs or
   mode switches to the shipped UI; put tools under `web/dev/` (never copied into `site/`) and
   add query params (`?voice=`, `?text=`, `?auto=`, `?threads=`, `?prewarm=0`, `?sw=0`,
   `?wav=0`) for
   anything a developer needs. The dev panel (`?dev=1`) has a thread picker that sets
   `?threads=` and reloads — on a big.LITTLE phone 3 threads can beat 4, because the fourth
   worker lands on a little core and the main thread waits on it. The picker lists 1 up to the
   reported core count (capped at 8, never fewer than 4), so a phone that reports 8 cores can be
   asked to try 5 or 6; the shipped default stays `Math.min(4, hw)` and is not changed by this.
   Measured on a 10-core desktop over 89 s of audio: 4 threads RTF 0.52, 6 threads 0.47 (~11%),
   which is why the extra range exists — the default is a guess until a device is measured.
   Do not hardcode a different default without measuring on the device that matters.
   The one exception is the voice row between the text box and the button: four voices are
   content, not a mode, and they are always on screen rather than hidden behind a control.

## Voices

Four voices ship (`shoon`, `thazin`, `htet-myat`, `ko-banyar`). Each is its own 181 MB
encoder+decoder pair — the weights differ per voice and cannot be shared, so the full bundle is
~725 MB. `npm run fetch-models -- --all` downloads them; `pack --all` ships them.

On the device, only the **two most recently used** voices stay in the Cache API
(`evictVoicesBeyondRecent()` in `web/model-store.js`, recency in `localStorage`). That keeps a
phone inside its per-origin quota; a third selection evicts the oldest. Do not raise
`KEEP_VOICES` without checking iOS storage behaviour on a real device.

## Layout

```
src/                TypeScript text frontend + inference (the library)
  g2pMy.ts          Burmese G2P, ported from reference/ — treat as frozen
  inference.ts      SagaSynthesizer: runPiece / synthesizeStream / synthesize / encodeWav
  index.ts          textToPhonemes() convenience wrapper
web/                the client
  index.html        THE APP. One page: textarea, voice row, one primary, player, download
  player.js         StreamPlayer: schedules chunks on the AudioContext clock
  model-store.js    Cache API downloader + split-file reassembly
  sw.js             app-shell cache, network first (never the model)
  dev/              inspector.html (phoneme/token ids), synth.html (bare demo)
tools/              build, pack, serve, tests, reference oracle
reference/          unmodified Python frontend from the model repo (oracle, do not edit)
models/<voice>/     encoder.onnx, decoder.onnx, voice.json (gitignored, 181 MB per voice)
dist/               esbuild output, committed so `npm run serve` works without install
site/               generated deployable bundle
out/                generated WAVs and screenshots
```

## Commands

```sh
npm run serve                 # COOP/COEP static server on :8100 (no install needed)
npm install                   # only for build/test
npm run check                 # tsc --noEmit && build && 11,854 golden G2P cases
npm run fuzz                  # 4,000 random G2P cases against the Python oracle
npm run synth -- --text "မင်္ဂလာပါ။" --out out/demo.wav
npm run test:browser          # headless Chromium, stream mode (needs serve on :8100)
npm run test:wav              # headless Chromium, file mode; saves out/wav-mode.wav
npm run test:voices           # voice picker + LRU-2 eviction, no downloads
npm run test:sw               # a plain refresh must show the next build (self-contained)
npm run pack                  # site/, no weights (~11 MB)
npm run pack:split            # site/, weights included and split to ≤20 MiB per file
npm run build:site            # CI: fetch models → build → pack:split (what hosts run)
```

`npm run build:site` is the build command in `netlify.toml` and `vercel.json` (repo root).
Those two files and the `_headers` written by `pack` are the *only* thing making the deployed
site cross-origin isolated — do not delete them, and if you change a header change all three.
Deploying from git works because `models/` is gitignored and fetched at build time; the
weights can never be committed (GitHub rejects files over 100 MB and `decoder.onnx` is 107 MB).

`npm run build` is required after editing `src/` — the browser imports `dist/sagapyaw.mjs`,
not the TypeScript. Editing `web/*.html` needs no build, only a refresh (or `pack` to redeploy).

## How the app works

**G2P chain** (`src/index.ts`): `verbalize` (numbers → words) → `prepareNames` → `toTokens`
(Burmese + English + punctuation tokens) → `phonemize`. Output is a phoneme string that maps
through `voice.json`'s vocab to token ids.

**Chunking** (`inference.ts: planChunks`): text is split at sentence/clause boundaries under
200 characters. `chunking: 'sentence'` (what the page uses) keeps one chunk per sentence so the
pause lands on the writer's punctuation; `chunking: 'reference'` (the library default) packs
sentences up to 200 characters exactly like Python's `split_speech()`, which is what keeps
sample counts identical for `verify_audio.py`. Do not switch the default. For streaming, the
*first* chunk is cut short at whitespace (default 22 chars) so audio starts in about a second;
`firstLimit: 0` disables that.

**One primary, two behaviours** (`web/index.html`):

- **ဖတ်ပါ** (`stream`) — push each chunk to `StreamPlayer`, which schedules it on the audio clock
  ahead of the previous one, and keep rendering while the last one plays. Fast first audio.
  Cannot outrun the model: when generation is slower than playback the gaps are audible. This
  is accepted by the user, not a bug — do not "fix" it by falling back to file mode.
- **WAV ထုတ်ပါ** (`file`) — accumulate every chunk, then publish a WAV `Blob` in an
  `<audio controls>` element. It must **not** autoplay: the point is to hand over a file.

The same button is the stop control: while a run is live (or the last chunks are still sounding)
its label becomes **ရပ်** and its colour turns red. Do not add a separate stop button back — it
spent its whole life greyed out and made the row look like three equal choices. Export is a
quiet text button under the primary, not a peer of it: four pills plus two solid buttons plus a
disabled stop is what made the card read as a wall of controls.

**When realtime falls behind, the app says so once.** After a stream run it computes dead air
as `(rtf - 1) × audioSeconds` and shows a one-line note suggesting `WAV ထုတ်ပါ` when that
exceeds 2.5 s. The rule is in dead-air seconds, not in RTF, because the ratio alone is
misleading: 1.08 over two minutes is an audible pause, 1.08 over ten seconds is not. Measured
on a phone: RTF 1.51 on an 18 s passage, 1.92 on a 160 s one, against 0.46 on a desktop — so
this note is what a phone user actually needs. `tools/test_browser.mjs` asserts the rule rather
than the outcome, so it holds on both.

There is no automatic mode selection any more. `?auto=read` / `?auto=export` drives one button
for the headless harnesses.

Both paths end the same way: samples are merged, trailing/leading silence trimmed, peak
normalised to 0.92 (the model sits at ~0.11 RMS), encoded with `encodeWav()`, and exposed as a
download. So "streaming" and "download" are always the same take.

**The final WAV is not what makes realtime fall behind.** It is tempting to blame it — the CPU
visibly drops when the encode finishes — but the drop is ONNX inference ending, not the encode.
The encode runs after the last sentence is already rendered and scheduled on the audio clock, so
no sentence ever waits for it, and it costs 30 ms for 89 s of audio (measured; the same run with
`?wav=0` was 1.2 s *slower*, i.e. inside run-to-run noise). Keep it: on a phone a 160 s passage
takes minutes to synthesise, so the WAV a stream run hands over for free is the cheapest
gap-free file that user will ever get, and dropping it means paying for the same synthesis
twice. `?wav=0` skips it anyway, for one real reason — memory. The kept chunks, the merged copy
and the encoded bytes are about 3× the audio, so ten minutes of speech holds ~140 MB at once;
that is the case worth switching it off for, not speed.

**Split weights** (`model-store.js: loadParts`): hosts cap per-file size (Cloudflare Pages:
25 MiB; the decoder is 107 MB). `pack --split` writes `decoder.onnx.p00…p05` plus
`decoder.onnx.json` (size, part list, sha256). The client fetches parts into one preallocated
buffer (peak = size + one part), optionally verifies sha256 (`?verify=1`), then caches the
assembled file **under the original URL** — so `isCached()` and every later load behave as if
the file had never been split.

## Verifying a change

1. `npm run check` — must stay green (typecheck + build + 11,854 cases).
2. `npm run serve`, then open `http://localhost:8100/web/index.html` in a desktop browser.
   The status line must say `threads 4` (or more), not `threads 1`.
3. `npm run test:browser` — prints `firstAudioMs`, `RTF`, chunk count, and must end with
   `document.title` starting `ok `. Expect RTF ≈ 0.7–1.1 on a desktop.
4. `npm run test:wav` — saves a WAV and prints its size/duration; `RIFF/WAVE`, 24 kHz mono.
5. `npm run test:voices` — picker renders four voices, switching does not download, and the
   LRU-2 eviction keeps exactly two. Uses 3-byte stand-ins, so it runs in seconds.
6. `npm run pack:split`, then re-run `test:wav` against `http://localhost:8100/site/index.html`
   — this exercises the split-reassembly path.

## Known limitations (do not "fix" by guessing)

- **English text is not spoken.** `src/english.ts` tokenises Latin script but there is no
  espeak-ng WASM G2P behind it; only Burmese is synthesised. This is deliberate and documented.
- **First load is 181 MB** per voice. It is cached, but a phone may evict it; `persist()` is
  requested and the UI reports when it is refused.
- **Phones may reload the tab** while both the model and a long passage are in memory. Nothing
  in JS can prevent that; keep allocations minimal and free sessions when switching voices.
- **A voice switch costs another 181 MB.** Encoder + decoder are per-voice and not shareable.
- **`RTF > 1` on low-end devices is expected.** That is why `file` mode exists.
- **WebGPU does not run this graph.** Tried and measured on onnxruntime-web 1.22: the int8
  decoder carries int32 zero-point paths its WebGPU kernel does not implement —
  `[DequantizeLinear] decoder.asr_res.0.bias_DequantizeLinear failed: In the case of
  dequantizing int32 there is no zero point`. Listing `['webgpu','wasm']` does not rescue it,
  because the node is claimed by WebGPU when the graph is partitioned and fails at run time.
  A fp16 decoder would run on the GPU but is 2–4× the 107 MB. Re-test after an ORT upgrade;
  the experiment lives in git at `6015e3b` (`?ep=webgpu` plus a dev-panel radio group) and
  costs 21 MB of jsep wasm, which is why it is not on `main`.

## Style

- TypeScript, strict, no `any` unless it is in an `OrtTensorLike`-style boundary type.
- Comments explain *why* (a constraint, a measurement, a browser bug), never *what*. If you add
  a workaround, name the browser and the symptom.
- UI strings are Burmese; code identifiers and comments are English.
- Keep `dist/` committed: it is what makes the zip runnable without `npm install`.
