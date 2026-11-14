# START HERE — VS Code မှာ စမ်းဖို့

> **AI agent တစ်ခုကို ခိုင်းမယ်ဆိုရင်** — `AGENTS.md` ကို အရင် ဖတ်ခိုင်းပါ။
> ဘာကို မဖျက်ရမလဲ (COOP/COEP header၊ G2P golden 11,854 case၊ cache အမည်၊
> iOS audio unlock၊ memory) အကုန် အဲဒီထဲမှာ ရှင်းထားတယ်။

ဒီ folder ကို ဖွင့်ပြီး **၃ မိနစ်** အတွင်း အသံ ထွက်အောင် လုပ်နိုင်ပါတယ်။

## ၁။ အမြန်ဆုံး လမ်း (npm install မလိုဘူး)

```sh
npm run serve
```

| မျက်နှာပြင် | လိပ်စာ | ဘာလုပ်လဲ |
|---|---|---|
| **App** | http://localhost:8100/ | တစ်ခုတည်းသော မျက်နှာပြင် — ရိုက် → အသံ + WAV ဒေါင်းလုပ် |
| G2P inspector | http://localhost:8100/web/dev/inspector.html | ကိရိယာ — စာသား → phoneme → token id |
| Bare demo | http://localhost:8100/web/dev/synth.html | ကိရိယာ — streaming မပါတဲ့ ရိုးရိုး demo |

> `dist/` နဲ့ `web/vendor/` ကို ကြိုတင် build ထားပြီးသားမို့ `node_modules` မလိုပါဘူး။
> `tools/serve.mjs` က Node built-in module ပဲ သုံးတယ်။

**VS Code မှာ** `Ctrl+Shift+B` (Mac: `Cmd+Shift+B`) → `serve` task ကို ရွေးလည်း ရပါတယ်။

⚠️ `python3 -m http.server` နဲ့ **မဖွင့်ပါနဲ့** — COOP/COEP header မပါလို့ multi-thread WASM မရဘဲ ၂ ဆ နှေးသွားမယ်။

## ၂။ အပြည့်အစုံ (build/test လုပ်ချင်ရင်)

```sh
npm install          # typescript, esbuild, onnxruntime-web, puppeteer-core
npm run check        # typecheck + build + G2P golden test (11,854 case)
npm run fuzz         # ကျပန်း 4,000 case ထပ်စစ်
npm run synth -- --text "မင်္ဂလာပါ။" --out out/demo.wav
npm run test:browser # headless Chromium နဲ့ တကယ် စမ်း
```

## ၃။ ဖိုင်တွေ ဘယ်မှာ ရှိလဲ

| လမ်း | အကြောင်းအရာ |
|---|---|
| `web/index.html` | **app** — တစ်ခုတည်းသော မျက်နှာပြင် |
| `web/dev/` | ကိရိယာတွေ (inspector၊ bare demo) — production bundle ထဲ မပါ |
| `web/player.js` | streaming အသံ ဖွင့်တဲ့ queue |
| `web/model-store.js` | Cache API (181 MB တစ်ခါပဲ ဒေါင်းလုပ်) |
| `web/sw.js` + `manifest.webmanifest` | PWA (ဖုန်းမှာ ထည့်၊ offline ရ) |
| `src/g2pMy.ts` | မြန်မာ G2P (Python ကနေ port) |
| `src/inference.ts` | ONNX inference + streaming |
| `models/shoon/` | encoder.onnx + decoder.onnx + voice.json (181 MB) |
| `out/*.wav` | နမူနာ ဖိုင်တွေ — နားထောင်ကြည့်ပါ |
| `reference/` | မူရင်း Python ကုဒ် (တိုက်စစ်ဖို့) |

## ၄။ ဖုန်းမှာ သုံးမယ် / တင်မယ်ဆိုရင်

```sh
npm run pack:split               # = pack --with-models --split 20
```

`site/` ထွက်လာမယ် (~193 MB၊ မော်ဒယ် ပါတယ်)။ **`--split 20` က အရေးကြီးတယ်** —
`decoder.onnx` က 107 MB ရှိလို့ Cloudflare Pages ရဲ့ **25 MiB per-file** limit ကို
ကျော်တယ်။ Split လုပ်ထားရင် —

- `decoder.onnx` → `decoder.onnx.p00 … p05` (၆ ပိုင်း) + `decoder.onnx.json` (manifest၊ sha256 ပါ)
- browser က ပိုင်းတွေကို ဆက်ဆွဲပြီး **တစ်ဖိုင်တည်း** ပြန်ပေါင်းတယ်၊ ပြီးရင် Cache API ထဲ
  မူရင်း URL အောက်မှာ သိမ်းတယ် — ဒုတိယအကြိမ် ဆွဲစရာ မလိုဘူး
- ဒါကြောင့် **မော်ဒယ်က app နဲ့ အတူတူ၊ domain တစ်ခုတည်း** ပေါ်မှာ ရှိတယ်

`site/` ကို Cloudflare Pages / Netlify / Vercel ကို တင်လိုက်ပါ။ **COOP/COEP header
ကို `_headers` နဲ့ `vercel.json` ထဲ ကြိုထည့်ထားပြီးသား** ပါ။ အဲဒီ header မပါရင်
thread ၁ ခုပဲ ရမယ် — ဖုန်းမှာ ကွက်ကျက်ဖြစ်တတ်တယ်။

| Host | ဒီ bundle တင်လို့ရလား |
|---|---|
| **Cloudflare Pages** | ✅ (`--split 20` နဲ့) · bandwidth unlimited |
| Netlify | ✅ (~100 GB/လ) |
| Vercel Hobby | ⚠️ ကုန်သွယ်ရေး မရ (personal only) |

ဖုန်းမှာ ဖွင့်ပြီးရင် —

- ပထမအကြိမ် **181 MB** ဒေါင်းလုပ်ရမယ် (progress ပြတယ်)
- ပြီးရင် "ဖုန်းမှာ ထည့်ပါ" နှိပ်လိုက်ရင် app အဖြစ် install ဖြစ်သွားမယ်၊ offline လည်း ရ
- ဒုတိယအကြိမ် ဝင်ရင် ဒေါင်းလုပ် 0 MB၊ ပြင်ဆင်ချိန် ~1.2s

### Git ကနေ တင်မယ်ဆိုရင် (Vercel / Netlify)

**`-slim` ကို သုံးရမယ်** — `-full` ကို git ထဲ push လုပ်လို့ **မရနိုင်ပါဘူး**။
`decoder.onnx` က 107 MB ဖြစ်လို့ GitHub ရဲ့ **100 MB per-file** တင်းကျပ်တဲ့
limit ကို ကျော်တယ် — push လုပ်တာနဲ့ ပယ်ခံရမယ်။

`-slim` က 13 MB ပဲ (dist + `web/vendor` ပါတယ်)၊ `models/` နဲ့ `site/` ကို
`.gitignore` က ချန်ထားပြီးသား။ မော်ဒယ်ကို **build အချိန်မှာ** ဆွဲတယ် —

```sh
npm run build:site
# = fetch_models (181 MB) → build (dist) → pack --with-models --split 20
```

Config နှစ်ခု repo root မှာ အဆင်သင့် ရှိပြီးသား —

| ဖိုင် | Host | သတ်မှတ်တာ |
|---|---|---|
| `netlify.toml` | Netlify | build command၊ `publish = "site"`၊ COOP/COEP၊ cache header |
| `vercel.json` | Vercel | အတူတူ (`buildCommand` + `outputDirectory`) |

ဒါကြောင့် repo ကို ချိတ်လိုက်ရုံပါ — dashboard မှာ ဘာမှ ရိုက်ထည့်စရာ မလိုဘူး။
Build က ၁–၃ မိနစ် ကြာမယ် (အများစုက မော်ဒယ် ဒေါင်းလုပ်ချိန်)။

⚠️ သတိထားရမယ် ၂ ချက် —

- **push တိုင်း 181 MB ပြန်ဆွဲတယ်** (Netlify/Vercel က `models/` ကို cache မလုပ်ဘူး)
- **bandwidth က တကယ့် ကုန်ကျစရိတ်** — ဝင်လာသူ တစ်ဦးကို 181 MB ပို့ရတယ်။
  Netlify free 100 GB/လ ≈ လူသစ် ၅၅၀ ဦးပဲ။ လူများလာရင် `site/` ကို
  **Cloudflare Pages** (bandwidth unlimited) ကို ရွှေ့ပါ —
  `npx wrangler pages deploy site`

## ၅။ အသံ ၄ မျိုး (လောလောဆယ် shoon ပဲ လိုအပ်ရင် ကျော်ပါ)

အသံ တစ်မျိုးစီဟာ encoder + decoder သီးခြား (181 MB) ဖြစ်လို့ မျှဝေလို့ မရပါဘူး။
ဒါပေမယ့် **ကုဒ် ပြင်စရာ မလိုပါဘူး** — folder အမည် ပြောင်းရုံပါ။

```sh
npm run fetch-models -- --voice htet-myat
npm run serve
# http://localhost:8100/web/index.html?voice=htet-myat
```

အသံ ၄ မျိုးလုံး: `shoon`, `htet-myat`, `ko-banyar`, `thazin` (`--all` နဲ့ အကုန်ဆွဲ၊ 725 MB)။

## ၆။ မော်ဒယ်ဖိုင် မပါရင်

```sh
npm run fetch-models     # Hugging Face ကနေ 181 MB ဆွဲမယ်
```

## ၇။ ပြဿနာ တက်ရင်

| လက္ခဏာ | အကြောင်း |
|---|---|
| စာမျက်နှာ လုံးဝ မပွင့် | `npm run serve` run နေရဲ့လား၊ port 8100 လွတ်ရဲ့လား |
| အသံ ထွက်ပေမယ့် ကွက်ကျက်တယ် | app က ဖုန်း/thread ၁ ခုဆိုရင် **file mode** ကို အလိုအလျောက် ရွေးတယ် (ကွက်မကျ)။ အတင်းရွေးချင်ရင် `?mode=file` သို့မဟုတ် `?mode=stream` |
| `threads 1` ပြနေတယ် | အထက်နဲ့ အတူတူ၊ header မရလို့ |
| ဖုန်းမှာ tab ပြန်လန့်တယ် | memory — အသံ တစ်မျိုးပဲ ဖွင့်ပါ၊ အခြား tab တွေ ပိတ်ပါ |
| `models/... 404` | `models/shoon/` ထဲ ဖိုင် ၃ ခု ရှိရဲ့လား စစ်ပါ |
| အင်္ဂလိပ်စာ မဖတ်ဘူး | ရည်ရွယ်ချက်ရှိရှိ ချန်ထားတာ — espeak-ng WASM မတပ်ရသေးဘူး |

## ၈။ လက်ရှိ အခြေအနေ

- ✅ မြန်မာစာ G2P — Python နဲ့ **100% ကိုက်** (11,854 case)
- ✅ ONNX inference — browser/Node နှစ်မျိုးလုံး
- ✅ **Streaming** — ပထမအသံ ~1s (warm)၊ ကျန်တာ နောက်က ဆက်ထွက်
- ✅ **Cache API** — 181 MB တစ်ခါပဲ၊ ဒုတိယအကြိမ် 0 MB
- ✅ **ဖုန်း** — worker proxy (UI မရပ်တန့်)၊ iOS audio unlock၊ PWA install၊ offline
- ✅ အသံ ၄ မျိုး — `models/<voice>/` ပြောင်းရုံ (shoon + htet-myat စမ်းပြီး)
- ⬜ အင်္ဂလိပ်စာ (espeak-ng WASM)
