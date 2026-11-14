/**
 * Shared character classes.
 *
 * `IPA_RE` is the reference's `[A-Za-zæðθŋʒɐ-ʯᵻˈˌː]` and `WORDISH` replaces
 * Python's `[^\W\d]`. They are spelled with escapes so that no invisible
 * character can be lost in transit.
 */
export const IPA_RE = /[A-Za-z\u00e6\u00f0\u03b8\u014b\u0292\u0250-\u02ef\u1d7b\u02c8\u02cc\u02d0]/;

/** Python's `\w` minus digits: Unicode letters, letter-numbers, other numbers, `_`. */
export const WORDISH_RE = /[\p{L}\p{Nl}\p{No}_]/u;

export function isLetterStart(token: string): boolean {
  const first = Array.from(token)[0];
  if (first === undefined) return false;
  if (/\d/.test(first)) return false;
  return WORDISH_RE.test(first);
}
