"""Export every Burmese/Unicode table from the reference implementation to JSON.

Hand-retyping ~200 Burmese strings would be error-prone, so the TypeScript port
imports these tables verbatim instead of declaring them itself. Run this after
touching anything in `reference/`.

    python3 tools/export_data.py
"""
import ast
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from reference import g2p_my, char_map, nara_names, my_numbers  # noqa: E402

SRC = (ROOT / "reference" / "g2p_my.py").read_text(encoding="utf-8")
NUM_SRC = (ROOT / "reference" / "my_numbers.py").read_text(encoding="utf-8")


def literal(raw: str) -> str:
    """Decode a Python string literal body (keeps \\uXXXX escapes meaningful)."""
    return ast.literal_eval("'" + raw + "'")


def grab(pattern: str, source: str = SRC) -> str:
    m = re.search(pattern, source)
    if not m:
        raise SystemExit(f"pattern not found: {pattern}")
    return literal(m.group(1))


def normalize_ops():
    """Replay normalize() as an ordered op list, so the port cannot reorder steps."""
    body = SRC.split("def normalize(")[1].split("\ndef ")[0]
    ops = []
    for line in body.splitlines():
        if "INDEP_TO_A" in line and "for" in line:
            ops.append({"op": "indep"})
        elif "STACK.sub" in line:
            ops.append({"op": "stack"})
        else:
            for m in re.finditer(r"\.replace\((?:'([^']*)'|([A-Za-z_]\w*)),\s*'([^']*)'\)", line):
                lit, ident, to = m.groups()
                src = literal(lit) if lit is not None else {"KINZI": g2p_my.KINZI}[ident]
                ops.append({"op": "replace", "from": src, "to": literal(to)})
    return ops


def parse_syllable_pattern() -> str:
    """The syllable regex is built by concatenation; evaluate it and ship the result."""
    line = next(l for l in SRC.splitlines() if "m = re.match" in l)
    expr = line.split("re.match(")[1].rsplit(", s)", 1)[0]
    return eval(expr, vars(g2p_my))  # noqa: S307 - trusted local source


def number_literals():
    """Pull the Burmese number words straight out of my_numbers.py."""

    def lit(keyword: str, pattern: str, offset: int = 0) -> str:
        lines = NUM_SRC.splitlines()
        for i, line in enumerate(lines):
            if keyword in line:
                m = re.search(pattern, lines[i + offset])
                if m:
                    return literal(m.group(1))
        raise SystemExit(f"literal not found for {keyword}")

    return {
        "lakh": lit("number_words(lakhs)", r"\+ '([^']*)'"),
        "decimal": lit("_digit_by_digit(frac", r"= '([^']*)' \+"),
        "percent": lit("m.group('pct')", r"'([^']*)'$", offset=1),
        "kyat": lit("m.group('cur')", r"'([^']*)'$", offset=1),
    }


out = {
    "NUMBER_LITERALS": number_literals(),
    "constants": {
        "KINZI": g2p_my.KINZI,
        "INDEP_TO_A": [list(p) for p in g2p_my.INDEP_TO_A],
        "CONS": g2p_my.CONS,
        "INDEP": g2p_my.INDEP,
        "ASAT": g2p_my.ASAT,
        "F_K": g2p_my.F_K,
        "F_S": g2p_my.F_S,
        "F_T": g2p_my.F_T,
        "F_N": g2p_my.F_N,
        "F_NG": g2p_my.F_NG,
        "F_NY": g2p_my.F_NY,
        "VOWEL_OR_FINAL": "".join(sorted(g2p_my._VOWEL_OR_FINAL)),
        "TONES": sorted(g2p_my._TONES),
        "MIDSYL": "".join(sorted(grab(r"_MIDSYL = set\('([^']*)'\)"))),
        "MEDIAL_CHARS": grab(r"elif ch in '([^']*)'"),
        "VOWEL_ORDER": grab(r"sorted\(vows, key='([^']*)'\.find\)"),
        "NORMALIZE_OPS": normalize_ops(),
        "E001_REPLACEMENTS": ["ော်", "ေါ်"],
        "E001": "\ue001",
        "PARSE_SYLLABLE_PATTERN": parse_syllable_pattern(),
    },
    "ONSET": g2p_my.ONSET,
    "VELAR_PAL": g2p_my.VELAR_PAL,
    "ASPIRATE": g2p_my.ASPIRATE,
    "INDEP_SYL": {k: list(v) for k, v in g2p_my.INDEP_SYL.items()},
    "V": {k: list(v) for k, v in g2p_my.V.items()},
    "RHYME_CLOSED": [[k[0], k[1], v] for k, v in g2p_my.RHYME_CLOSED.items()],
    "PUNCT": g2p_my.PUNCT,
    "VOICE_MAP": g2p_my.VOICE_MAP,
    "CLASSIFIERS": sorted(g2p_my.CLASSIFIERS),
    "CHAR": char_map.CHAR,
    "RHYME_SPLIT": {k: list(v) for k, v in char_map.RHYME_SPLIT.items()},
    "NAME_MAP": nara_names.NAME_MAP,
    "AMBIG": sorted(nara_names.AMBIG),
    "DIGITS": my_numbers.DIGITS,
    "PLACES": {str(k): v for k, v in my_numbers.PLACES.items()},
    "CREAKY": my_numbers.CREAKY,
}

dest = ROOT / "src" / "data" / "tables.json"
dest.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"wrote {dest} ({dest.stat().st_size} bytes)")
