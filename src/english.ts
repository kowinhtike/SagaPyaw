/**
 * English segments -> IPA. Port of `reference/english.py`.
 *
 * The reference delegates to `misaki` + espeak-ng (a GPLv3 native dependency).
 * In a browser that becomes espeak-ng compiled to WASM, which must be injected
 * here; until then Latin runs are passed through untouched. Phase 1 of this
 * project targets Burmese only, so the default is a pass-through.
 */
const LATIN = /[A-Za-z]/;
const LATIN_RUN = /[A-Za-z][A-Za-z'\-. ]*[A-Za-z]|[A-Za-z]/g;

export type EnglishG2P = (word: string) => string;

let englishG2P: EnglishG2P | null = null;
let missingWarnings = 0;

/** Register an espeak-ng-backed G2P, e.g. `setEnglishG2P(phonemizer => ...)`. */
export function setEnglishG2P(fn: EnglishG2P | null): void {
  englishG2P = fn;
}

export function hasEnglishG2P(): boolean {
  return englishG2P !== null;
}

/** How many Latin runs were left unphonemised since the last reset. */
export function missingEnglishCount(): number {
  return missingWarnings;
}

export function resetMissingEnglishCount(): void {
  missingWarnings = 0;
}

export function toTokens(text: string): string {
  if (!LATIN.test(text)) return text;
  if (englishG2P === null) {
    missingWarnings += 1;
    return text;
  }
  const out: string[] = [];
  let last = 0;
  LATIN_RUN.lastIndex = 0;
  for (;;) {
    const m = LATIN_RUN.exec(text);
    if (m === null) break;
    out.push(text.slice(last, m.index));
    out.push(englishG2P(m[0]).split('\u0329').join('').trim());
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out.join('').replace(/ {2,}/g, ' ').trim();
}
