# SagaPyaw · စကားပြော

**[→ Live demo](https://sagapyaw.sagapyaw.workers.dev)** · four voices, one download of
181 MB per voice, cached on the device after that.

Burmese text-to-speech that runs **entirely in the browser** — no backend, no API keys, no
server-side inference. The weights ship with the site, get cached on the device once, and
inference runs in a WASM worker.

SagaPyaw is a Burmese text frontend **and** client-side inference for
[`YeeNyunn/nara-mini-v1`](https://huggingface.co/YeeNyunn/nara-mini-v1), ported from the
model's Python release to TypeScript so the whole pipeline runs in a browser.

The model is Kokoro-82M fine-tuned for Burmese + English, shipped as two ONNX graphs.
Everything around it — number verbalisation, name replacement, syllable parsing, phoneme
mapping, chunking, style selection, duration expansion — is Python in the original. This
package is all of that, rewritten for the web, verified against the reference.

### Voices

The model ships four preset voices — `shoon`, `thazin`, `ko-banyar`, `htet-myat` (display
names Shoon, Thazin, Ko Banyar, Htet Myat). Upstream describes each as *"its own network and
matching voicepack"*, and the numbers bear that out: identical file sizes, different
checksums, and even a different number of length-bin centers (Shoon has 7, the others 8).

Pick one from the row under the text box; the choice is written into the URL (`?voice=thazin`)
so it can be shared. Each voice is a full 181 MB encoder + decoder pair, and the cache keeps
the two most recently used.

The pill borders say what state each voice is in — **green** for the one in use, **blue** for
downloaded and ready, grey with `⬇ 181.2 MB` for one that still has to be fetched. Green wins
over blue when the voice in use is also cached.

## Verification

| Check | Result |
|---|---|
| G2P: structured corpus | 7,854 cases |
| G2P: random fuzz corpus | 4,000 cases |
| G2P: exact phoneme match vs Python | **11,854 / 11,854 (100%)** |
| G2P: mutation test (one tone constant flipped) | 2,595 cases fail → the harness bites |
| Phoneme chars present in the 178-symbol vocab | 45 / 45 |
| Audio: sample count vs Python | identical on 6/6 sentences |
| Audio: waveform correlation | 0.9946 – 0.9970 |
| Encoder intermediates vs Python | durations identical, prosody max Δ 4.1e-6 |
| Browser: streaming RTF (4 threads, worker) | 0.78 – 0.85 |
| Browser: first audio, warm model | 0.85 – 1.3 s |
| Browser: second visit | 0 MB download, init 1.2 s |

How the guarantee is built:

1. **Tables are exported, not retyped.** `tools/export_data.py` reads the reference modules
   and emits `src/data/tables.json` — onsets, rhymes, tone maps, the syllable regex, even
   the order of the `str.replace()` steps in `normalize()`. A hand-typed Burmese literal
   cannot silently drift.
2. **The corpus is generated from those same tables**: every consonant × vowel × final,
   all medial permutations, every lexicon entry, every mined voicing/schwa rule, numbers,
   currency, punctuation, whitespace, plus 4,000 random strings.
3. **`tools/ref.py`** runs the real Python frontend, **`tools/golden.mjs`** runs the port,
   and the two are diffed character by character.
4. **`tools/verify_audio.py`** does the same at the waveform level.

## Quick start

**No install needed** — `dist/` and `web/vendor/` are prebuilt and `tools/serve.mjs` only
uses Node built-ins:

```sh
npm run serve                 # http://localhost:8100/web/index.html
```

Full build + tests:

```sh
npm install
npm run check                 # typecheck + build + golden test (G2P)
npm run fuzz                  # + 4,000 random cases
npm run serve                 # http://localhost:8100/web/index.html
```

`npm run serve` sends `COOP`/`COEP`, which is what enables multi-threaded WASM. Without
those headers the page still works, just on one thread (~2× slower).

Model files go in `models/shoon/`:

```sh
npm run fetch-models          # ≈181 MB from Hugging Face
```

All four voices (`shoon`, `htet-myat`, `ko-banyar`, `thazin`), ~725 MB:

```sh
npm run fetch-models -- --all
```

The synthesizer itself is voice-agnostic — `models/<voice>/` is the only thing that changes.
The page carries a four-voice row under the text box; `?voice=` selects the same voice and is
what the row writes into the URL, so a link can point at one voice:

```
http://localhost:8100/web/index.html?voice=htet-myat
```

Or by hand:

```sh
hf download YeeNyunn/nara-mini-v1 --include "onnx/shoon/*" --local-dir tmp
mkdir -p models/shoon && mv tmp/onnx/shoon/* models/shoon/
```

## Inference

Headless (Node, WASM — the same code path as the browser):

```sh
node tools/synthesize.mjs --text "မင်္ဂလာပါ။" --out out/hello.wav
# audio 2.73 s @ 24000 Hz | init 1.55 s | synth 2.22 s | RTF 0.82
```

In the browser:

```js
import * as ort from './vendor/ort.wasm.bundle.min.mjs';
import { SagaSynthesizer, encodeWav } from './dist/sagapyaw.mjs';

ort.env.wasm.wasmPaths = new URL('./vendor/', document.baseURI).href;
ort.env.wasm.numThreads = self.crossOriginIsolated ? 4 : 1;

const synth = await SagaSynthesizer.create(ort, {
  encoder: new Uint8Array(await (await fetch('models/shoon/encoder.onnx')).arrayBuffer()),
  decoder: new Uint8Array(await (await fetch('models/shoon/decoder.onnx')).arrayBuffer()),
  metadata: await (await fetch('models/shoon/voice.json')).json(),
});

const samples = await synth.synthesize('မင်္ဂလာပါ။'); // Float32Array @ 24 kHz
```

### API

| Export | Purpose |
|---|---|
| `textToPhonemes(text, { normalizeNumbers })` | Full text chain: verbalize → names → English → phonemize |
| `phonemize(text)` / `phonemizeDetailed(text)` | Syllable parsing + phoneme mapping (+ rejected syllables) |
| `verbalize(text)` | Burmese number / percent / currency reading |
| `replaceNames(text)` | Romanised Burmese names → pre-phonemised IPA |
| `g2p(text)` | Syllable-level output (`k-a-˧` style), for debugging |
| `splitSpeech(text, limit)` | Chunking that mirrors `split_speech()` |
| `SagaSynthesizer.create(ort, model)` | Builds encoder/decoder sessions |
| `SagaSynthesizer.fromSessions(ort, enc, dec, meta)` | When you build sessions yourself (one graph at a time) |
| `synth.synthesize(text)` | → `Float32Array` PCM, 24 kHz mono |
| `synth.synthesizeStream(text, opts)` | → async generator of playable chunks |
| `planChunks(text, limit, firstLimit)` | The chunk plan, exposed for tests and UIs |
| `encodeWav(samples, rate)` | → 16-bit PCM WAV bytes |
| `setEnglishG2P(fn)` | Plug in an espeak-ng WASM backend for Latin runs |

## What the numbers mean

The port is **structurally exact**: identical phonemes, identical token ids, identical
style bin, identical durations, identical sample count. The residual audio difference
(correlation 0.995, SNR ≈ 21 dB) comes from running the **INT8 QDQ decoder** through
onnxruntime-web's WASM kernels instead of the native CPU kernels — proven by feeding both
decoders the *same* input tensors and getting the same 0.11 peak difference. The energy is
concentrated at 4–12 kHz, where the signal itself is 40 dB down; the 0–1 kHz band keeps
22.9 dB SNR. It sounds like the same utterance rendered by a different vocoder build.

Python is bit-identical across thread counts. **onnxruntime-web is not**: two identical runs
in the same session differ by mean |Δ| 0.005 / peak 0.10 against a 0.11 RMS signal (≈ −27 dB),
with or without threads, memory pattern, or graph optimisations. So a chunk streamed on its
own is not bit-identical to the same chunk inside a longer passage — the model is simply not
reproducible under the WASM kernels. It is inaudible, but it rules out hash-based audio
tests; `tools/verify_audio.py` compares sample counts exactly and correlation instead.

## Streaming, cache, phones

`web/index.html` is the whole client — one page: a text box, the four-voice row, and a button.
Everything below is wired up:

| Piece | What it does |
|---|---|
| `synth.synthesizeStream(text, { firstLimit, signal })` | Yields one playable chunk at a time. The first chunk is cut short at whitespace (default 22 chars) so the listener hears something in ~1 s; the rest keep the full 200-char budget. |
| `web/player.js` | Schedules chunks on the AudioContext clock instead of playing them on arrival, so gaps between chunks disappear. Unlocks on the first tap (iOS refuses otherwise) and sets `audioSession.type = 'playback'` so the silent switch does not mute it. |
| `web/model-store.js` | Downloads each file **through** a counting stream straight into the Cache API — 181 MB never sits in JS memory twice. Falls back to a buffered put where Safari refuses streaming bodies. Also owns the voice recency list and the two-voice eviction. |
| `synth.dispose()` | Frees both ORT graphs before another voice is fetched. The picker will not switch mid-synthesis; it asks you to wait rather than tearing down a running decode. |
| `ort.env.wasm.proxy = true` | Runs inference in a worker. Without it a 5 s decode freezes the main thread, which on a phone looks like a hang and makes "ရပ်" dead. Measured: stop now settles in 0.2 s. |
| `web/sw.js` + `manifest.webmanifest` | Installable PWA, app shell cached for offline. The 181 MB models are deliberately **not** in the service worker cache, so a shell update can never invalidate them. |

### Two playback modes

| Mode | Behaviour |
|---|---|---|
| `stream` | Plays each chunk as it lands. First audio in ~1 s. **Cannot** beat real time: if generation is slower than playback (any phone at `threads=1`), the gaps are audible. |
| `file` | Synthesises the whole passage, then plays one `Blob` in a plain `<audio controls>` element. No gaps possible, seekable. Costs the full generation time up front. |

`decideMode()` picks between them and the user never sees a switch: phones, un-isolated
pages (`threads=1`) and anything under 8 cores get `file` for passages up to 600 characters,
everything else streams. `?mode=file` / `?mode=stream` forces either one for testing.

Either way the run ends in the same place — the accumulated samples are normalised,
trimmed and encoded to WAV, and the player card under the status line offers replay and
download. Streaming output and the downloadable file are therefore always the same take.

`file` mode calls `synthesizeStream(text, { firstLimit: 0 })` so the chunk plan matches
`synthesize()` — the file is the same one `npm run synth` would write. The export then
peak-normalises (the model sits around 0.11 RMS, quiet on a phone speaker) and trims long
leading/trailing silence. Verified in headless Chromium: 2.2 s of audio → 103 KB in file
mode, 2.8 s → 130 KB in stream mode, both RIFF/WAVE 24 kHz 16-bit mono.

### Deploying

```sh
npm run pack                   # site/ ≈ 11 MB, no weights
npm run pack -- --with-models  # + models/shoon ≈ 193 MB
npm run pack:split             # same, weights split to ≤20 MiB per file
npm run pack:split --all       # all four voices ≈ 736 MB
```

`site/` is a flat static bundle with `_headers` (Netlify / Cloudflare Pages) and
`vercel.json` already carrying the `COOP`/`COEP` headers that multi-threaded WASM needs.
Without them the page still runs, at `threads=1` and roughly half the speed — on a phone
that is the difference between smooth and stuttering.

Shipping all four voices costs **≈736 MB of upload** (4 × 181 MB of weights plus the ~11 MB
shell), because each voice is its own encoder + decoder pair. That is a one-off cost per
deploy, not per visitor: a visitor downloads only the voice they pick, and the cache keeps
their two most recent ones.

#### Deploying from Git (Vercel / Netlify)

Use the **slim** checkout. The weights cannot live in git: `decoder.onnx` is 107 MB, over
GitHub's 100 MB per-file hard limit, so the push is rejected outright. `.gitignore` already
excludes `models/` and `site/`, which keeps the pushed repo at ~13 MB (mostly `web/vendor`).

`npm run build:site` is the entire CI step — fetch, build, pack:

```sh
node tools/fetch_models.mjs --all                     # 725 MB from Hugging Face
node tools/build.mjs                                  # dist/
node tools/pack.mjs --with-models --all --split 20    # site/ ≈ 736 MB
```

Both configs are committed at the repo root, so connecting the repo is the only manual step:

| File | Host | Sets |
|---|---|---|
| `netlify.toml` | Netlify | build command, `publish = "site"`, COOP/COEP, cache headers |
| `vercel.json` | Vercel | the same, via `buildCommand` + `outputDirectory: "site"` |

Things worth knowing before you push:

- **Build time** is 8–15 minutes with all four voices, almost all of it the download. The
  725 MB is *not* cached between builds by default, so every push pays it again (add
  `netlify-plugin-cache` with `models/` if that annoys you). Shipping one voice
  (`--voice=shoon`) drops it back to 1–3 minutes.
- **Per-file cap**: with `--split 20` the largest file is 20 MiB — under Cloudflare's
  25 MiB, Vercel's ~100 MB and Netlify's ~100 MB alike.
- **Bandwidth is the real cost.** Each new voice a visitor picks is another 181 MB. Netlify
  free is 100 GB/month, i.e. ~550 voice downloads; Vercel Hobby is 100 GB and personal-use
  only. Cloudflare Pages has no bandwidth cap — for real traffic, publish `site/` there
  instead (`npx wrangler pages deploy site`), or keep git on Netlify and mirror the folder
  to CF.
- **`site/` is generated.** Never commit it; the hosts build it.

#### Cloudflare (recommended — no bandwidth cap)

This is how the live demo is deployed. Note that Cloudflare's current "Connect to Git" flow
creates a **Worker**, not a Pages project — the settings below are the same either way, but
the URL is `sagapyaw.<account-subdomain>.workers.dev` instead of `sagapyaw.pages.dev`.

Cloudflare ignores `netlify.toml` and `vercel.json`, so the build has to be described in the
dashboard. Connect the repo, then set:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build:site` |
| Build output directory | `site` |
| Root directory | `/` (default) |
| Environment variable | `NODE_VERSION` = `22` (`.nvmrc` also carries it) |

The 25 MiB per-file cap is why `--split 20` exists; `build:site` already passes it, so no
extra flag is needed. Two things differ from Netlify/Vercel:

- **COOP/COEP come from `site/_headers`, not a config file.** Cloudflare cannot set response
  headers from the repo root; the only hook is a `_headers` file in the *output* directory,
  which `tools/pack.mjs` writes. Verified on Workers static assets: the deployed page returns
  `cross-origin-opener-policy: same-origin` and `cross-origin-embedder-policy: require-corp`.
  Deleting `site/_headers` would drop the page to `threads=1`.
- **Builds are slower and fail loudly.** Every build re-downloads 725 MB from Hugging Face;
  Cloudflare's build image is generous but a four-voice build takes 8–15 minutes and the
  free-plan build timeout is the thing to watch. If the fetch times out, re-run the
  deployment — the second attempt usually succeeds.

**Why `--split` exists.** Cloudflare Pages rejects any single file over 25 MiB and the
decoder is 107 MB, so a self-contained bundle could not be uploaded there at all. With
`--split 20` the weights ship as `decoder.onnx.p00 … p05` plus a `decoder.onnx.json`
manifest (size, part list, sha256), and `web/model-store.js` reassembles them into one
preallocated buffer before handing the bytes to onnxruntime. Peak memory stays at
`size + one part`, and the assembled file is cached under the *original* URL, so the
second visit makes zero model requests. The split is invisible to the rest of the app:
`isCached()`, progress reporting and the `?voice=` switch all behave as before.
Verified end to end: 10 parts fetched, sha256 matched (`?verify=1`), second load
served entirely from the Cache API.

## Known limitations

- **English is not phonemised by default.** The reference uses `misaki` + espeak-ng
  (GPLv3, native). Without an injected backend, Latin runs pass through untouched — and
  since they are not in the vocab, the model skips them. Inject one with
  `setEnglishG2P()`, or pre-phonemise server-side.
- **181 MB of weights per voice.** Encoders differ per voice, so voices cannot share them —
  identical file sizes, different checksums. Cache with the Cache API / OPFS; brotli only
  saves ~8 %.
- **Switching voices costs a download.** All four (`shoon`, `thazin`, `htet-myat`,
  `ko-banyar`) are selectable from the row under the text box, but the first use of each
  fetches its own 181 MB. Switching *back* to a cached voice is instant.
- **Only two voices stay cached.** `model-store.js` keeps an LRU list in `localStorage` and
  evicts everything beyond the two most recently used, so picking a third voice silently
  frees the oldest. Without a cap, four voices is 725 MB on disk — over Safari's storage
  budget for a single origin, and a `QuotaExceededError` is not something the page can
  recover from gracefully. Two voices (362 MB) sits comfortably inside it.
- **Never two voices in memory.** `synth.dispose()` releases both ORT graphs *before* the
  next voice is fetched; loading one on top of another is ~360 MB of weights plus two heaps,
  which is what makes a phone reload the tab.
- **Streaming is chunk-level, not sentence-level.** A chunk is cut at whitespace, so the pause
  token that a space normally produces is lost at the boundary; the 200 ms inter-chunk gap
  covers it. Chunks above ~200 chars would exceed the 508-phoneme context.
- **iOS memory is the real ceiling.** Two graphs plus the ORT heap land around 400–500 MB of
  tab memory. Modern iPhones are fine; older ones may reload the tab. Graphs are loaded one at
  a time and inference runs in a worker to keep that as low as possible.
- Two helpers in `g2p_my.py` (`_to_schwa`, `_is_minor_syllable`) are dead code upstream
  and were not ported.

## Layout

```
src/            TypeScript port
                data.ts g2pMy.ts charMap.ts myNumbers.ts naraNames.ts
                english.ts frontend.ts inference.ts index.ts
src/data/       tables.json + the two TSV tables (generated from reference/)
reference/      unmodified Python frontend from the model repo (Apache-2.0)
models/<voice>/  encoder.onnx, decoder.onnx, voice.json (shoon · thazin · htet-myat · ko-banyar)
tools/          export_data.py gen_corpus.py gen_fuzz.py ref.py golden.mjs
                build.mjs serve.mjs synthesize.mjs verify_audio.py
                test_browser.mjs cli.mjs fetch_models.mjs pack.mjs
web/            index.html (the app — one page) · player.js model-store.js
                sw.js manifest.webmanifest icons/ vendor/
                dev/inspector.html (phoneme inspector) · dev/synth.html (bare demo)
site/           generated deployable bundle (npm run pack)
out/            generated WAVs and screenshots
dist/           build output
```

## Credits

| What | Who | Licence |
|---|---|---|
| `nara-mini-v1` model + Python text frontend (`reference/`) | [YeeNyunn / Nara Audio](https://huggingface.co/YeeNyunn/nara-mini-v1) | Apache-2.0 |
| Kokoro-82M, the architecture it was fine-tuned from | [hexgrad](https://huggingface.co/hexgrad/Kokoro-82M) | Apache-2.0 |
| TypeScript port, browser client, tooling | this repo | Apache-2.0 |

The four voices were built by Nara Audio from synthetic speech; the port neither retrains nor
modifies them, it only runs the released ONNX graphs.

## Licence

**Apache-2.0** — see [LICENSE](LICENSE) and [NOTICE](NOTICE).

The port follows the upstream model release, so the licence is the same one the model already
carries; nothing here is more restrictive than the thing it is built on. In practice:

- `reference/` is the original Python frontend by YeeNyunn, included **unmodified** as the
  verification oracle. It is redistributed under Apache-2.0, not relicensed.
- **The weights are not in this repo.** `models/` is gitignored; `npm run fetch-models` pulls
  them from the model release at build time, where they stay under Nara Audio's licence. This
  is also why the repo is 13 MB instead of 200 MB — and why GitHub accepts the push at all.
- espeak-ng, if you wire it up for English via `setEnglishG2P()`, is GPLv3 and is not bundled.
  Supplying one makes its licence your problem, not this repo's.

If you deploy this, the model still belongs to its authors: keep the attribution, and do not
present the voices as your own.

