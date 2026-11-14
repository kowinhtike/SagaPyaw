/**
 * Inference pipeline. Port of `synthesize.py` from YeeNyunn/nara-mini-v1.
 *
 * Environment agnostic: the caller passes in its own onnxruntime build
 * (`onnxruntime-web` in a browser, the same package under Node in CI), so this
 * module never touches the filesystem or Node APIs.
 */
import { phonemizeDetailed, prepareNames } from './frontend';
import { toTokens } from './english';
import { verbalize } from './myNumbers';

/** Just enough of the onnxruntime-web surface to keep this module dependency-free. */
export interface OrtTensorLike {
  data: Float32Array | BigInt64Array | Int32Array;
  dims: readonly number[];
}
export interface OrtSessionLike {
  run(feeds: Record<string, unknown>): Promise<Record<string, OrtTensorLike>>;
  /** Frees the WASM heap the session owns. Present on onnxruntime-web sessions. */
  release?(): void;
}
export interface OrtModuleLike {
  Tensor: new (type: string, data: unknown, dims: readonly number[]) => unknown;
  InferenceSession: {
    create(bytes: Uint8Array, options?: Record<string, unknown>): Promise<OrtSessionLike>;
  };
}

export interface VoiceMetadata {
  voice?: string;
  sample_rate: number;
  /** Style-vector bucket centres, one per style vector. */
  centers: number[];
  /** One style vector per centre, each `style_dim * 2` wide. */
  styles: number[][];
  vocab: Record<string, number>;
}

export interface SynthesizeOptions {
  /** Mirrors `synthesize.py --no-normalize-numbers`. Default: true. */
  normalizeNumbers?: boolean;
  /** Silence inserted between chunks, in samples. Default: 4800 (200 ms). */
  gapSamples?: number;
  limit?: number;
}

export interface StreamOptions extends SynthesizeOptions {
  /**
   * Abort mid-passage. Checked before each chunk and between the encoder and
   * decoder, so a stop request never starts another expensive decode.
   */
  signal?: AbortSignal;
  /**
   * Target length of the *first* chunk, in characters. The first chunk is what
   * the listener waits for, so it is deliberately shorter than `limit`; the rest
   * of the passage keeps the full budget. Splits only at whitespace, never
   * mid-syllable. `0` disables the short first chunk. Default: 22.
   */
  firstLimit?: number;
}

/** One synthesised chunk, ready to be scheduled on an audio timeline. */
export interface StreamChunk {
  /** Zero-based index of this chunk. */
  index: number;
  /** Total number of chunks in the passage. */
  total: number;
  /** 24 kHz mono float32. Already includes the inter-chunk gap unless it is the last chunk. */
  samples: Float32Array;
  /** Phoneme string for this chunk. */
  phon: string;
  /** Source text for this chunk. */
  text: string;
  /** Phoneme token count fed to the encoder. */
  tokens: number;
  /** Predicted acoustic frames. */
  frames: number;
  /** Encoder wall time, ms. */
  encoderMs: number;
  /** Decoder wall time, ms. */
  decoderMs: number;
}

/** Characters are counted in code points, so Burmese clusters stay intact. */
function cpLength(s: string): number {
  return Array.from(s).length;
}

/**
 * Split a passage into chunks for streaming, with a shorter first chunk so the
 * listener hears something sooner.
 *
 * The cut point is always whitespace: Burmese syllables can span several code
 * points (consonant + medials + vowel signs), and slicing one in half would feed
 * the G2P a broken cluster.
 */
export function planChunks(text: string, limit = 200, firstLimit = 22): string[] {
  const pieces = splitSpeech(text, limit);
  if (pieces.length === 0 || firstLimit <= 0) return pieces;

  const first = pieces[0];
  if (cpLength(first) <= firstLimit) return pieces;

  const chars = Array.from(first);
  const floor = Math.max(1, Math.floor(firstLimit * 0.4));
  let cut = -1;
  for (let i = Math.min(firstLimit, chars.length - 1); i >= floor; i -= 1) {
    if (/\s/.test(chars[i])) {
      cut = i;
      break;
    }
  }
  if (cut <= 0) return pieces;

  const head = chars.slice(0, cut).join('').trim();
  const tail = chars.slice(cut).join('').trim();
  if (!head || !tail) return pieces;
  return [head, tail, ...pieces.slice(1)];
}

const SENTENCE_END = new Set<string>(['\u104b', '!', '?', '\u2026', '\n']);
const CLAUSE_END = new Set<string>(['\u104a']);

/**
 * Split after each sentence terminator, consuming trailing whitespace, then
 * again after each clause comma. Mirrors `re.split(r'(?<=[။!?…\n])\s*', ...)`.
 */
function splitAfter(text: string, terminators: Set<string>): string[] {
  const chars = Array.from(text);
  const parts: string[] = [];
  let cur = '';
  for (let i = 0; i < chars.length; i += 1) {
    cur += chars[i];
    if (!terminators.has(chars[i])) continue;
    while (i + 1 < chars.length && /\s/.test(chars[i + 1])) i += 1;
    parts.push(cur);
    cur = '';
  }
  if (cur) parts.push(cur);
  return parts;
}

/** Port of `split_speech()`: keeps every chunk under `limit` characters. */
export function splitSpeech(text: string, limit = 200): string[] {
  const units: string[] = [];
  for (const sentence of splitAfter(text, SENTENCE_END)) {
    for (const rawClause of splitAfter(sentence, CLAUSE_END)) {
      let clause = rawClause;
      while (Array.from(clause).length > limit) {
        const chars = Array.from(clause);
        let cut = -1;
        for (let i = limit - 1; i >= 0; i -= 1) {
          if (chars[i] === ' ') {
            cut = i;
            break;
          }
        }
        if (cut <= 0) cut = limit;
        units.push(chars.slice(0, cut).join(''));
        clause = chars.slice(cut).join('').trim();
      }
      if (clause.trim()) units.push(clause.trim());
    }
  }

  const pieces: string[] = [];
  let current = '';
  for (const unit of units) {
    if (current && Array.from(current).length + 1 + Array.from(unit).length > limit) {
      pieces.push(current);
      current = unit;
    } else {
      current = `${current} ${unit}`.trim();
    }
  }
  if (current) pieces.push(current);
  return pieces;
}

/** 16-bit PCM WAV, the same format `synthesize.py` writes. */
export function encodeWav(samples: Float32Array, sampleRate: number): Uint8Array {
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const ascii = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i += 1) view.setUint8(offset + i, s.charCodeAt(i));
  };
  ascii(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  ascii(8, 'WAVE');
  ascii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i += 1) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
  }
  return bytes;
}

export class SagaSynthesizer {
  private constructor(
    private readonly ort: OrtModuleLike,
    private readonly encoder: OrtSessionLike,
    private readonly decoder: OrtSessionLike,
    readonly metadata: VoiceMetadata,
  ) {}

  static async create(
    ort: OrtModuleLike,
    model: { encoder: Uint8Array; decoder: Uint8Array; metadata: VoiceMetadata },
    sessionOptions: Record<string, unknown> = {},
  ): Promise<SagaSynthesizer> {
    const [encoder, decoder] = await Promise.all([
      ort.InferenceSession.create(model.encoder, sessionOptions),
      ort.InferenceSession.create(model.decoder, sessionOptions),
    ]);
    return new SagaSynthesizer(ort, encoder, decoder, model.metadata);
  }

  /**
   * Build from sessions the caller created itself. Lets a browser load one graph
   * at a time and drop its bytes before the next one, which halves peak memory.
   */
  static fromSessions(
    ort: OrtModuleLike,
    encoder: OrtSessionLike,
    decoder: OrtSessionLike,
    metadata: VoiceMetadata,
  ): SagaSynthesizer {
    return new SagaSynthesizer(ort, encoder, decoder, metadata);
  }

  get sampleRate(): number {
    return this.metadata.sample_rate;
  }

  /**
   * Drop both graphs. Required before another voice is loaded: two voices in one
   * tab is ~360 MB of weights plus two ORT heaps, which is what makes a phone
   * reload the page. Safe to call more than once, and never throws.
   */
  dispose(): void {
    for (const session of [this.encoder, this.decoder]) {
      try {
        session.release?.();
      } catch {
        /* a session that is already gone is not an error */
      }
    }
  }

  /** Same validation the reference performs, so failures surface identically. */
  private pickStyle(count: number): number[] {
    const { centers, styles } = this.metadata;
    let best = 0;
    let bestDelta = Infinity;
    for (let i = 0; i < centers.length; i += 1) {
      const delta = Math.abs(centers[i] - count);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    }
    return styles[best];
  }

  /** Run encoder + decoder for one chunk of text. */
  private async runPiece(
    piece: string,
    signal?: AbortSignal,
  ): Promise<Omit<StreamChunk, 'index' | 'total'> | null> {
    const { phon } = phonemizeDetailed(toTokens(prepareNames(piece)));
    const tokens: number[] = [];
    for (const ch of phon) {
      const id = this.metadata.vocab[ch];
      if (id !== undefined) tokens.push(id);
    }
    if (!tokens.length) throw new Error('a passage produced no phonemes');
    if (tokens.length > 508) throw new Error('a passage exceeds the phoneme context limit');

    const style = this.pickStyle(tokens.length);
    const ids = new BigInt64Array(tokens.length + 2);
    for (let i = 0; i < tokens.length; i += 1) ids[i + 1] = BigInt(tokens[i]);

    const tEnc = Date.now();
    const enc = await this.encoder.run({
      tokens: new this.ort.Tensor('int64', ids, [1, tokens.length + 2]),
      style: new this.ort.Tensor('float32', Float32Array.from(style), [1, style.length]),
    });

    const durations = enc.durations.data as BigInt64Array;
    const prosody = enc.prosody.data as Float32Array;
    const textOut = enc.text.data as Float32Array;
    const frames = durations.length;

    let total = 0;
    let minDur = Infinity;
    for (let i = 0; i < frames; i += 1) {
      const d = Number(durations[i]);
      if (d < minDur) minDur = d;
      total += d;
    }
    if (minDur < 1 || total < 1 || total > 20000) throw new Error('invalid predicted duration');

    const cProsody = enc.prosody.dims[1];
    const cText = enc.text.dims[1];
    const expandedProsody = new Float32Array(cProsody * total);
    const expandedText = new Float32Array(cText * total);
    for (let c = 0; c < cProsody; c += 1) {
      let at = c * total;
      const row = c * frames;
      for (let t = 0; t < frames; t += 1) {
        const d = Number(durations[t]);
        expandedProsody.fill(prosody[row + t], at, at + d);
        at += d;
      }
    }
    for (let c = 0; c < cText; c += 1) {
      let at = c * total;
      const row = c * frames;
      for (let t = 0; t < frames; t += 1) {
        const d = Number(durations[t]);
        expandedText.fill(textOut[row + t], at, at + d);
        at += d;
      }
    }

    if (signal?.aborted) return null;
    const tDec = Date.now();
    const out = await this.decoder.run({
      prosody: new this.ort.Tensor('float32', expandedProsody, [1, cProsody, total]),
      text: new this.ort.Tensor('float32', expandedText, [1, cText, total]),
      style: new this.ort.Tensor('float32', Float32Array.from(style), [1, style.length]),
    });
    const audio = out[Object.keys(out)[0]].data as Float32Array;
    if (audio.length < 2400) throw new Error('the model produced invalid audio');
    for (let i = 0; i < audio.length; i += 1) {
      if (!Number.isFinite(audio[i])) throw new Error('the model produced invalid audio');
    }

    return {
      samples: audio.slice(),
      phon,
      text: piece,
      tokens: tokens.length,
      frames,
      encoderMs: tDec - tEnc,
      decoderMs: Date.now() - tDec,
    };
  }

  /**
   * Stream a passage chunk by chunk. Each yielded chunk is playable on its own.
   *
   * With `firstLimit: 0` the chunk plan matches `synthesize()`, so the two agree
   * on sample count. They are not bit-identical: the WASM kernels are not
   * reproducible run to run (mean |Δ| ≈ 0.005 against a 0.11 RMS signal, i.e.
   * about −27 dB, inaudible but measurable).
   */
  async *synthesizeStream(
    text: string,
    options: StreamOptions = {},
  ): AsyncGenerator<StreamChunk> {
    const { normalizeNumbers = true, gapSamples = 4800, limit = 200, firstLimit = 22, signal } = options;
    const spoken = normalizeNumbers ? verbalize(text) : text;
    const pieces = planChunks(spoken, limit, firstLimit);
    if (!pieces.length) throw new Error('text must contain speech');

    for (let index = 0; index < pieces.length; index += 1) {
      if (signal?.aborted) return;
      const piece = pieces[index];
      const result = await this.runPiece(piece, signal);
      if (!result) return;
      const last = index === pieces.length - 1;
      const samples = last
        ? result.samples
        : (() => {
            const padded = new Float32Array(result.samples.length + gapSamples);
            padded.set(result.samples, 0);
            return padded;
          })();
      for (let i = 0; i < samples.length; i += 1) {
        samples[i] = Math.max(-1, Math.min(1, samples[i]));
      }
      yield { ...result, samples, index, total: pieces.length };
    }
  }

  async synthesize(text: string, options: SynthesizeOptions = {}): Promise<Float32Array> {
    const parts: Float32Array[] = [];
    let length = 0;
    for await (const chunk of this.synthesizeStream(text, { ...options, firstLimit: 0 })) {
      parts.push(chunk.samples);
      length += chunk.samples.length;
    }
    const merged = new Float32Array(length);
    let at = 0;
    for (const part of parts) {
      merged.set(part, at);
      at += part.length;
    }
    return merged;
  }
}
