import { useRef, useCallback, useEffect } from "react";

// Dark, ominous boss theme in minor key — Souls-inspired
const NOTES: Record<string, number> = {
  E3: 164.81, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63,
  F4: 349.23, G4: 392.0, Ab4: 415.30, A4: 440.0,
  Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25,
  F5: 698.46,
  // Low bass
  A2: 110.0, E2: 82.41, C3: 130.81, D3: 146.83,
};

// Boss theme melody — dark, brooding, minor key
const MELODY: [string, number][] = [
  // Ominous intro
  ["E3", 0.6], ["E3", 0.3], ["E3", 0.3], ["G3", 0.6],
  ["A3", 0.3], ["B3", 0.3], ["C4", 0.6], ["B3", 0.3], ["A3", 0.3],
  ["E3", 0.9], ["E3", 0.3],
  // Rising tension
  ["E4", 0.4], ["Eb4", 0.4], ["D4", 0.4], ["C4", 0.4],
  ["B3", 0.6], ["C4", 0.3], ["D4", 0.3],
  ["E4", 0.6], ["D4", 0.3], ["C4", 0.3],
  ["B3", 0.6], ["A3", 0.3], ["B3", 0.3],
  // Aggressive section
  ["E4", 0.2], ["E4", 0.2], ["G4", 0.2], ["E4", 0.2],
  ["D4", 0.2], ["E4", 0.2], ["G4", 0.4],
  ["A4", 0.3], ["G4", 0.3], ["E4", 0.3], ["D4", 0.3],
  ["C4", 0.6], ["D4", 0.3], ["E4", 0.3],
  // Dramatic descent
  ["B4", 0.6], ["A4", 0.3], ["G4", 0.3],
  ["E4", 0.4], ["D4", 0.4], ["C4", 0.4],
  ["B3", 0.4], ["A3", 0.4], ["E3", 0.8],
];

// Bass drone pattern
const BASS: [string, number][] = [
  ["A2", 1.2], ["E2", 1.2], ["C3", 1.2], ["D3", 0.6], ["E2", 0.6],
  ["A2", 1.2], ["E2", 0.6], ["A2", 0.6], ["C3", 1.2],
  ["D3", 1.2], ["E2", 1.2], ["A2", 1.2],
];

export function useBossMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timeoutIds = useRef<number[]>([]);
  const isPlayingRef = useRef(false);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    if (ctxRef.current) {
      // Fade out
      try {
        ctxRef.current.close();
      } catch {}
      ctxRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (isPlayingRef.current) return;
    stop();
    isPlayingRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Master gain (louder than background music)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(ctx.destination);

    const melodyDur = MELODY.reduce((s, [, d]) => s + d, 0);
    const bassDur = BASS.reduce((s, [, d]) => s + d, 0);

    const scheduleMelody = (start: number) => {
      let t = start;
      for (const [note, dur] of MELODY) {
        const freq = NOTES[note];
        if (!freq) { t += dur; continue; }

        // Lead: sawtooth for that dark Souls feel
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = freq;

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.6, t);
        noteGain.gain.exponentialRampToValueAtTime(0.15, t + dur * 0.7);
        noteGain.gain.linearRampToValueAtTime(0, t + dur);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      }
      return t;
    };

    const scheduleBass = (start: number, loops: number) => {
      let t = start;
      for (let l = 0; l < loops; l++) {
        for (const [note, dur] of BASS) {
          const freq = NOTES[note];
          if (!freq) { t += dur; continue; }

          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.value = freq;

          const noteGain = ctx.createGain();
          noteGain.gain.setValueAtTime(0.4, t);
          noteGain.gain.linearRampToValueAtTime(0.1, t + dur);

          osc.connect(noteGain);
          noteGain.connect(masterGain);
          osc.start(t);
          osc.stop(t + dur);
          t += dur;
        }
      }
    };

    // Schedule loops
    let nextMelody = ctx.currentTime;
    const bassLoopsPerMelody = Math.ceil(melodyDur / bassDur);

    for (let i = 0; i < 3; i++) {
      scheduleBass(nextMelody, bassLoopsPerMelody);
      nextMelody = scheduleMelody(nextMelody);
    }

    const loopFn = () => {
      if (!isPlayingRef.current) return;
      scheduleBass(nextMelody, bassLoopsPerMelody);
      nextMelody = scheduleMelody(nextMelody);
      const id = window.setTimeout(loopFn, melodyDur * 1000 * 0.8);
      timeoutIds.current.push(id);
    };
    const id = window.setTimeout(loopFn, melodyDur * 1000 * 2);
    timeoutIds.current.push(id);
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { play, stop };
}
