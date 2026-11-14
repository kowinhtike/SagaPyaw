/**
 * Data layer: every Burmese/Unicode table is imported verbatim from `tables.json`,
 * which is generated from the reference Python implementation by
 * `tools/export_data.py`. Nothing in this file was retyped by hand.
 */
import tablesJson from './data/tables.json';
import lexiconTsvRaw from './data/lexicon_exceptions.tsv';
import minedTsvRaw from './data/mined_rules.tsv';

type StrMap = Record<string, string>;
type TupleMap = Record<string, string[]>;

interface Tables {
  constants: {
    KINZI: string;
    INDEP_TO_A: string[][];
    CONS: string;
    INDEP: string;
    ASAT: string;
    F_K: string;
    F_S: string;
    F_T: string;
    F_N: string;
    F_NG: string;
    F_NY: string;
    VOWEL_OR_FINAL: string;
    TONES: string[];
    MIDSYL: string;
    MEDIAL_CHARS: string;
    VOWEL_ORDER: string;
    NORMALIZE_OPS: NormalizeOp[];
    E001_REPLACEMENTS: string[];
    E001: string;
    PARSE_SYLLABLE_PATTERN: string;
  };
  NUMBER_LITERALS: { lakh: string; decimal: string; percent: string; kyat: string };
  ONSET: StrMap;
  VELAR_PAL: StrMap;
  ASPIRATE: StrMap;
  INDEP_SYL: TupleMap;
  V: TupleMap;
  RHYME_CLOSED: string[][];
  PUNCT: StrMap;
  VOICE_MAP: StrMap;
  CLASSIFIERS: string[];
  CHAR: StrMap;
  RHYME_SPLIT: TupleMap;
  NAME_MAP: StrMap;
  AMBIG: string[];
  DIGITS: string[];
  PLACES: StrMap;
  CREAKY: StrMap;
}

export type NormalizeOp =
  | { op: 'replace'; from: string; to: string }
  | { op: 'indep' }
  | { op: 'stack' };

const T = tablesJson as unknown as Tables;
const C = T.constants;

export const KINZI = C.KINZI;
export const CONS = C.CONS;
export const INDEP = C.INDEP;
export const ASAT = C.ASAT;
export const INDEP_TO_A: ReadonlyArray<readonly [string, string]> = C.INDEP_TO_A.map(
  (p) => [p[0], p[1]] as const,
);
export const NORMALIZE_OPS = C.NORMALIZE_OPS;
export const E001 = C.E001;
export const E001_REPLACEMENTS = C.E001_REPLACEMENTS;
export const PARSE_SYLLABLE_PATTERN = C.PARSE_SYLLABLE_PATTERN;
export const NUMBER_LITERALS = T.NUMBER_LITERALS;
export const MEDIAL_CHARS = C.MEDIAL_CHARS;
export const MIDSYL = new Set<string>(Array.from(C.MIDSYL));
export const VOWEL_ORDER = C.VOWEL_ORDER;
export const VOWEL_OR_FINAL = new Set<string>(Array.from(C.VOWEL_OR_FINAL));
export const TONES = new Set<string>(C.TONES);
export const FINAL_CLASSES = {
  F_K: C.F_K,
  F_S: C.F_S,
  F_T: C.F_T,
  F_N: C.F_N,
  F_NG: C.F_NG,
  F_NY: C.F_NY,
};

export const ONSET = new Map<string, string>(Object.entries(T.ONSET));
export const VELAR_PAL = new Map<string, string>(Object.entries(T.VELAR_PAL));
export const ASPIRATE = new Map<string, string>(Object.entries(T.ASPIRATE));
export const INDEP_SYL = new Map<string, readonly string[]>(Object.entries(T.INDEP_SYL));
export const V = new Map<string, readonly string[]>(Object.entries(T.V));
export const PUNCT = new Map<string, string>(Object.entries(T.PUNCT));
export const VOICE_MAP = new Map<string, string>(Object.entries(T.VOICE_MAP));
export const CLASSIFIERS = new Set<string>(T.CLASSIFIERS);
export const CHAR = new Map<string, string>(Object.entries(T.CHAR));
export const RHYME_SPLIT = new Map<string, readonly string[]>(Object.entries(T.RHYME_SPLIT));
export const NAME_MAP = new Map<string, string>(Object.entries(T.NAME_MAP));
export const AMBIG = new Set<string>(T.AMBIG);
export const DIGITS = T.DIGITS;
export const PLACES = new Map<number, string>(
  Object.entries(T.PLACES).map(([k, v]) => [Number(k), v]),
);
export const CREAKY = new Map<string, string>(Object.entries(T.CREAKY));

/** RHYME_CLOSED is keyed by (vowel-key, final-class) -> rhyme. */
export const RHYME_CLOSED = new Map<string, string>(
  T.RHYME_CLOSED.map(([vkey, fc, rhyme]) => [`${vkey}\u0000${fc}`, rhyme]),
);

/** Stacked consonant: a base consonant followed by U+1039 (virama). */
export const STACK = /([\u1000-\u1021])\u1039/g;

export const LEXICON_TSV: string = lexiconTsvRaw;
export const MINED_TSV: string = minedTsvRaw;
