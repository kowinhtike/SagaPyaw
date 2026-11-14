"""Random Burmese strings, to catch divergence the structured corpus misses.

    python3 tools/gen_fuzz.py && python3 tools/ref.py fuzz_corpus.json fuzz_expected.json \
        && node tools/golden.mjs fuzz_corpus.json fuzz_expected.json
"""
import json
import random
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from reference.nara_names import replace_names  # noqa: E402

CONSONANTS = [chr(c) for c in range(0x1000, 0x1022)]
INDEPENDENT = list("ဣဤဥဦဧဩဪ")
MEDIALS = list("ျြွှ")
VOWELS = list("ါာိီုူေဲံ့း")
FINALS = list("ကစတနငညယလဟပမ")
PUNCT = list("၊။!?., ")
DIGITS = list("၀၁၂၃၄၅၆၇၈၉")
MISC = ["\u200b", "\u1039", "\u103a", "\ue001", "၌", "၍", "၏", "၎င်း", "ဿ"]

alphabet = CONSONANTS * 4 + INDEPENDENT + MEDIALS * 3 + VOWELS * 3 + FINALS * 3 + PUNCT * 2 + DIGITS + MISC

random.seed(2024)
corpus = []
for _ in range(4000):
    length = random.randint(1, 40)
    corpus.append("".join(random.choice(alphabet) for _ in range(length)))

corpus = [t for t in corpus if not re.search("[A-Za-z]", replace_names(t))]

(ROOT / "tools" / "fuzz_corpus.json").write_text(
    json.dumps(corpus, ensure_ascii=False, indent=0), encoding="utf-8"
)
print(f"{len(corpus)} random cases -> tools/fuzz_corpus.json")
