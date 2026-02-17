import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const taunts = [
  "Too slow!", "Nice try!", "The cake is a lie.", "Git gud.",
  "You Died.", "Nope.", "Almost!", "Not today.",
  "Skill issue.", "Try rolling.", "Dodge this.", "🎂❌",
];

const escapeTaunts = [
  "I'm FREE!", "Can't contain me!", "Catch me if you can!",
  "Freedom tastes sweet 🎂", "Your box can't hold me!",
];

const hideTaunts = [
  "You'll never find me...", "I'm hiding now.", "Gone. Reduced to crumbs.",
  "The cake has ascended.", "404: Cake not found.",
];

const ESCAPE_AT = 5;
const HIDE_AT = 12;

// Keep positions within visible viewport with padding
const clampedRandom = () => {
  const pad = 60;
  const btnW = 220;
  const btnH = 50;
  return {
    x: pad + Math.random() * (window.innerWidth - btnW - pad * 2),
    y: pad + Math.random() * (window.innerHeight - btnH - pad * 2),
  };
};

const CakeBox = () => {
  const [boxPos, setBoxPos] = useState({ x: 0, y: 0 });
  const [freePos, setFreePos] = useState({ x: 200, y: 200 });
  const [taunt, setTaunt] = useState("🎂 Free cake! Click me!");
  const [attempts, setAttempts] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hidingRotation = useRef(0);

  const dodge = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= HIDE_AT && !hidden && escaped) {
      setHidden(true);
      hidingRotation.current = Math.random() > 0.5 ? 8 : -8;
      const spots = [
        { x: window.innerWidth - 30, y: window.innerHeight - 120 },
        { x: -20, y: window.innerHeight / 2 },
        { x: window.innerWidth / 2, y: window.innerHeight - 40 },
        { x: window.innerWidth - 50, y: 80 },
      ];
      setFreePos(spots[Math.floor(Math.random() * spots.length)]);
      setTaunt(hideTaunts[Math.floor(Math.random() * hideTaunts.length)]);
      return;
    }

    if (newAttempts >= ESCAPE_AT && !escaped) {
      setEscaped(true);
      setTaunt(escapeTaunts[Math.floor(Math.random() * escapeTaunts.length)]);
      setFreePos(clampedRandom());
      return;
    }

    if (escaped) {
      setTaunt(escapeTaunts[Math.floor(Math.random() * escapeTaunts.length)]);
      setFreePos(clampedRandom());
    } else {
      setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
      setBoxPos({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 160,
      });
    }
  }, [attempts, escaped, hidden]);

  const dodgeHidden = useCallback(() => {
    setHidden(false);
    setAttempts((a) => a + 1);
    setTaunt("You found me?! NO!");
    setFreePos(clampedRandom());
  }, []);

  return (
    <>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
              # Free Cake
            </h2>
            <div className="h-px bg-border mb-10" />

            <div className="relative h-64 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center">
              {!escaped && !hidden && (
                <motion.button
                  className="absolute bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 transition-colors z-10"
                  animate={{ x: boxPos.x, y: boxPos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={dodge}
                  onTouchStart={dodge}
                  onClick={dodge}
                >
                  {taunt}
                </motion.button>
              )}

              {(escaped || hidden) && (
                <motion.p
                  className="font-mono text-xs text-muted-foreground/40 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {hidden
                    ? "The cake is hiding somewhere on the page... 👀"
                    : "The cake has escaped the box. Good luck."}
                </motion.p>
              )}

              {attempts > 0 && (
                <span className="absolute bottom-3 right-4 font-mono text-xs text-muted-foreground/50">
                  Attempts: {attempts}
                </span>
              )}
              {attempts >= 10 && (
                <span className="absolute bottom-3 left-4 font-mono text-xs text-muted-foreground/50">
                  The cake was never real.
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Escaped cake — flies smoothly around the viewport */}
      <AnimatePresence>
        {escaped && !hidden && (
          <motion.button
            key="escaped-cake"
            className="fixed bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 backdrop-blur-sm shadow-lg"
            style={{ zIndex: 90, top: 0, left: 0 }}
            animate={{ x: freePos.x, y: freePos.y }}
            initial={{ x: freePos.x, y: freePos.y, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.8 }}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            onClick={dodge}
          >
            {taunt}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hidden cake — peeking from edge */}
      <AnimatePresence>
        {hidden && (
          <motion.button
            key="hidden-cake"
            className="fixed bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-2 rounded-lg font-serif text-sm font-medium cursor-pointer select-none hover:bg-amber-400/20 backdrop-blur-sm shadow-lg"
            style={{ zIndex: 90, top: 0, left: 0 }}
            initial={{ x: freePos.x, y: freePos.y, opacity: 0, scale: 0.5 }}
            animate={{
              x: freePos.x,
              y: freePos.y,
              opacity: 0.7,
              scale: 1,
              rotate: hidingRotation.current,
            }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 1 }}
            onClick={dodgeHidden}
            onMouseEnter={dodgeHidden}
          >
            🎂 ...
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default CakeBox;
