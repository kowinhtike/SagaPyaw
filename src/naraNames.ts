/**
 * Romanised Burmese name handling. Port of `reference/nara_names.py`.
 * Names are matched on their Latin spelling and replaced by pre-phonemised text.
 */
import * as D from './data';

const PY_WORD = '[\\p{L}\\p{N}_]';
const PY_B = `(?:(?<=${PY_WORD})(?!${PY_WORD})|(?<!${PY_WORD})(?=${PY_WORD}))`;

const NAME_WORD = new RegExp(`${PY_B}[A-Z][a-z]+${PY_B}|${PY_B}U${PY_B}`, 'gu');

export function replaceNames(text: string): string {
  const words = Array.from(text.matchAll(NAME_WORD));
  const keep = new Set<number>();

  for (let i = 0; i < words.length; i += 1) {
    const m = words[i];
    const w = m[0].toLowerCase();
    if (!D.NAME_MAP.has(w)) continue;
    if (D.AMBIG.has(w)) {
      const prev = words[i - 1];
      const next = words[i + 1];
      const prevOk =
        prev !== undefined &&
        D.NAME_MAP.has(prev[0].toLowerCase()) &&
        text.slice((prev.index ?? 0) + prev[0].length, m.index).trim() === '';
      const nextOk =
        next !== undefined &&
        D.NAME_MAP.has(next[0].toLowerCase()) &&
        text.slice((m.index ?? 0) + m[0].length, next.index).trim() === '';
      if (!prevOk && !nextOk) continue;
    }
    keep.add(i);
  }

  const out: string[] = [];
  let last = 0;
  for (let i = 0; i < words.length; i += 1) {
    if (!keep.has(i)) continue;
    const m = words[i];
    const start = m.index ?? 0;
    out.push(text.slice(last, start), D.NAME_MAP.get(m[0].toLowerCase())!);
    last = start + m[0].length;
  }
  out.push(text.slice(last));
  return out.join('');
}
