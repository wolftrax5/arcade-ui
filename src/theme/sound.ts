/**
 * Short square-wave blips played with the WebAudio API. No audio files, no
 * extra dependencies. `play` is a no-op in environments without AudioContext,
 * so SSR and tests stay quiet.
 */

export type SoundCue = 'press' | 'toggle' | 'select' | 'release';

interface CuePreset {
  frequency: number;
  duration: number;
  gain: number;
  type: OscillatorType;
}

const cues: Record<SoundCue, CuePreset> = {
  // Deep "chunk" when a button is pressed.
  press: { frequency: 180, duration: 0.08, gain: 0.14, type: 'square' },
  // Short click for checkbox toggles.
  toggle: { frequency: 520, duration: 0.05, gain: 0.1, type: 'square' },
  // Mid-pitch confirm for radio selection.
  select: { frequency: 360, duration: 0.07, gain: 0.11, type: 'square' },
  // Low thunk when a slider is released.
  release: { frequency: 140, duration: 0.07, gain: 0.12, type: 'square' },
};

type AudioContextCtor = typeof AudioContext;

interface AudioWindow {
  AudioContext?: AudioContextCtor;
  webkitAudioContext?: AudioContextCtor;
}

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const w = window as unknown as AudioWindow;
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

let sharedContext: AudioContext | null = null;
let contextUnavailable = false;

function getContext(): AudioContext | null {
  if (contextUnavailable) {
    return null;
  }
  if (sharedContext) {
    return sharedContext;
  }
  const Ctor = getAudioContextCtor();
  if (!Ctor) {
    contextUnavailable = true;
    return null;
  }
  try {
    sharedContext = new Ctor();
  } catch {
    contextUnavailable = true;
    return null;
  }
  return sharedContext;
}

/**
 * Play a short arcade sound. Returns silently when audio is unavailable.
 * Callers are responsible for gating on mute, reduced motion, and disabled
 * state (see `useArcadeSound` in `ThemeProvider`).
 */
export function playCue(cue: SoundCue): void {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  const preset = cues[cue];
  try {
    if (ctx.state === 'suspended') {
      // Browsers hold audio until the first user gesture. Resume lazily; if
      // the gesture hasn't happened yet the promise rejects silently.
      void ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = preset.type;
    oscillator.frequency.setValueAtTime(preset.frequency, now);

    // steps()-style envelope: instant attack, linear decay for an 8-bit feel.
    gain.gain.setValueAtTime(preset.gain, now);
    gain.gain.linearRampToValueAtTime(0, now + preset.duration);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + preset.duration);
  } catch {
    // Audio hardware or browser quirks — silent fallback.
  }
}

/** Test helper: reset the memoized context. Not exported from the barrel. */
export function __resetSoundForTests(): void {
  sharedContext = null;
  contextUnavailable = false;
}
