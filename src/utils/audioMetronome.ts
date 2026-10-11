/**
 * High-Precision Web Audio Metronome Engine with Lookahead Scheduling
 */

export type MetronomeSound = 'woodblock' | 'click' | 'beep' | 'cowbell';

export class AudioMetronome {
  private audioCtx: AudioContext | null = null;
  private isRunning: boolean = false;
  private bpm: number = 120;
  private timeSigNumerator: number = 4;
  private currentBeat: number = 0;
  private nextNoteTime: number = 0.0;
  private timerID: number | null = null;
  private sound: MetronomeSound = 'woodblock';
  private volume: number = 0.8;
  private onBeatCallback?: (beat: number, totalBeats: number) => void;

  // Lookahead settings
  private readonly lookahead: number = 25.0; // milliseconds
  private readonly scheduleAheadTime: number = 0.1; // seconds

  constructor(bpm: number = 120, timeSig: string = '4/4') {
    this.bpm = bpm;
    this.setTimeSignature(timeSig);
  }

  private initAudio() {
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext não disponível:', e);
    }
  }

  public setOnBeat(callback: (beat: number, totalBeats: number) => void) {
    this.onBeatCallback = callback;
  }

  public setBpm(bpm: number) {
    this.bpm = Math.max(30, Math.min(300, bpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setSound(sound: MetronomeSound) {
    this.sound = sound;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setTimeSignature(sig: string) {
    const parts = sig.split('/');
    const num = parseInt(parts[0], 10);
    this.timeSigNumerator = isNaN(num) || num <= 0 ? 4 : num;
    this.currentBeat = 0;
  }

  public getTimeSignatureNumerator(): number {
    return this.timeSigNumerator;
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
    this.currentBeat = (this.currentBeat + 1) % this.timeSigNumerator;
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.audioCtx) return;

    // Trigger visual callback at the scheduled time
    const timeDelta = Math.max(0, (time - this.audioCtx.currentTime) * 1000);
    setTimeout(() => {
      if (this.isRunning && this.onBeatCallback) {
        this.onBeatCallback(beatNumber, this.timeSigNumerator);
      }
    }, timeDelta);

    const isAccent = beatNumber === 0;
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    const baseGain = this.volume;

    switch (this.sound) {
      case 'woodblock':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isAccent ? 980 : 720, time);
        gainNode.gain.setValueAtTime(baseGain * (isAccent ? 1.0 : 0.7), time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        osc.start(time);
        osc.stop(time + 0.05);
        break;

      case 'click':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isAccent ? 1600 : 1000, time);
        gainNode.gain.setValueAtTime(baseGain * (isAccent ? 1.0 : 0.6), time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        osc.start(time);
        osc.stop(time + 0.03);
        break;

      case 'beep':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isAccent ? 1200 : 800, time);
        gainNode.gain.setValueAtTime(baseGain * (isAccent ? 0.9 : 0.5), time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        osc.start(time);
        osc.stop(time + 0.08);
        break;

      case 'cowbell':
        osc.type = 'square';
        osc.frequency.setValueAtTime(isAccent ? 620 : 540, time);
        gainNode.gain.setValueAtTime(baseGain * (isAccent ? 0.8 : 0.5), time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
        osc.start(time);
        osc.stop(time + 0.07);
        break;
    }
  }

  private scheduler() {
    if (!this.audioCtx) return;
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  public start() {
    if (this.isRunning) return;
    this.initAudio();
    if (!this.audioCtx) return;

    this.isRunning = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.scheduler();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.currentBeat = 0;
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

// Global tap tempo helper
export class TapTempoCalculator {
  private taps: number[] = [];
  private readonly maxTaps: number = 6;
  private readonly resetTimeoutMs: number = 2500;

  public tap(): number | null {
    const now = Date.now();
    if (this.taps.length > 0 && now - this.taps[this.taps.length - 1] > this.resetTimeoutMs) {
      this.taps = [];
    }

    this.taps.push(now);
    if (this.taps.length > this.maxTaps) {
      this.taps.shift();
    }

    if (this.taps.length < 2) return null;

    let intervalsSum = 0;
    for (let i = 1; i < this.taps.length; i++) {
      intervalsSum += (this.taps[i] - this.taps[i - 1]);
    }

    const avgInterval = intervalsSum / (this.taps.length - 1);
    const calculatedBpm = Math.round(60000 / avgInterval);

    return Math.max(30, Math.min(260, calculatedBpm));
  }

  public reset() {
    this.taps = [];
  }
}
