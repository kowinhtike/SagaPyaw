/**
 * Gapless playback queue for streamed chunks.
 *
 * Chunks arrive slower than real time, so each one is scheduled on the audio
 * clock ahead of the previous one instead of being played immediately. That is
 * what makes streaming sound continuous rather than stuttering.
 */

export class StreamPlayer {
  /** @param {number} sampleRate sample rate of the incoming chunks */
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this.ctx = null;
    this.at = 0;
    this.sources = new Set();
    this.onstate = null;
  }

  /**
   * Must be called from a user gesture: iOS refuses to start an AudioContext
   * otherwise, and the page would stay silent with no error.
   */
  async unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctor();
      // Safari ignores the hardware mute switch for Web Audio unless the audio
      // session is declared as playback (iOS 16.4+). Harmless elsewhere.
      try {
        if (navigator.audioSession) navigator.audioSession.type = 'playback';
      } catch {
        /* not supported */
      }
    }
    if (this.ctx.state !== 'running') await this.ctx.resume();
    return this.ctx;
  }

  get playing() {
    return this.sources.size > 0;
  }

  /** Seconds of audio already scheduled but not yet played. */
  get queued() {
    if (!this.ctx) return 0;
    return Math.max(0, this.at - this.ctx.currentTime);
  }

  /** Queue one chunk. Returns the time (in seconds) it will start at. */
  push(samples) {
    if (!this.ctx) throw new Error('player not unlocked');
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, samples.length, this.sampleRate);
    buffer.copyToChannel(samples, 0);

    // Small lead so the first chunk is not clipped by scheduling jitter.
    const startAt = Math.max(this.at, ctx.currentTime + 0.04);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
      if (this.sources.size === 0) this.onstate?.('idle');
    };
    source.start(startAt);
    this.at = startAt + buffer.duration;
    this.onstate?.('playing');
    return startAt;
  }

  stop() {
    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    this.sources.clear();
    this.at = 0;
    this.onstate?.('idle');
  }

  async close() {
    this.stop();
    if (this.ctx) {
      await this.ctx.close();
      this.ctx = null;
    }
  }
}
