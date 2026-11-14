"""Compare the TypeScript pipeline's audio against the Python reference, sample by sample.

The Python side is an in-process copy of `synthesize.py` (the released script is
written as a CLI and hardcodes a `frontend` package layout); the TypeScript side
runs through `tools/synthesize.mjs`, i.e. the same WASM path the browser uses.

    python3 tools/verify_audio.py
"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from reference.english import to_tokens  # noqa: E402
from reference.my_numbers import verbalize  # noqa: E402
from reference.nara_frontend import phonemize, prepare_names  # noqa: E402

MODEL = ROOT / "models" / "shoon"
META = json.loads((MODEL / "voice.json").read_text(encoding="utf-8"))

ENC = ort.InferenceSession(str(MODEL / "encoder.onnx"), providers=["CPUExecutionProvider"])
DEC = ort.InferenceSession(str(MODEL / "decoder.onnx"), providers=["CPUExecutionProvider"])


def split_speech(text, limit=200):
    import re

    units = []
    for sentence in re.split(r"(?<=[။!?…\n])\s*", text):
        for clause in re.split(r"(?<=၊)\s*", sentence):
            while len(clause) > limit:
                cut = clause.rfind(" ", 0, limit)
                if cut <= 0:
                    cut = limit
                units.append(clause[:cut])
                clause = clause[cut:].strip()
            if clause.strip():
                units.append(clause.strip())
    pieces, current = [], ""
    for unit in units:
        if current and len(current) + 1 + len(unit) > limit:
            pieces.append(current)
            current = unit
        else:
            current = f"{current} {unit}".strip()
    if current:
        pieces.append(current)
    return pieces


def py_synthesize(text):
    text = verbalize(text)
    audio = []
    for piece in split_speech(text):
        chars = phonemize(to_tokens(prepare_names(piece)))
        tokens = [META["vocab"][c] for c in chars if c in META["vocab"]]
        index = int(np.argmin(np.abs(np.asarray(META["centers"]) - len(tokens))))
        style = np.asarray([META["styles"][index]], dtype=np.float32)
        durations, prosody, encoded = ENC.run(
            ["durations", "prosody", "text"],
            {"tokens": np.asarray([[0, *tokens, 0]], dtype=np.int64), "style": style},
        )
        samples = DEC.run(None, {
            "prosody": np.repeat(prosody, durations[0], axis=2),
            "text": np.repeat(encoded, durations[0], axis=2),
            "style": style,
        })[0].reshape(-1)
        if audio:
            audio.append(np.zeros(4800, dtype=np.float32))
        audio.append(samples)
    return np.clip(np.concatenate(audio), -1, 1)


def read_wav(path):
    with wave.open(str(path), "rb") as w:
        frames = w.readframes(w.getnframes())
    return np.frombuffer(frames, dtype="<i2").astype(np.float32) / 32768.0


SENTENCES = [
    "မင်္ဂလာပါ။",
    "ဒီနေ့ ရာသီဥတု ကောင်းတယ်။",
    "ဈေးနှုန်း 1,234 ကျပ် ပါ။ ငါးရာခိုင်နှုန်း လျှော့ပေးပါ။",
    "ကျွန်တော်တို့ဟာ ဒီမော်ဒယ်ကို ဘရောက်ဇာမှာ ဆွေးနွေးကြည့်ရအောင်။",
    "သင်္ချာ၊ ရူပဗေဒ၊ ဓာတုဗေဒ — သုံးခုစလုံး ခက်တယ်။",
    "မနက်ဖြန် ပြန်လာခဲ့ပါ။ ကျေးဇူးတင်ပါတယ်။",
]

rows = []
with tempfile.TemporaryDirectory() as tmp:
    for i, text in enumerate(SENTENCES):
        py = py_synthesize(text)
        out = Path(tmp) / f"{i}.wav"
        subprocess.run(
            ["node", "tools/synthesize.mjs", "--text", text, "--out", str(out), "--quiet"],
            cwd=ROOT, check=True,
        )
        js = read_wav(out)
        n = min(py.size, js.size)
        diff = py[:n] - js[:n]
        snr = 20 * np.log10(np.sqrt((py[:n] ** 2).mean()) / np.sqrt((diff ** 2).mean()))
        rows.append({
            "text": text,
            "py": py.size,
            "js": js.size,
            "same_length": py.size == js.size,
            "corr": float(np.corrcoef(py[:n], js[:n])[0, 1]),
            "max": float(np.abs(diff).max()),
            "snr": float(snr),
        })

print(f"{'samples':>9} {'samples':>9} {'len':>4} {'corr':>9} {'max|d|':>8} {'SNR':>7}  text")
for r in rows:
    print(f"{r['py']:9d} {r['js']:9d} {'ok' if r['same_length'] else 'DIFF':>4} "
          f"{r['corr']:9.6f} {r['max']:8.4f} {r['snr']:6.1f}dB  {r['text'][:34]}")

ok = all(r["same_length"] for r in rows) and all(r["corr"] > 0.99 for r in rows)
print("\nall lengths identical and correlation > 0.99" if ok else "\nMISMATCH")
sys.exit(0 if ok else 1)
