import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Trophy, RotateCcw } from "lucide-react";
import { musicEvents } from "@/lib/musicEvents";

interface Question {
  question: string;
  options: string[];
  answer: number;
  lore: string;
}

type GameKey = "ds1" | "ds2" | "ds3" | "er";

const GAME_LABELS: Record<GameKey, string> = {
  ds1: "Dark Souls",
  ds2: "Dark Souls II",
  ds3: "Dark Souls III",
  er: "Elden Ring",
};

const questionPools: Record<GameKey, Question[]> = {
  ds1: [
    { question: "What is the first boss in Dark Souls?", options: ["Taurus Demon", "Asylum Demon", "Capra Demon", "Bell Gargoyles"], answer: 1, lore: "The Asylum Demon guards the Northern Undead Asylum with a massive hammer." },
    { question: "Who says 'Praise the Sun!'?", options: ["Patches", "Siegmeyer", "Solaire of Astora", "Andre of Astora"], answer: 2, lore: "Solaire is a Warrior of Sunlight, forever seeking his own sun. \\\\[T]/" },
    { question: "What do you burn at a bonfire?", options: ["Souls", "Humanity", "Embers", "Titanite"], answer: 1, lore: "Burning Humanity at bonfires kindles them, increasing your Estus Flask uses." },
    { question: "Which boss guards the entrance to Blighttown?", options: ["Quelaag", "Capra Demon", "Gaping Dragon", "Ceaseless Discharge"], answer: 1, lore: "The Capra Demon ambushes you in a tiny room with two dogs. A rite of passage." },
    { question: "What is the Darksign?", options: ["A weapon", "A curse branded on the Undead", "A covenant symbol", "A bonfire upgrade"], answer: 1, lore: "The Darksign is a ring of fire branded upon the Undead, binding them to an endless cycle." },
    { question: "What happens when you 'go Hollow'?", options: ["You gain power", "You lose your humanity", "You become a boss", "You unlock a secret area"], answer: 1, lore: "Hollowing is the loss of purpose and will. \"Don't you dare go Hollow.\"" },
    { question: "Which character pushes you off cliffs?", options: ["Solaire", "Siegward", "Patches", "Frampt"], answer: 2, lore: "Trusty Patches has been kicking players into holes across every Souls game." },
    { question: "What do you ring to progress the story?", options: ["Bells of Awakening", "Chime of Want", "Archstone Bell", "The Lordvessel"], answer: 0, lore: "Two Bells of Awakening must be rung — one above, one below in Blighttown." },
    { question: "What is Siegmeyer's armor shaped like?", options: ["A barrel", "An onion", "A pumpkin", "A cauldron"], answer: 1, lore: "Siegmeyer's Catarina armor is affectionately called 'Onion Knight' armor. Hmmmm..." },
    { question: "Which dragon is fought on a bridge in Undead Burg?", options: ["Seath the Scaleless", "Kalameet", "Hellkite Drake", "Gaping Dragon"], answer: 2, lore: "The Hellkite Drake terrorizes the bridge, roasting the unprepared." },
    { question: "Who is the final boss of Dark Souls?", options: ["Seath", "Nito", "Gwyn, Lord of Cinder", "Manus"], answer: 2, lore: "Gwyn linked the First Flame and hollowed, becoming a husk of his former glory." },
    { question: "What covenant lets you invade as a dark spirit?", options: ["Warriors of Sunlight", "Darkwraith", "Way of White", "Forest Hunter"], answer: 1, lore: "The Darkwraiths serve the Dark and invade other worlds to steal humanity." },
  ],
  ds2: [
    { question: "What is the hub area in Dark Souls II?", options: ["Firelink Shrine", "Majula", "The Nexus", "Roundtable Hold"], answer: 1, lore: "Majula is a coastal village bathed in perpetual sunset, your home between deaths." },
    { question: "Who levels you up in Dark Souls II?", options: ["Firekeeper", "Emerald Herald", "Maiden in Black", "Melina"], answer: 1, lore: "The Emerald Herald says 'Bearer of the curse... Seek souls. Larger, more powerful souls.'" },
    { question: "What replaces Humanity in Dark Souls II?", options: ["Embers", "Human Effigy", "Runes", "Insight"], answer: 1, lore: "Human Effigies restore your human form and can be burned at bonfires to block invasions." },
    { question: "Which Dark Souls II boss is a giant rat?", options: ["Royal Rat Authority", "Smelter Demon", "Pursuer", "Covetous Demon"], answer: 0, lore: "The Royal Rat Authority is a massive rat that guards the Rat King's domain." },
    { question: "What happens to your max HP when you die in DS2?", options: ["Nothing", "It decreases", "It increases", "It resets"], answer: 1, lore: "Each death reduces your max HP until you reach 50% (or 75% with the Ring of Binding)." },
    { question: "What is the Pursuer known for?", options: ["Being easy", "Chasing you across multiple areas", "Healing you", "Selling items"], answer: 1, lore: "The Pursuer relentlessly hunts the Bearer of the Curse across Drangleic." },
    { question: "Which DLC features the Fume Knight?", options: ["Crown of the Sunken King", "Crown of the Old Iron King", "Crown of the Ivory King", "Scholar of the First Sin"], answer: 1, lore: "Fume Knight Raime is considered one of the hardest bosses in the series." },
    { question: "What stat governs rolling speed in DS2?", options: ["Endurance", "Vitality", "Adaptability", "Dexterity"], answer: 2, lore: "Adaptability raises Agility, which determines i-frames during rolls. A DS2-exclusive mechanic." },
    { question: "Who sits on the Throne of Want?", options: ["Vendrick", "Nashandra", "Aldia", "The Bearer of the Curse"], answer: 3, lore: "The Bearer of the Curse may choose to sit the throne and link the flame... or walk away." },
    { question: "What is the name of King Vendrick's kingdom?", options: ["Lordran", "Drangleic", "Lothric", "Boletaria"], answer: 1, lore: "Drangleic was built upon older kingdoms, each built on the ruins of the last. Cycles within cycles." },
  ],
  ds3: [
    { question: "Who is the final boss of Dark Souls III?", options: ["Nameless King", "Soul of Cinder", "Slave Knight Gael", "Aldrich"], answer: 1, lore: "The Soul of Cinder is an amalgamation of all Lords of Cinder, including Gwyn himself." },
    { question: "Which boss devoured gods?", options: ["Vordt", "Aldrich, Devourer of Gods", "Yhorm the Giant", "Abyss Watchers"], answer: 1, lore: "Aldrich consumed Gwyndolin and uses his body as a puppet during the boss fight." },
    { question: "What item do you use to restore your Ember form?", options: ["Humanity", "Human Effigy", "Ember", "Insight"], answer: 2, lore: "Embers restore your full HP and enable online play. They glow like cinders of the First Flame." },
    { question: "What is the hub area in Dark Souls III?", options: ["Majula", "The Nexus", "Firelink Shrine", "Roundtable Hold"], answer: 2, lore: "Firelink Shrine returns as the central hub, housing the Firekeeper and various NPCs." },
    { question: "Which boss fights with a storm ruler weapon?", options: ["Dancer", "Yhorm the Giant", "Pontiff Sulyvahn", "Dragonslayer Armour"], answer: 1, lore: "Yhorm can be defeated easily with the Storm Ruler found in his boss room. A callback to Demon's Souls." },
    { question: "Who are the Abyss Watchers inspired by?", options: ["Gwyn", "Artorias of the Abyss", "Ornstein", "Havel"], answer: 1, lore: "The Abyss Watchers followed Artorias's legacy, fighting the Abyss with wolf blood." },
    { question: "What is the Ringed City?", options: ["A PvP arena", "The final DLC area", "A covenant hub", "An optional area in the base game"], answer: 1, lore: "The Ringed City exists at the very end of time, where all lands converge." },
    { question: "Which boss has two phases — one as a dancer?", options: ["Pontiff Sulyvahn", "Dancer of the Boreal Valley", "Twin Princes", "Friede"], answer: 1, lore: "The Dancer's graceful, delayed attacks have ended countless runs." },
    { question: "How many phases does Sister Friede have?", options: ["One", "Two", "Three", "Four"], answer: 2, lore: "Just when you think it's over... a third phase begins. 'When the Ashes are two, a flame alieth.'" },
    { question: "Who is the secret boss of Archdragon Peak?", options: ["Ancient Wyvern", "Nameless King", "King of the Storm", "Havel Knight"], answer: 1, lore: "The Nameless King is believed to be Gwyn's firstborn, who allied with the dragons." },
  ],
  er: [
    { question: "Which boss is known as the 'Blade of Miquella'?", options: ["Radahn", "Malenia", "Morgott", "Rennala"], answer: 1, lore: "Malenia has never known defeat — and she will remind you. Repeatedly." },
    { question: "What are the golden trails that guide you?", options: ["Grace Lines", "Guidance of Gold", "Rays of Grace", "Sites of Grace"], answer: 3, lore: "Sites of Grace rest points guide the Tarnished across the Lands Between." },
    { question: "What currency do you use to level up?", options: ["Souls", "Echoes", "Runes", "Embers"], answer: 2, lore: "Runes are the currency of the Lands Between — and you'll lose them. A lot." },
    { question: "What creature do players call a 'dog'?", options: ["Wolves", "Turtles", "Rats", "Crabs"], answer: 1, lore: "\"Could this be a dog?\" — Every message next to a turtle. Every. Single. One." },
    { question: "What is the Lands Between ruled by?", options: ["The Great Runes", "The Erdtree", "The Darksign", "The First Flame"], answer: 1, lore: "The Erdtree is a colossal golden tree that blesses the Lands Between with its grace." },
    { question: "Who is your maiden in Elden Ring?", options: ["Ranni", "Melina", "Fia", "Roderika"], answer: 1, lore: "Melina offers to be your maiden and guides you to the Erdtree. Her story runs deeper than it seems." },
    { question: "What do you become when chosen by grace?", options: ["Ashen One", "Tarnished", "Bearer of the Curse", "Chosen Undead"], answer: 1, lore: "The Tarnished are those whose grace was once lost, now called back to the Lands Between." },
    { question: "Which demigod commands gravity magic?", options: ["Malenia", "Radahn", "Rykard", "Godrick"], answer: 1, lore: "Starscourge Radahn learned gravity magic to keep riding his beloved horse Leonard." },
    { question: "What is Ranni's questline reward?", options: ["A weapon", "The Age of Stars ending", "A summon spirit", "A talisman"], answer: 1, lore: "Following Ranni's quest leads to the Age of Stars — a new age beyond the Erdtree's influence." },
    { question: "Which boss grafts body parts onto himself?", options: ["Morgott", "Godrick the Grafted", "Radahn", "Rykard"], answer: 1, lore: "Godrick grafts the limbs of his foes onto himself, including a dragon head. 'I command thee, kneel!'" },
    { question: "Where is the Roundtable Hold?", options: ["In Limgrave", "Outside the Lands Between", "At the Erdtree", "In Caelid"], answer: 1, lore: "The Roundtable Hold exists outside the Lands Between, a sanctuary for Tarnished." },
    { question: "What is 'Let Me Solo Her' famous for?", options: ["Speedrunning", "Defeating Malenia naked with two katanas", "Finding a secret boss", "A mod"], answer: 1, lore: "A legendary player who helped thousands defeat Malenia wearing only a pot on their head." },
  ],
};

const deathMessages: Record<GameKey, string[]> = {
  ds1: ["YOU DIED... intellectually.", "Skill issue.", "Try again, Undead.", "Git gud (at trivia).", "You have gone Hollow."],
  ds2: ["YOU DIED... and lost max HP.", "Bearer of the curse... bearer of wrong answers.", "Seek souls. Larger, more correct souls.", "Adaptability too low.", "Petrified."],
  ds3: ["YOU DIED... Ashen One.", "Unkindled and incorrect.", "Return to the bonfire, Ashen One.", "The fire fades... and so does your score.", "Skill issue."],
  er: ["YOU DIED... Tarnished.", "Maidenless answer.", "Put these foolish ambitions to rest.", "No Runes for you.", "Grace lost."],
};

const praiseMessages: Record<GameKey, string[]> = {
  ds1: ["Very good!", "Praise the Sun! \\[T]/", "Humanity Restored!", "VICTORY ACHIEVED", "A worthy Undead!"],
  ds2: ["Very good!", "GREAT SOUL EMBRACED", "Bearer... you are worthy.", "Sublime!", "Effigy restored!"],
  ds3: ["Very good!", "LORD OF CINDER FALLEN", "Ember restored!", "Ashen One, well done!", "HEIR OF FIRE DESTROYED"],
  er: ["Very good!", "GREAT FOE FELLED", "A worthy Tarnished!", "Grace restored!", "DEMIGOD FELLED"],
};

const titleRanks: Record<GameKey, [number, string][]> = {
  ds1: [[1, "Lord of Cinder"], [0.85, "Chosen Undead"], [0.7, "Darkwraith"], [0.5, "Undead Warrior"], [0.3, "Hollow"], [0, "Deprived"]],
  ds2: [[1, "Monarch of Drangleic"], [0.85, "Bearer of the Curse"], [0.7, "Undead Knight"], [0.5, "Hollow Soldier"], [0.3, "Lost Undead"], [0, "Deprived"]],
  ds3: [[1, "Lord of Hollows"], [0.85, "Ashen One"], [0.7, "Unkindled"], [0.5, "Ember"], [0.3, "Hollow"], [0, "Deprived"]],
  er: [[1, "Elden Lord"], [0.85, "Tarnished Champion"], [0.7, "Tarnished"], [0.5, "Finger Maiden"], [0.3, "Wretch"], [0, "Maidenless"]],
};

const endMessages: Record<GameKey, [number, string][]> = {
  ds1: [[1, "You have proven yourself worthy. The Age of Fire continues."], [0.7, "A worthy warrior. The First Flame burns brighter."], [0.4, "You survived, barely. Perhaps try leveling up?"], [0, "YOU DIED. Repeatedly. Maybe try the wiki first?"]],
  ds2: [[1, "The throne awaits. You are the true monarch."], [0.7, "Bearer of the Curse, you show promise."], [0.4, "Seek souls. Larger, more powerful souls."], [0, "You went Hollow in Majula. The pigs judge you."]],
  ds3: [[1, "The First Flame bows to your knowledge."], [0.7, "Ashen One, your fire burns bright."], [0.4, "The fire fades, but you persist."], [0, "Unkindled and unworthy. Return to the bonfire."]],
  er: [[1, "Rise, Tarnished. You are Elden Lord."], [0.7, "The Erdtree acknowledges you."], [0.4, "Your grace flickers, but holds."], [0, "Maidenless behavior. The Erdtree rejects you."]],
};

const TOTAL_QUESTIONS = 7;

const SoulsQuizSection = () => {
  const [game, setGame] = useState<GameKey>("ds1");
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const pool = questionPools[game];
  const questionsCount = Math.min(TOTAL_QUESTIONS, pool.length);

  const pickRandomQuestions = () => {
    const indices: number[] = [];
    while (indices.length < questionsCount) {
      const r = Math.floor(Math.random() * pool.length);
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
    musicEvents.emit("start-boss-music");
  };

  useEffect(() => {
    if (finished) {
      musicEvents.emit("stop-boss-music");
    }
  }, [finished]);

  // If player skips away from boss music mid-quiz, just let it go
  useEffect(() => {
    const unsub = musicEvents.on("boss-music-stopped", () => {
      // Boss music was skipped by user — no action needed
    });
    return unsub;
  }, []);

  const q = started ? pool[usedIndices[currentQ]] : null;
  const isCorrect = selected !== null && q && selected === q.answer;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q!.answer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questionsCount) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const getTitle = () => {
    const pct = score / questionsCount;
    for (const [threshold, title] of titleRanks[game]) {
      if (pct >= threshold) return title;
    }
    return "Deprived";
  };

  const getEndMessage = () => {
    const pct = score / questionsCount;
    for (const [threshold, msg] of endMessages[game]) {
      if (pct >= threshold) return msg;
    }
    return "YOU DIED.";
  };

  const switchGame = (g: GameKey) => {
    if (started && !finished) {
      musicEvents.emit("stop-boss-music");
    }
    setGame(g);
    setStarted(false);
    setFinished(false);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
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
          <div className="h-px bg-border mb-6" />

          {/* Game tabs */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap">
            {(Object.keys(GAME_LABELS) as GameKey[]).map((key) => (
              <button
                key={key}
                onClick={() => switchGame(key)}
                className={`font-mono text-xs px-4 py-1.5 rounded-md border transition-colors ${
                  game === key
                    ? "bg-amber-400/15 text-amber-400 border-amber-400/40"
                    : "bg-card text-muted-foreground border-border hover:border-amber-400/30"
                }`}
              >
                {GAME_LABELS[key]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!started && !finished && (
              <motion.div
                key={`intro-${game}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Skull className="w-12 h-12 text-amber-400/80 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  {GAME_LABELS[game]} Quiz
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  {questionsCount} questions from {GAME_LABELS[game]}.
                  Prove your worth.
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
                key={`q-${game}-${currentQ}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-muted-foreground">
                    {currentQ + 1} / {questionsCount}
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
                    animate={{ width: `${((currentQ + 1) / questionsCount) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <h3 className="font-serif text-lg text-foreground mb-6 leading-relaxed">
                  {q.question}
                </h3>

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

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <p className={`font-serif text-sm mb-2 ${isCorrect ? "text-amber-400" : "text-red-400"}`}>
                        {isCorrect
                          ? praiseMessages[game][Math.floor(Math.random() * praiseMessages[game].length)]
                          : deathMessages[game][Math.floor(Math.random() * deathMessages[game].length)]}
                      </p>
                      <p className="text-muted-foreground text-xs italic leading-relaxed">
                        {q.lore}
                      </p>
                      <button
                        onClick={nextQuestion}
                        className="mt-4 font-mono text-sm text-primary hover:underline"
                      >
                        {currentQ + 1 < questionsCount ? "Continue →" : "See Results →"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {finished && (
              <motion.div
                key={`results-${game}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="font-serif text-3xl text-foreground mb-1">
                  {getTitle()}
                </h3>
                <p className="text-amber-400/70 font-mono text-sm mb-4">
                  {score} / {questionsCount} souls collected
                </p>
                <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                  {getEndMessage()}
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
