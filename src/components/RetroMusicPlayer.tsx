import { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A3: 220.0, B3: 246.94, C3: 130.81, E3: 164.81, G3: 196.0,
};

type Melody = { name: string; notes: [string, number][] };

const MELODIES: Melody[] = [
  {
    name: "Korobeiniki",
    notes: [
      ["E5", 0.4], ["B4", 0.2], ["C5", 0.2], ["D5", 0.4], ["C5", 0.2], ["B4", 0.2],
      ["A4", 0.4], ["A4", 0.2], ["C5", 0.2], ["E5", 0.4], ["D5", 0.2], ["C5", 0.2],
      ["B4", 0.6], ["C5", 0.2], ["D5", 0.4], ["E5", 0.4],
      ["C5", 0.4], ["A4", 0.4], ["A4", 0.4], ["D5", 0.4],
      ["D5", 0.2], ["F5", 0.2], ["A4", 0.4], ["G5", 0.2], ["F5", 0.2],
      ["E5", 0.6], ["C5", 0.2], ["E5", 0.4], ["D5", 0.2], ["C5", 0.2],
      ["B4", 0.4], ["B4", 0.2], ["C5", 0.2], ["D5", 0.4], ["E5", 0.4],
      ["C5", 0.4], ["A4", 0.4], ["A4", 0.4],
    ],
  },
  {
    name: "Für Elise (8-bit)",
    notes: [
      ["E5", 0.25], ["D5", 0.25], ["E5", 0.25], ["D5", 0.25], ["E5", 0.25],
      ["B4", 0.25], ["D5", 0.25], ["C5", 0.25], ["A4", 0.5],
      ["C4", 0.25], ["E4", 0.25], ["A4", 0.25], ["B4", 0.5],
      ["E4", 0.25], ["G4", 0.25], ["B4", 0.25], ["C5", 0.5],
      ["E4", 0.25], ["E5", 0.25], ["D5", 0.25], ["E5", 0.25], ["D5", 0.25], ["E5", 0.25],
      ["B4", 0.25], ["D5", 0.25], ["C5", 0.25], ["A4", 0.5],
    ],
  },
  {
    name: "Greensleeves (chiptune)",
    notes: [
      ["A4", 0.3], ["C5", 0.6], ["D5", 0.3], ["E5", 0.45], ["F5", 0.15], ["E5", 0.3],
      ["D5", 0.6], ["B4", 0.3], ["G4", 0.45], ["A4", 0.15], ["B4", 0.3],
      ["C5", 0.6], ["A4", 0.3], ["A4", 0.45], ["G4", 0.15], ["A4", 0.3],
      ["B4", 0.6], ["G4", 0.3], ["E4", 0.6],
      ["A4", 0.3], ["C5", 0.6], ["D5", 0.3], ["E5", 0.45], ["F5", 0.15], ["E5", 0.3],
      ["D5", 0.6], ["B4", 0.3], ["G4", 0.45], ["A4", 0.15], ["B4", 0.3],
      ["C5", 0.45], ["B4", 0.15], ["A4", 0.3], ["G4", 0.45], ["A4", 0.15], ["B4", 0.3],
      ["A4", 0.9],
    ],
  },
  {
    name: "Ode to Joy",
    notes: [
      ["E4", 0.4], ["E4", 0.4], ["F4", 0.4], ["G4", 0.4],
      ["G4", 0.4], ["F4", 0.4], ["E4", 0.4], ["D4", 0.4],
      ["C4", 0.4], ["C4", 0.4], ["D4", 0.4], ["E4", 0.4],
      ["E4", 0.6], ["D4", 0.2], ["D4", 0.8],
      ["E4", 0.4], ["E4", 0.4], ["F4", 0.4], ["G4", 0.4],
      ["G4", 0.4], ["F4", 0.4], ["E4", 0.4], ["D4", 0.4],
      ["C4", 0.4], ["C4", 0.4], ["D4", 0.4], ["E4", 0.4],
      ["D4", 0.6], ["C4", 0.2], ["C4", 0.8],
    ],
  },
  {
    name: "Swan Lake",
    notes: [
      ["A4", 0.3], ["B4", 0.3], ["C5", 0.6], ["B4", 0.3], ["A4", 0.3],
      ["G4", 0.6], ["A4", 0.3], ["B4", 0.3], ["C5", 0.6],
      ["E5", 0.3], ["D5", 0.3], ["C5", 0.6], ["B4", 0.3], ["A4", 0.3],
      ["G4", 0.6], ["A4", 0.3], ["B4", 0.3],
      ["A4", 0.3], ["B4", 0.3], ["C5", 0.6], ["D5", 0.3], ["E5", 0.3],
      ["C5", 0.6], ["B4", 0.3], ["A4", 0.3], ["G4", 0.9],
    ],
  },
  {
    name: "Nocturne (Chopin)",
    notes: [
      ["E4", 0.6], ["G4", 0.3], ["C5", 0.3], ["B4", 0.6],
      ["A4", 0.3], ["G4", 0.3], ["E4", 0.6], ["D4", 0.3], ["E4", 0.3],
      ["G4", 0.6], ["A4", 0.3], ["G4", 0.3], ["E4", 0.6],
      ["C4", 0.6], ["D4", 0.3], ["E4", 0.3], ["G4", 0.6],
      ["E5", 0.3], ["D5", 0.3], ["C5", 0.6], ["B4", 0.3], ["A4", 0.3],
      ["G4", 0.6], ["E4", 0.6],
    ],
  },
];

const RetroMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * MELODIES.length));
  const ctxRef = useRef<AudioContext | null>(null);
  const timeoutIds = useRef<number[]>([]);
  const autoplayAttempted = useRef(false);

  const stopAudio = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  const playMelody = useCallback((idx: number) => {
    if (ctxRef.current) {
      // stop existing first
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
      ctxRef.current.close();
      ctxRef.current = null;
    }

    const melody = MELODIES[idx].notes;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.08;
    gainNode.connect(ctx.destination);

    const melodyDuration = melody.reduce((sum, [, dur]) => sum + dur, 0);

    const scheduleLoop = (startTime: number) => {
      let t = startTime;
      for (const [note, dur] of melody) {
        const freq = NOTES[note];
        if (!freq) { t += dur; continue; }
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = freq;

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(1, t);
        noteGain.gain.exponentialRampToValueAtTime(0.3, t + dur * 0.8);
        noteGain.gain.linearRampToValueAtTime(0, t + dur);

        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      }
      return t;
    };

    // Schedule several loops ahead to avoid gaps
    let nextStart = ctx.currentTime;
    const LOOKAHEAD = 3; // schedule 3 loops ahead
    for (let i = 0; i < LOOKAHEAD; i++) {
      nextStart = scheduleLoop(nextStart);
    }

    const loopFn = () => {
      // Keep scheduling more loops as time passes
      while (nextStart - ctx.currentTime < melodyDuration * 2) {
        nextStart = scheduleLoop(nextStart);
      }
      const id = window.setTimeout(loopFn, melodyDuration * 1000);
      timeoutIds.current.push(id);
    };
    const id = window.setTimeout(loopFn, melodyDuration * 1000);
    timeoutIds.current.push(id);
    setPlaying(true);
  }, []);

  // Auto-play on first user interaction
  useEffect(() => {
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;

    const startOnInteraction = () => {
      playMelody(trackIndex);
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
    };

    window.addEventListener("click", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);
    window.addEventListener("touchstart", startOnInteraction);

    return () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
    };
  }, [playMelody]);

  const toggle = () => {
    if (playing) stopAudio();
    else playMelody(trackIndex);
  };

  const nextTrack = () => {
    const next = (trackIndex + 1) % MELODIES.length;
    setTrackIndex(next);
    if (playing) playMelody(next);
  };

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {playing && (
        <span className="font-mono text-[10px] text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5 hidden md:block">
          ♪ {MELODIES[trackIndex].name}
        </span>
      )}
      {playing && (
        <button
          onClick={nextTrack}
          className="bg-card border border-border rounded-full p-2.5 shadow-lg hover:border-primary/50 transition-colors"
          title="Next track"
        >
          <SkipForward className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      )}
      <button
        onClick={toggle}
        className="bg-card border border-border rounded-full p-3 shadow-lg hover:border-primary/50 transition-colors group"
        title={playing ? "Mute music" : "Play retro music"}
      >
        {playing ? (
          <Volume2 className="w-5 h-5 text-primary animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>
    </div>
  );
};

export default RetroMusicPlayer;
