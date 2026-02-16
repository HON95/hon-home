import { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25,
};

const MELODY: [string, number][] = [
  ["E5", 0.4], ["B4", 0.2], ["C5", 0.2], ["D5", 0.4], ["C5", 0.2], ["B4", 0.2],
  ["A4", 0.4], ["A4", 0.2], ["C5", 0.2], ["E5", 0.4], ["D5", 0.2], ["C5", 0.2],
  ["B4", 0.6], ["C5", 0.2], ["D5", 0.4], ["E5", 0.4],
  ["C5", 0.4], ["A4", 0.4], ["A4", 0.4], ["D5", 0.4],
  ["D5", 0.2], ["F4", 0.2], ["A4", 0.4], ["G4", 0.2], ["F4", 0.2],
  ["E4", 0.6], ["C5", 0.2], ["E5", 0.4], ["D5", 0.2], ["C5", 0.2],
  ["B4", 0.4], ["B4", 0.2], ["C5", 0.2], ["D5", 0.4], ["E5", 0.4],
  ["C5", 0.4], ["A4", 0.4], ["A4", 0.4],
];

const RetroMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timeoutIds = useRef<number[]>([]);
  const autoplayAttempted = useRef(false);

  const playMelody = useCallback(() => {
    if (ctxRef.current) return; // already playing
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.08;
    gainNode.connect(ctx.destination);

    const scheduleLoop = (startTime: number) => {
      let t = startTime;
      for (const [note, dur] of MELODY) {
        const freq = NOTES[note];
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

    let nextStart = ctx.currentTime;
    const loopFn = () => {
      nextStart = scheduleLoop(nextStart);
      const delay = (nextStart - ctx.currentTime) * 1000 - 500;
      const id = window.setTimeout(loopFn, Math.max(delay, 100));
      timeoutIds.current.push(id);
    };
    loopFn();
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  // Auto-play on first user interaction
  useEffect(() => {
    if (autoplayAttempted.current) return;
    autoplayAttempted.current = true;

    const startOnInteraction = () => {
      playMelody();
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
    if (playing) stop();
    else playMelody();
  };

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-full p-3 shadow-lg hover:border-primary/50 transition-colors group"
      title={playing ? "Mute music" : "Play retro music"}
    >
      {playing ? (
        <Volume2 className="w-5 h-5 text-primary animate-pulse" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </button>
  );
};

export default RetroMusicPlayer;
