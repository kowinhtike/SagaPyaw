/**
 * Syllable -> phoneme-character expansion.
 * Port of `reference/char_map.py`.
 */
import * as D from './data';
import { MissingKeyError } from './g2pMy';

const TONE_KEYS = new Set<string>(['\u02e7', '\u02e5', '\u02c0']); // ˧ ˥ ˀ

function charOf(key: string): string {
  const v = D.CHAR.get(key);
  if (v === undefined) throw new MissingKeyError(key);
  return v;
}

/**
 * `k-a-˧` -> `ka→`. Throws MissingKeyError (Python's KeyError) when the onset,
 * medial, rhyme or tone is unknown; `phonemize()` drops such tokens.
 */
export function sylToChars(syl: string): string {
  const parts = syl.split('-');
  const last = parts[parts.length - 1];
  const tone = TONE_KEYS.has(last) ? last : null;
  const core = tone ? parts.slice(0, -1) : parts;

  const onset = core[0];
  const meds = core.slice(1, -1);
  const rhyme = core[core.length - 1];

  const out: string[] = [charOf(onset)];
  for (const m of meds) out.push(charOf(m));

  const rhymeParts = D.RHYME_SPLIT.get(rhyme);
  if (rhymeParts === undefined) throw new MissingKeyError(rhyme);
  for (const c of rhymeParts) out.push(D.CHAR.has(c) ? D.CHAR.get(c)! : c);

  if (tone) out.push(charOf(tone));
  return out.join('');
}
