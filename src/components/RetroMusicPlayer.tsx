import { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";
import { musicEvents } from "@/lib/musicEvents";

const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.0,
  A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  G4: 392.0, Ab4: 415.30, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99,
  // Bass
  A2: 110.0, E2: 82.41,
};

type TrackType = "chiptune" | "boss";

interface Track {
  name: string;
  type: TrackType;
  notes: [string, number][];
  bass?: [string, number][];
}

const TRACKS: Track[] = [
  {
    name: "Korobeiniki",
    type: "chiptune",
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
    type: "chiptune",
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
    type: "chiptune",
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
    type: "chiptune",
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
    type: "chiptune",
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
    type: "chiptune",
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

// Boss theme — kept separate, injected on demand
const BOSS_TRACK: Track = {
  name: "⚔️ Boss Theme",
  type: "boss",
  notes: [
    ["E3", 0.6], ["E3", 0.3], ["E3", 0.3], ["G3", 0.6],
    ["A3", 0.3], ["B3", 0.3], ["C4", 0.6], ["B3", 0.3], ["A3", 0.3],
    ["E3", 0.9], ["E3", 0.3],
    ["E4", 0.4], ["Eb4", 0.4], ["D4", 0.4], ["C4", 0.4],
    ["B3", 0.6], ["C4", 0.3], ["D4", 0.3],
    ["E4", 0.6], ["D4", 0.3], ["C4", 0.3],
    ["B3", 0.6], ["A3", 0.3], ["B3", 0.3],
    ["E4", 0.2], ["E4", 0.2], ["G4", 0.2], ["E4", 0.2],
    ["D4", 0.2], ["E4", 0.2], ["G4", 0.4],
    ["A4", 0.3], ["G4", 0.3], ["E4", 0.3], ["D4", 0.3],
    ["C4", 0.6], ["D4", 0.3], ["E4", 0.3],
    ["B4", 0.6], ["A4", 0.3], ["G4", 0.3],
    ["E4", 0.4], ["D4", 0.4], ["C4", 0.4],
    ["B3", 0.4], ["A3", 0.4], ["E3", 0.8],
  ],
  bass: [
    ["A2", 1.2], ["E2", 1.2], ["C3", 1.2], ["D3", 0.6], ["E2", 0.6],
    ["A2", 1.2], ["E2", 0.6], ["A2", 0.6], ["C3", 1.2],
    ["D3", 1.2], ["E2", 1.2], ["A2", 1.2],
  ],
};

const RetroMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * TRACKS.length));
  const [isBossMode, setIsBossMode] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timeoutIds = useRef<number[]>([]);
  const previousTrackRef = useRef<number>(0);

  const stopAudio = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch {}
      ctxRef.current = null;
    }
    setPlaying(false);
  }, []);

  const playTrack = useCallback((track: Track) => {
    // Stop any existing audio
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch {}
      ctxRef.current = null;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.value = track.type === "boss" ? 0.12 : 0.08;
    masterGain.connect(ctx.destination);

    const melodyDur = track.notes.reduce((s, [, d]) => s + d, 0);

    const scheduleNotes = (notes: [string, number][], start: number, waveform: OscillatorType, envelope: "chiptune" | "boss") => {
      let t = start;
      for (const [note, dur] of notes) {
        const freq = NOTES[note];
        if (!freq) { t += dur; continue; }
        const osc = ctx.createOscillator();
        osc.type = waveform;
        osc.frequency.value = freq;
        const noteGain = ctx.createGain();

        if (envelope === "boss") {
          noteGain.gain.setValueAtTime(0.6, t);
          noteGain.gain.exponentialRampToValueAtTime(0.15, t + dur * 0.7);
          noteGain.gain.linearRampToValueAtTime(0, t + dur);
        } else {
          noteGain.gain.setValueAtTime(1, t);
          noteGain.gain.exponentialRampToValueAtTime(0.3, t + dur * 0.8);
          noteGain.gain.linearRampToValueAtTime(0, t + dur);
        }

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      }
      return t;
    };

    const scheduleBass = (start: number) => {
      if (!track.bass) return;
      const bassDur = track.bass.reduce((s, [, d]) => s + d, 0);
      const loops = Math.ceil(melodyDur / bassDur);
      let t = start;
      for (let l = 0; l < loops; l++) {
        for (const [note, dur] of track.bass) {
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

    const waveform: OscillatorType = track.type === "boss" ? "sawtooth" : "square";
    const envelope = track.type === "boss" ? "boss" as const : "chiptune" as const;

    let nextStart = ctx.currentTime;
    const LOOKAHEAD = 3;
    for (let i = 0; i < LOOKAHEAD; i++) {
      scheduleBass(nextStart);
      nextStart = scheduleNotes(track.notes, nextStart, waveform, envelope);
    }

    const loopFn = () => {
      while (nextStart - ctx.currentTime < melodyDur * 2) {
        scheduleBass(nextStart);
        nextStart = scheduleNotes(track.notes, nextStart, waveform, envelope);
      }
      const id = window.setTimeout(loopFn, melodyDur * 1000);
      timeoutIds.current.push(id);
    };
    const id = window.setTimeout(loopFn, melodyDur * 1000);
    timeoutIds.current.push(id);
    setPlaying(true);
  }, []);

  // Listen for boss music events
  useEffect(() => {
    const unsubStart = musicEvents.on("start-boss-music", () => {
      previousTrackRef.current = trackIndex;
      setIsBossMode(true);
      playTrack(BOSS_TRACK);
    });
    const unsubStop = musicEvents.on("stop-boss-music", () => {
      setIsBossMode(false);
      stopAudio();
    });
    return () => { unsubStart(); unsubStop(); };
  }, [trackIndex, playTrack, stopAudio]);

  const currentTrackName = isBossMode ? BOSS_TRACK.name : TRACKS[trackIndex].name;

  const toggle = useCallback(() => {
    if (playing) {
      stopAudio();
      if (isBossMode) {
        musicEvents.emit("boss-music-paused");
      }
    } else {
      if (isBossMode) {
        playTrack(BOSS_TRACK);
      } else {
        playTrack(TRACKS[trackIndex]);
      }
    }
  }, [playing, isBossMode, trackIndex, stopAudio, playTrack]);

  const nextTrack = useCallback(() => {
    if (isBossMode) {
      // Exit boss mode, go to next regular track
      setIsBossMode(false);
      musicEvents.emit("boss-music-stopped");
      const next = (previousTrackRef.current + 1) % TRACKS.length;
      setTrackIndex(next);
      playTrack(TRACKS[next]);
    } else {
      const next = (trackIndex + 1) % TRACKS.length;
      setTrackIndex(next);
      if (playing) playTrack(TRACKS[next]);
    }
  }, [isBossMode, trackIndex, playing, playTrack]);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {playing && (
        <span className="font-mono text-[10px] text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5 hidden md:block">
          ♪ {currentTrackName}
        </span>
      )}
      {playing && (
        <button
          onClick={nextTrack}
          className="bg-card border border-border rounded-full p-2.5 shadow-lg hover:border-primary/50 transition-colors"
          title={isBossMode ? "Skip boss music" : "Next track"}
        >
          <SkipForward className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      )}
      <button
        onClick={toggle}
        className="bg-card border border-border rounded-full p-3 shadow-lg hover:border-primary/50 transition-colors group"
        title={playing ? "Pause music" : "Play music"}
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
