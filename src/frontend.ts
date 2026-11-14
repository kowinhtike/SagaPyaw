/**
 * Public text frontend. Port of `reference/nara_frontend.py`.
 * Chain: prepareNames -> toTokens -> phonemize, exactly as `synthesize.py` does.
 */
import * as D from './data';
import { g2p, loadLexicon, loadMined, MissingKeyError, type Lexicon, type Mined } from './g2pMy';
import { sylToChars } from './charMap';
import { replaceNames } from './naraNames';
import { IPA_RE, isLetterStart } from './chars';

const PUNCT_TOKENS = new Set<string>([',', '.', '?', '!']);

let lexCache: Lexicon | null = null;
let minedCache: Mined | null = null;

function lexicon(): Lexicon {
  if (lexCache === null) lexCache = loadLexicon();
  return lexCache;
}

function mined(): Mined {
  if (minedCache === null) minedCache = loadMined();
  return minedCache;
}

export function prepareNames(text: string): string {
  return replaceNames(text);
}

/** Syllable-level phoneme string -> flat character string fed to the model. */
export function phonemize(text: string): string {
  return phonemizeDetailed(text).phon;
}

/** Same as `phonemize`, but also returns the syllables the parser rejected. */
export function phonemizeDetailed(text: string): { phon: string; errors: string[] } {
  const { phon, errors } = g2p(text, lexicon(), mined());
  const out: string[] = [];

  for (const tok of phon.split(/\s+/).filter(Boolean)) {
    try {
      if (PUNCT_TOKENS.has(tok)) {
        out.push(tok);
      } else if (tok.includes('-') || D.RHYME_SPLIT.has(tok)) {
        out.push(tok.includes('-') ? sylToChars(tok) : tok);
      } else if (IPA_RE.test(tok)) {
        out.push(tok);
      } else if (isLetterStart(tok)) {
        out.push(sylToChars(tok));
      }
    } catch (err) {
      if (err instanceof MissingKeyError) continue;
      throw err;
    }
  }

  return { phon: out.join(' '), errors };
}
