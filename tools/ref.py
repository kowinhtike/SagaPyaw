"""Run the reference Python frontend over the corpus -> tools/expected.json.

Exceptions are recorded as {"error": "<Type>"} so the port is expected to fail
in exactly the same places.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from reference.english import to_tokens  # noqa: E402
from reference.my_numbers import verbalize  # noqa: E402
from reference.nara_frontend import phonemize, prepare_names  # noqa: E402

import sys as _sys
_corpus_name = _sys.argv[1] if len(_sys.argv) > 1 else "corpus.json"
_out_name = _sys.argv[2] if len(_sys.argv) > 2 else "expected.json"

corpus = json.loads((ROOT / "tools" / _corpus_name).read_text(encoding="utf-8"))

results = []
for text in corpus:
    try:
        results.append(phonemize(to_tokens(prepare_names(verbalize(text)))))
    except Exception as exc:  # noqa: BLE001 - the exact type is the signal
        results.append({"error": type(exc).__name__})

(ROOT / "tools" / _out_name).write_text(
    json.dumps(results, ensure_ascii=False, indent=0), encoding="utf-8"
)

errors = sum(1 for r in results if isinstance(r, dict))
print(f"{len(results)} cases, {errors} raised, rest ok -> tools/{_out_name}")
