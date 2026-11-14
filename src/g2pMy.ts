/**
 * Burmese grapheme-to-phoneme.
 *
 * Direct port of `reference/g2p_my.py` from YeeNyunn/nara-mini-v1 (Apache-2.0).
 * Every table lives in `tables.json`; this file only contains the control flow,
 * which is kept line-for-line parallel to the Python original so the two can be
 * diffed by eye.
 */
import * as D from './data';

export class SylParseError extends Error {
  constructor(readonly syllable: string) {
    super(`cannot parse syllable: ${syllable}`);
    this.name = 'SylParseError';
  }
}

/** Mirrors Python's KeyError, which `phonemize()` swallows. */
export class MissingKeyError extends Error {
  constructor(readonly key: string) {
    super(`missing key: ${key}`);
    this.name = 'MissingKeyError';
  }
}

const SYL_START = new RegExp('^[' + D.CONS + D.INDEP + ']');
const PARSE_SYLLABLE = new RegExp(D.PARSE_SYLLABLE_PATTERN);
const LATIN_START = /[A-Za-z]/;
const LATIN_BODY = /[A-Za-z']/;

const TONE_MID = '\u02e7'; // ˧
const TONE_HIGH = '\u02e5'; // ˥
const TONE_CREAKY = '\u02c0'; // ˀ

const VOWEL_AA = '\u102b'; // ါ
const VOWEL_AA_LONG = '\u102c'; // ာ

export function normalize(text: string): string {
  let s = text;
  for (const op of D.NORMALIZE_OPS) {
    if (op.op === 'replace') {
      s = s.split(op.from).join(op.to);
    } else if (op.op === 'indep') {
      for (const [a, b] of D.INDEP_TO_A) s = s.split(a).join(b);
    } else {
      s = s.replace(D.STACK, '$1' + D.ASAT);
    }
  }
  return s;
}

/**
 * Split into syllables. Iterates over code points (not UTF-16 units) so that the
 * boundaries match Python's indexing even when the input contains emoji.
 */
export function splitSyllables(text: string): string[] {
  const chars = Array.from(text);
  const out: string[] = [];
  let cur = '';
  let i = 0;
  const n = chars.length;
  while (i < n) {
    const ch = chars[i];
    if (SYL_START.test(ch)) {
      const isFinal = i + 1 < n && chars[i + 1] === D.ASAT;
      if (cur && !isFinal) {
        out.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
      i += 1;
    } else if (D.MEDIAL_CHARS.includes(ch)) {
      cur += ch;
      i += 1;
    } else {
      if (cur) {
        out.push(cur);
        cur = '';
      }
      if (LATIN_START.test(ch)) {
        let j = i + 1;
        while (j < n && LATIN_BODY.test(chars[j])) j += 1;
        out.push(chars.slice(i, j).join(''));
        i = j;
        continue;
      }
      out.push(ch);
      i += 1;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function finalClass(c: string): string | null {
  if (D.FINAL_CLASSES.F_K.includes(c)) return 'F_K';
  if (D.FINAL_CLASSES.F_S.includes(c)) return 'F_S';
  if (D.FINAL_CLASSES.F_T.includes(c)) return 'F_T';
  if (D.FINAL_CLASSES.F_N.includes(c)) return 'F_N';
  if (D.FINAL_CLASSES.F_NG.includes(c)) return 'F_NG';
  if (D.FINAL_CLASSES.F_NY.includes(c)) return 'F_NY';
  return null;
}

/** Returns a hyphen-joined syllable such as `k-a-˧`, or throws SylParseError. */
export function parseSyllable(s: string): string {
  const indep = D.INDEP_SYL.get(s);
  if (indep) return `${indep[0]}-${indep[1]}-${indep[2]}`;

  const m = PARSE_SYLLABLE.exec(s);
  if (!m) throw new SylParseError(s);

  const base = m[1];
  const meds = m[2];
  const vowsRaw = m[3];
  const fin = m[4];
  const anusvara = m[5];
  const dot1 = m[6];
  const visarga = m[7];
  const dot2 = m[8];
  const dot = dot1 || dot2;

  let onset = D.ONSET.get(base);
  if (onset === undefined) throw new MissingKeyError(base);
  let medial = '';

  if (meds.includes('\u103e')) {
    onset = D.ASPIRATE.get(onset) ?? onset;
  }
  if (meds.includes('\u103b') || meds.includes('\u103c')) {
    if (D.VELAR_PAL.has(onset)) {
      onset = D.VELAR_PAL.get(onset)!;
    } else if (onset === '\u014b') {
      onset = '\u0272';
    } else if (onset === '\u0283') {
      // already palatalised
    } else if (onset === 'j') {
      // y + y collapses
    } else {
      medial = 'j';
    }
  }
  let hasW = meds.includes('\u103d');
  const vows = vowsRaw.split(VOWEL_AA).join(VOWEL_AA_LONG);

  const vkey = Array.from(vows)
    .sort((a, b) => D.VOWEL_ORDER.indexOf(a) - D.VOWEL_ORDER.indexOf(b))
    .join('');

  let rhyme: string;
  let tone: string | null;

  if (fin || anusvara) {
    const fc = anusvara ? 'F_N' : finalClass(fin);
    if (fin && '\u101a'.includes(fin)) {
      rhyme = vkey === '\u102d\u102f' ? 'o' : '\u025b';
      tone = TONE_MID;
    } else if (fin && '\u101c\u101f'.includes(fin)) {
      const v = D.V.get(vkey);
      if (!v) throw new SylParseError(s);
      rhyme = v[0];
      tone = TONE_MID;
    } else if (fin && fin === '\u100a') {
      rhyme = vkey === '\u1031' ? '\u025b' : 'e';
      tone = TONE_MID;
    } else if (fc) {
      const wkey =
        hasW && D.RHYME_CLOSED.has(`\u103d\u0000${fc}`) && !vkey ? '\u103d' : vkey;
      if (wkey === '\u103d') hasW = false;
      const r = D.RHYME_CLOSED.get(`${wkey}\u0000${fc}`);
      if (r === undefined) throw new SylParseError(s);
      rhyme = r;
      if (base === '\u101d' && !vkey) {
        rhyme = rhyme === 'a\u0294' ? '\u028a\u0294' : rhyme === 'a\u0274' ? '\u028a\u0274' : rhyme;
      }
      tone = rhyme.endsWith('\u0294') ? null : TONE_MID;
    } else {
      throw new SylParseError(s);
    }
  } else {
    const v = D.V.get(vkey);
    if (!v) throw new SylParseError(s);
    rhyme = v[0];
    tone = v[1];
  }

  if (tone !== null) {
    if (visarga) tone = TONE_HIGH;
    else if (dot) tone = TONE_CREAKY;
  }

  const parts: string[] = [onset];
  if (hasW) medial = medial ? medial + 'w' : 'w';
  if (medial) parts.push(medial);
  parts.push(rhyme);
  if (tone) parts.push(tone);
  return parts.join('-');
}

export type Lexicon = Map<string, string>;
export type Mined = { voicing: Set<string>; schwa: Set<string> };

const pairKey = (ctx: string, syl: string) => `${ctx}\u0000${syl}`;

export function loadLexicon(tsv: string = D.LEXICON_TSV): Lexicon {
  const lex: Lexicon = new Map();
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const [k0, v] = line.split('\t');
    if (v === undefined) continue;
    let k = normalize(k0);
    for (const e of D.E001_REPLACEMENTS) k = k.split(e).join(D.E001);
    lex.set(k, v);
  }
  return lex;
}

export function loadMined(tsv: string = D.MINED_TSV): Mined {
  const voicing = new Set<string>();
  const schwa = new Set<string>();
  for (const line of tsv.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const [kind, ctx, syl] = line.split('\t');
    if (syl === undefined) continue;
    (kind === 'voicing' ? voicing : schwa).add(pairKey(ctx, syl));
  }
  return { voicing, schwa };
}

function titReduces(chunk: string[], i: number): boolean {
  const nxt = chunk[i + 1];
  if (D.CLASSIFIERS.has(nxt)) return true;
  if (i > 0) {
    const big = [chunk[i - 1], chunk[i]].join('\u0000');
    if ([chunk[i + 1], chunk[i + 2]].join('\u0000') === big) return false;
    if (i >= 3 && [chunk[i - 3], chunk[i - 2]].join('\u0000') === big) return false;
    if (chunk[i - 1] === nxt) return false;
  }
  return true;
}

function applyMined(chunk: string[], parses: Array<string | null>, mined: Mined): Array<string | null> {
  const out = parses.slice();
  for (let i = 0; i < chunk.length; i += 1) {
    const syl = chunk[i];
    const p = out[i];
    if (p === null) continue;
    const parts = p.split('-');
    if (syl === '\u1010\u1005\u103a' && i + 1 < chunk.length && titReduces(chunk, i)) {
      out[i] = 't-\u0259';
      continue;
    }
    if (i > 0 && mined.voicing.has(pairKey(chunk[i - 1], syl)) && D.VOICE_MAP.has(parts[0])) {
      parts[0] = D.VOICE_MAP.get(parts[0])!;
      out[i] = parts.join('-');
    }
    if (i + 1 < chunk.length && mined.schwa.has(pairKey(chunk[i + 1], syl))) {
      out[i] = parts[0] + '-\u0259';
    }
  }
  return out;
}

export interface G2PResult {
  phon: string;
  errors: string[];
}

export function g2p(text: string, lex?: Lexicon, mined?: Mined): G2PResult {
  const lexicon = lex ?? loadLexicon();
  const rules = mined ?? loadMined();

  let s = normalize(text);
  for (const e of D.E001_REPLACEMENTS) s = s.split(e).join(D.E001);

  const out: string[] = [];
  const errors: string[] = [];
  const keys = Array.from(lexicon.keys())
    .map((k) => ({ k, cps: Array.from(k) }))
    .sort((a, b) => b.cps.length - a.cps.length);

  const chars = Array.from(s);
  const chunks: Array<['PHON', string] | ['RAW', string]> = [];
  let i = 0;
  const n = chars.length;
  while (i < n) {
    let hit: { k: string; cps: string[] } | null = null;
    for (const entry of keys) {
      const kc = entry.cps;
      if (i + kc.length > n) continue;
      let match = true;
      for (let x = 0; x < kc.length; x += 1) {
        if (chars[i + x] !== kc[x]) {
          match = false;
          break;
        }
      }
      if (!match) continue;
      const j = i + kc.length;
      if (j < n && D.MIDSYL.has(chars[j])) continue;
      hit = entry;
      break;
    }
    if (hit) {
      chunks.push(['PHON', lexicon.get(hit.k)!]);
      i += hit.cps.length;
    } else {
      chunks.push(['RAW', chars[i]]);
      i += 1;
    }
  }

  const flush = (buf: string): void => {
    const syls = splitSyllables(buf);
    let runsyl: string[] = [];

    const closeRun = (): void => {
      if (!runsyl.length) return;
      const parses: Array<string | null> = [];
      for (const syl of runsyl) {
        try {
          if (syl === D.E001) {
            parses.push('\u0294-\u0254-' + TONE_MID);
          } else if (syl.includes(D.E001)) {
            const p = parseSyllable(syl.split(D.E001).join('\u1031\u102c'));
            parses.push(p.replace(/\u0254-\u02e5$/, '\u0254-' + TONE_MID));
          } else {
            parses.push(parseSyllable(syl));
          }
        } catch (err) {
          if (err instanceof SylParseError || err instanceof MissingKeyError) {
            parses.push(null);
            errors.push(syl);
          } else {
            throw err;
          }
        }
      }
      for (const p of applyMined(runsyl, parses, rules)) {
        if (p !== null) out.push(p);
      }
      runsyl = [];
    };

    for (const syl of syls) {
      if (SYL_START.test(syl) || syl.includes(D.E001)) {
        runsyl.push(syl);
      } else {
        closeRun();
        const p = D.PUNCT.get(syl);
        if (p !== undefined) out.push(p);
        else if (syl.trim()) out.push(syl);
        else out.push(' ');
      }
    }
    closeRun();
  };

  let buf = '';
  for (const [kind, val] of chunks) {
    if (kind === 'RAW') {
      buf += val;
    } else {
      if (buf) {
        flush(buf);
        buf = '';
      }
      out.push(val);
    }
  }
  if (buf) flush(buf);

  const isEn = (tok: string): boolean => !tok.includes('-') && /[A-Za-z\u00e6\u00f0\u03b8\u014b\u0292\u0250-\u02ef\u1d7b\u02c8\u02cc\u02d0]/.test(tok);

  const merged: string[] = [];
  for (let idx = 0; idx < out.length; idx += 1) {
    const tok = out[idx];
    if (tok === ' ') {
      let nxt: string | null = null;
      for (let k = idx + 1; k < out.length; k += 1) {
        if (out[k] !== ' ') {
          nxt = out[k];
          break;
        }
      }
      if (
        merged.length &&
        ![',', '.', '?', '!'].includes(merged[merged.length - 1]) &&
        !isEn(merged[merged.length - 1]) &&
        (nxt === null || !isEn(nxt))
      ) {
        merged.push(',');
      }
    } else if (['.', '?', '!', ','].includes(tok)) {
      if (merged.length && merged[merged.length - 1] === ',') {
        merged[merged.length - 1] = tok;
      } else if (merged.length && ['.', '?', '!'].includes(merged[merged.length - 1])) {
        if (tok !== merged[merged.length - 1]) merged.push(tok);
      } else {
        merged.push(tok);
      }
    } else {
      merged.push(tok);
    }
  }
  while (merged.length && merged[merged.length - 1] === ',') merged.pop();
  while (merged.length && [',', '.', '?', '!'].includes(merged[0])) merged.shift();

  return { phon: merged.join(' '), errors };
}
