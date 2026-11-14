"""Build the golden corpus used to prove the TypeScript port matches Python.

Coverage is generated, not hand-listed, wherever possible: consonants, vowels and
finals come from the same tables the port ships, so no test can drift from the
implementation by a typo.

    python3 tools/gen_corpus.py
"""
import json
import random
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from reference.nara_names import replace_names  # noqa: E402
TABLES = json.loads((ROOT / "src" / "data" / "tables.json").read_text(encoding="utf-8"))

CONSONANTS = list(TABLES["ONSET"].keys())
VOWELS = list(TABLES["V"].keys())
FINALS = ["", "က်", "စ်", "တ်", "န်", "င်", "ည်", "ယ်", "လ်", "ဟ်"]
MEDIALS = ["", "ျ", "ြ", "ွ", "ှ", "ျွ", "ြွ", "ွှ"]

corpus: list[str] = []


def add(items):
    for item in items:
        if item and item not in seen:
            seen.add(item)
            corpus.append(item)


seen: set[str] = set()

# 1. Every consonant x vowel x final, as a bare syllable.
add(c + v + f for c in CONSONANTS for v in VOWELS for f in FINALS)

# 2. Medials (palatalisation, labialisation, aspiration) on a sample of bases.
random.seed(7)
bases = random.sample(CONSONANTS, 18)
add(b + m + v + f for b in bases for m in MEDIALS for v in ["", "ာ", "ို", "ေ"] for f in ["", "က်", "န်"])

# 3. Independent vowels, kinzi, stacked consonants, rare signs.
add(["ဣ", "ဤ", "ဥ", "ဦ", "ဧ", "ဩ", "ဪ", "ဿ", "၎င်း", "၌", "၍", "၏",
     "သင်္ချာ", "မင်္ဂလာပါ", "အင်္ဂလိပ်", "က္က", "ဗုဒ္ဓ", "သတ္တိ", "ပညာ",
     "ကျွန်ုပ်", "နှစ်သစ်", "ရွှေ", "ခြေ", "မြေ", "ငါ", "သူ", "မီး", "ရေ"])

# 4. Tone / dot / visarga permutations on one base.
add(["က", "ကာ", "ကား", "ကာ်", "ကိ", "ကိ့", "ကို့", "ကော", "ကော်", "ကော့",
     "ကို", "ကိုး", "ကွယ်", "ကျော်", "ကြော်", "ခြင်း", "သွား", "လာ", "မယ်"])

# 5. Real sentences (grammar not important - both sides see identical input).
SENTENCES = [
    "မင်္ဂလာပါ။",
    "ဒီနေ့ ရာသီဥတု ကောင်းတယ်။",
    "ကျွန်တော်တို့ဟာ ဒီမော်ဒယ်ကို ဘရောက်ဇာမှာ run လုပ်နိုင်မလား ဆွေးနွေးကြည့်ရအောင်။",
    "မြန်မာစာ အသံထွက်ကို စမ်းသပ်နေပါတယ်။",
    "ဈေးကို သွားမယ်၊ ပြီးတော့ အိမ်ပြန်မယ်။",
    "သူက စာအုပ်တွေ အများကြီး ဖတ်တယ်။",
    "ရန်ကုန်မြို့မှာ မိုးရွာနေတယ်။",
    "ဒါက ဘယ်လောက်လဲ။",
    "မနက်ဖြန် ပြန်လာခဲ့ပါ။",
    "ကျွန်မနာမည် မေသဇင်ပါ။",
    "အတန်းထဲမှာ ကျောင်းသား သုံးဆယ်ရှိတယ်။",
    "ဒီစာအုပ်က အရမ်းကောင်းတယ်၊ ဖတ်ကြည့်ပါ။",
    "အစားအသောက် စားပြီးလား။",
    "ငါ မနေနိုင်ဘူး၊ အိပ်ရမယ်။",
    "သူမက ကျောင်းမှာ ပထမဆုံး ရခဲ့တယ်။",
    "ရေခဲသေတ္တာထဲမှာ ဘာရှိလဲ။",
    "ဒီအလုပ်က အချိန်အများကြီး ယူတယ်။",
    "မြန်မာနိုင်ငံမှာ ဘာသာစကား အများကြီး ပြောကြတယ်။",
    "ကလေးတွေ ကစားနေကြတယ်။",
    "ဆရာက စာသင်ပေးတယ်။",
    "ငါ့ကို ကူညီပါ။",
    "ဒီကိစ္စကို မနက်ဖြန် ဆွေးနွေးရအောင်။",
    "သူ ဘယ်တော့ ပြန်လာမလဲ။",
    "အိမ်မှာ ဘယ်သူမှ မရှိဘူး။",
    "ဒါက အရေးကြီးတဲ့ ကိစ္စပါ။",
    "ကွန်ပျူတာကို ပြင်ဖို့ လိုတယ်။",
    "မိုးရွာလို့ မသွားတော့ဘူး။",
    "သူတို့ အတူတူ အလုပ်လုပ်ကြတယ်။",
    "ကျေးဇူးတင်ပါတယ်။",
    "တစ်ခုခု မေးချင်တယ်။",
    "ဒီနေ့ ဘယ်နှစ်ရက်လဲ။",
    "ကျွန်တော် သွားတော့မယ်။",
    "မြန်မာစာကို ချစ်တယ်။",
]
add(SENTENCES)

# 6. Punctuation and whitespace handling.
add(["ဟုတ်ကဲ့ ။", "ဟုတ်ကဲ့။ ကောင်းတယ်။", "အင်း ၊ ဟုတ်တယ်",
     "  စာသား  ", "\tစာသား\t", "စာ\nသား", "အများ  ကြီး", "ဘာ? ဘယ်! ဘယ်တော့.",
     "\u200bမင်္ဂလာပါ\u200b", "\ufeffမင်္ဂလာပါ", "မင်္ဂလာပါ 😀", "😀 မင်္ဂလာပါ"])

# 7. Numbers, percentages, currency, Burmese digits.
NUMS = ["0", "1", "7", "10", "11", "21", "100", "101", "999", "1000", "1001",
        "10000", "100000", "123456", "1000000", "1234567", "9999999999", "007",
        "0123", "3.14", "0.5", "1,234,567", "12,000", "5%", "50 %", "100 Kyats",
        "2k", "15k", "၁၂၃", "၁၀၀၀", "၁၂၃၄၅", "၀", "၉၉၉"]
add([f"ဈေးနှုန်း {n} ကျပ်" for n in NUMS])
add([f"{n} ခု" for n in NUMS])
add([f"အခန်း {n}၊ စာမျက်နှာ {n}။" for n in ["1", "12", "100", "၂၅"]])
add(["၁၀၀ ကျပ်၊ ၂၀၀ ကျပ်", "တစ်ရာ ၁၀၀", "၀ မှ ၉ အထိ"])

# 8. Lexicon entries, standalone and in context.
LEX_PATH = ROOT / "reference" / "lexicon_exceptions.tsv"
lex_keys = []
for line in LEX_PATH.read_text(encoding="utf-8").splitlines():
    if not line or line.startswith("#"):
        continue
    lex_keys.append(line.split("\t")[0])
add(lex_keys)
add([f"{k} ကို ပြောပါ။" for k in lex_keys])
add([f"ဒါက {k} ပါ။" for k in lex_keys])

# 9. Mined-rule contexts: (context, syllable) pairs drive voicing and schwa.
MINED_PATH = ROOT / "reference" / "mined_rules.tsv"
pairs = []
for line in MINED_PATH.read_text(encoding="utf-8").splitlines():
    if not line or line.startswith("#"):
        continue
    _, ctx, syl = line.split("\t")[:3]
    pairs.append((ctx, syl))
add([ctx + syl for ctx, syl in pairs])
add([syl + ctx for ctx, syl in pairs])
add([f"{ctx}{syl} ပါ" for ctx, syl in pairs[:200]])

# 10. Names (NAME_MAP is applied before English phonemisation, so no espeak needed).
add(["U Aung Myat", "Daw Thida", "Ko Banyar", "Ma Hnin", "U Tun Win",
     "Daw Khin Mya", "Ko Zaw Lin", "Ma Su Su", "U Htet Naing", "Daw Nwe Nwe"])

# English phonemisation needs misaki + espeak-ng, which is out of scope for phase 1.
# Anything still Latin after name replacement would diverge, so drop it.
before = len(corpus)
corpus = [t for t in corpus if not re.search("[A-Za-z]", replace_names(t))]
print(f"dropped {before - len(corpus)} cases that need English G2P")

out = ROOT / "tools" / "corpus.json"
out.write_text(json.dumps(corpus, ensure_ascii=False, indent=0), encoding="utf-8")
print(f"{len(corpus)} cases -> {out}")
