/**
 * nara-g2p — Burmese text frontend for YeeNyunn/nara-mini-v1, in TypeScript.
 *
 * Faithful port of the reference Python frontend so the same text produces the
 * same phoneme string (and therefore the same model input) in a browser.
 */
export * from './g2pMy';
export * from './charMap';
export * from './myNumbers';
export * from './naraNames';
export * from './english';
export * from './frontend';
export * from './chars';
export * from './inference';

import { prepareNames, phonemizeDetailed } from './frontend';
import { toTokens } from './english';
import { verbalize } from './myNumbers';

export interface TextToPhonemesOptions {
  /** Mirrors `synthesize.py --no-normalize-numbers`. Default: true. */
  normalizeNumbers?: boolean;
}

export interface PhonemeResult {
  phon: string;
  errors: string[];
}

/**
 * The full chain used by `synthesize.py`:
 * verbalize -> prepareNames -> toTokens -> phonemize.
 */
export function textToPhonemes(text: string, options: TextToPhonemesOptions = {}): PhonemeResult {
  const { normalizeNumbers = true } = options;
  const spoken = normalizeNumbers ? verbalize(text) : text;
  return phonemizeDetailed(toTokens(prepareNames(spoken)));
}
