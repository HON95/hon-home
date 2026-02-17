import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Trophy, RotateCcw } from "lucide-react";
import { useBossMusic } from "@/hooks/useBossMusic";

interface Question {
  question: string;
  options: string[];
  answer: number;
  lore: string;
}

const questions: Question[] = [
  {
    question: "What is the name of the first boss in Dark Souls?",
    options: ["Taurus Demon", "Asylum Demon", "Capra Demon", "Bell Gargoyles"],
    answer: 1,
    lore: "The Asylum Demon guards the Northern Undead Asylum, wielding a massive hammer.",
  },
  {
    question: "Who says 'Praise the Sun!'?",
    options: ["Patches", "Siegmeyer", "Solaire of Astora", "Andre of Astora"],
    answer: 2,
    lore: "Solaire is a Warrior of Sunlight, forever seeking his own sun. \\\\[T]/",
  },
  {
    question: "What do you burn at a bonfire in Dark Souls?",
    options: ["Souls", "Humanity", "Embers", "Titanite"],
    answer: 1,
    lore: "Burning Humanity at bonfires kindles them, increasing your Estus Flask uses.",
  },
  {
    question: "Which Dark Souls boss guards the entrance to Blighttown?",
    options: ["Quelaag", "Capra Demon", "Gaping Dragon", "Ceaseless Discharge"],
    answer: 1,
    lore: "The Capra Demon ambushes you in a tiny room with two dogs. A rite of passage.",
  },
  {
    question: "What is the Darksign?",
    options: ["A weapon", "A curse branded on the Undead", "A covenant symbol", "A bonfire upgrade"],
    answer: 1,
    lore: "The Darksign is a ring of fire branded upon the Undead, binding them to an endless cycle of death.",
  },
  {
    question: "In Dark Souls, what happens when you 'go Hollow'?",
    options: ["You gain power", "You lose your humanity", "You become a boss", "You unlock a secret area"],
    answer: 1,
    lore: "Hollowing is the loss of purpose and will. \"Don't you dare go Hollow.\"",
  },
  {
    question: "Which character is known for pushing you off cliffs?",
    options: ["Solaire", "Siegward", "Patches", "Frampt"],
    answer: 2,
    lore: "Trusty Patches has been kicking players into holes across every Souls game. Never trust him.",
  },
  {
    question: "What do you ring in Dark Souls to progress the story?",
    options: ["The Bells of Awakening", "The Chime of Want", "The Archstone Bell", "The Lordvessel"],
    answer: 0,
    lore: "Two Bells of Awakening must be rung — one above in the Undead Church, one below in Blighttown.",
  },
  {
    question: "Who is the final boss of Dark Souls III?",
    options: ["Nameless King", "Soul of Cinder", "Slave Knight Gael", "Gwyn"],
    answer: 1,
    lore: "The Soul of Cinder is an amalgamation of all Lords of Cinder, including Gwyn himself.",
  },
  {
    question: "What currency do you use to level up in Dark Souls?",
    options: ["Runes", "Echoes", "Souls", "Embers"],
    answer: 2,
    lore: "Souls are the essence of life in Lordran — and you'll lose them. A lot.",
  },
  {
    question: "Which Dark Souls boss is fought on a bridge and breathes fire?",
    options: ["Seath the Scaleless", "Kalameet", "Hellkite Drake", "Midir"],
    answer: 2,
    lore: "The Hellkite Drake (Red Dragon) terrorizes the bridge in Undead Burg, roasting the unprepared.",
  },
  {
    question: "What is Siegmeyer of Catarina's iconic armor shaped like?",
    options: ["A barrel", "An onion", "A pumpkin", "A cauldron"],
    answer: 1,
    lore: "Siegmeyer's Catarina armor is affectionately called 'Onion Knight' armor by the community. Hmmmm...",
  },
];

const deathMessages = [
  "YOU DIED... intellectually.",
  "Skill issue.",
  "Try again, Undead.",
  "Git gud (at trivia).",
  "You have gone Hollow.",
];

const praiseMessages = [
  "Very good!",
  "Praise the Sun! \\[T]/",
  "A worthy Undead!",
  "Humanity Restored!",
  "VICTORY ACHIEVED",
];

const SoulsQuizSection = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const { play: playBossMusic, stop: stopBossMusic } = useBossMusic();

  const TOTAL_QUESTIONS = 7;

  const pickRandomQuestions = () => {
    const indices: number[] = [];
    while (indices.length < TOTAL_QUESTIONS) {
      const r = Math.floor(Math.random() * questions.length);
      if (!indices.includes(r)) indices.push(r);
    }
    return indices;
  };

  const startQuiz = () => {
    const picked = pickRandomQuestions();
    setUsedIndices(picked);
    setStarted(true);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
    playBossMusic();
  };

  // Stop boss music when quiz ends
  useEffect(() => {
    if (finished) stopBossMusic();
  }, [finished, stopBossMusic]);

  const q = started ? questions[usedIndices[currentQ]] : null;
  const isCorrect = selected !== null && q && selected === q.answer;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q!.answer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= TOTAL_QUESTIONS) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const getTitle = () => {
    const pct = score / TOTAL_QUESTIONS;
    if (pct === 1) return "Lord of Cinder";
    if (pct >= 0.85) return "Chosen Undead";
    if (pct >= 0.7) return "Ashen One";
    if (pct >= 0.5) return "Undead Warrior";
    if (pct >= 0.3) return "Hollow";
    return "Deprived";
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Souls Quiz
          </h2>
          <div className="h-px bg-border mb-10" />

          <AnimatePresence mode="wait">
            {!started && !finished && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Skull className="w-12 h-12 text-amber-400/80 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Test Your Souls Knowledge
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  {TOTAL_QUESTIONS} questions from the Dark Souls universe.
                  Prove you're no Hollow.
                </p>
                <button
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-medium hover:bg-amber-400/20 transition-colors font-serif"
                >
                  <Skull className="w-4 h-4" />
                  Touch the Fog Gate
                </button>
              </motion.div>
            )}

            {started && !finished && q && (
              <motion.div
                key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-muted-foreground">
                    {currentQ + 1} / {TOTAL_QUESTIONS}
                  </span>
                  <span className="font-mono text-xs text-amber-400/70">
                    Souls: {score}
                  </span>
                </div>
                <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "hsl(45, 80%, 55%)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Question */}
                <h3 className="font-serif text-lg text-foreground mb-6 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {q.options.map((opt, idx) => {
                    let borderClass = "border-border hover:border-primary/40";
                    if (showResult) {
                      if (idx === q.answer) borderClass = "border-green-500/60 bg-green-500/10";
                      else if (idx === selected && idx !== q.answer) borderClass = "border-red-500/60 bg-red-500/10";
                      else borderClass = "border-border opacity-50";
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={selected !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${borderClass} ${
                          selected === null ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span className="text-sm text-foreground">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <p className={`font-serif text-sm mb-2 ${isCorrect ? "text-amber-400" : "text-red-400"}`}>
                        {isCorrect
                          ? praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
                          : deathMessages[Math.floor(Math.random() * deathMessages.length)]}
                      </p>
                      <p className="text-muted-foreground text-xs italic leading-relaxed">
                        {q.lore}
                      </p>
                      <button
                        onClick={nextQuestion}
                        className="mt-4 font-mono text-sm text-primary hover:underline"
                      >
                        {currentQ + 1 < TOTAL_QUESTIONS ? "Continue →" : "See Results →"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {finished && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="font-serif text-3xl text-foreground mb-1">
                  {getTitle()}
                </h3>
                <p className="text-amber-400/70 font-mono text-sm mb-4">
                  {score} / {TOTAL_QUESTIONS} souls collected
                </p>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  {score === TOTAL_QUESTIONS
                    ? "You have proven yourself worthy. The Age of Fire continues."
                    : score >= TOTAL_QUESTIONS * 0.7
                    ? "A worthy warrior. The First Flame burns brighter."
                    : score >= TOTAL_QUESTIONS * 0.4
                    ? "You survived, barely. Perhaps try leveling up?"
                    : "YOU DIED. Repeatedly. Maybe try the wiki first?"}
                </p>
                <button
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-medium hover:bg-amber-400/20 transition-colors font-serif"
                >
                  <RotateCcw className="w-4 h-4" />
                  Touch the Fog Gate Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SoulsQuizSection;
