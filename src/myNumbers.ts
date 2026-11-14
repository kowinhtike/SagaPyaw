/**
 * Burmese number verbalisation. Port of `reference/my_numbers.py`.
 *
 * Python's `\b` is Unicode-aware while JavaScript's is ASCII-only, so the
 * boundary is spelled out as explicit lookarounds over `PY_WORD`.
 */
import * as D from './data';

const DIGITS = D.DIGITS;
const L = D.NUMBER_LITERALS;

/** Python `\w` for str patterns: letters, letter/other numbers, underscore. */
const PY_WORD = '[\\p{L}\\p{N}_]';
/** Python `\b` expressed with lookarounds. */
const PY_B = `(?:(?<=${PY_WORD})(?!${PY_WORD})|(?<!${PY_WORD})(?=${PY_WORD}))`;

const MY2ASCII = new Map<string, string>();
Array.from('\u1040\u1041\u1042\u1043\u1044\u1045\u1046\u1047\u1048\u1049').forEach((c, i) => {
  MY2ASCII.set(c, String(i));
});

const WA_RUN = /(?:[\u1040-\u1049]|\u101d(?![\u102b-\u103e]))+/g;
const HAS_MY_DIGIT = /[\u1040-\u1049]/;

const DIGIT_CLASS = '[0-9\\u1040-\\u1049]';
const NUM_RE = new RegExp(
  `(?<int>${DIGIT_CLASS}{1,3}(?:,${DIGIT_CLASS}{3})+|${DIGIT_CLASS}+)` +
    `(?:\\.(?<frac>${DIGIT_CLASS}+))?` +
    `(?<k>[kK](?![A-Za-z]))?` +
    `(?<pct>\\s?%)?` +
    `(?<cur>\\s?(?:Ks|KS|ks|MMK|mmk|Kyats?|kyats?)${PY_B})?`,
  'gu',
);
const HAS_DIGIT = /[0-9\u1040-\u1049]/;

function translate(s: string): string {
  return Array.from(s)
    .map((c) => MY2ASCII.get(c) ?? c)
    .join('');
}

/** `re.sub` equivalent that hands the callback a real match object. */
function replaceAll(text: string, re: RegExp, fn: (m: RegExpExecArray) => string): string {
  const out: string[] = [];
  let last = 0;
  re.lastIndex = 0;
  for (;;) {
    const m = re.exec(text);
    if (m === null) break;
    out.push(text.slice(last, m.index), fn(m));
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex += 1;
  }
  out.push(text.slice(last));
  return out.join('');
}

function belowLakh(n: number): string {
  const s = String(n);
  const parts: Array<[number, number]> = [];
  for (let i = 0; i < s.length; i += 1) {
    const d = Number(s[i]);
    const place = s.length - 1 - i;
    if (d) parts.push([d, place]);
  }
  const words: string[] = [];
  for (let j = 0; j < parts.length; j += 1) {
    const [d, place] = parts[j];
    if (place === 0) {
      words.push(DIGITS[d]);
      continue;
    }
    let unit = D.PLACES.get(place);
    if (unit === undefined) throw new Error(`unsupported place: ${place}`);
    if (j < parts.length - 1) unit = D.CREAKY.get(unit) ?? unit;
    const lead = d === 1 && place === 1 && j === 0 ? '' : DIGITS[d];
    words.push(lead + unit);
  }
  return words.join('');
}

export function numberWords(n: number): string {
  if (n === 0) return DIGITS[0];
  if (n < 100000) return belowLakh(n);
  const lakhs = Math.floor(n / 100000);
  const rest = n % 100000;
  return numberWords(lakhs) + L.lakh + (rest ? belowLakh(rest) : '');
}

function digitByDigit(s: string): string {
  return Array.from(s)
    .map((c) => DIGITS[Number(c)])
    .join(' ');
}

function say(m: RegExpExecArray): string {
  const g = m.groups!;
  const raw = translate(g.int).split(',').join('');
  const frac = g.frac;
  let out: string;
  if ((raw.length > 1 && raw[0] === '0' && !frac) || raw.length > 10) {
    out = digitByDigit(raw);
  } else {
    let n = Number(raw);
    if (g.k) n *= 1000;
    out = numberWords(n);
    if (frac) out += L.decimal + digitByDigit(translate(frac));
  }
  if (g.pct) out += L.percent;
  if (g.cur) out += L.kyat;
  return ` ${out} `;
}

export function verbalize(text: string): string {
  if (!HAS_DIGIT.test(text)) return text;
  let s = text.replace(WA_RUN, (m0) =>
    HAS_MY_DIGIT.test(m0) ? m0.split('\u101d').join('\u1040') : m0,
  );
  s = replaceAll(s, NUM_RE, say);
  s = s.replace(/[ \t]{2,}/g, ' ');
  return s.replace(/ (?=[!?.,\u104b\u104a])/g, '').trim();
}
