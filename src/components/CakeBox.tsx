import { useState, useCallback } from "react";
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

const CakeBox = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [taunt, setTaunt] = useState("🎂 Free cake! Click me!");
  const [attempts, setAttempts] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hidingSpot, setHidingSpot] = useState<{ section: string; style: React.CSSProperties } | null>(null);

  const dodge = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= HIDE_AT && !hidden) {
      // Hide behind a page element
      setHidden(true);
      const spots = [
        { section: "Behind the footer", style: { position: "fixed" as const, bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 40 } },
        { section: "Peeking from the corner", style: { position: "fixed" as const, bottom: "100px", right: "-40px", zIndex: 40 } },
        { section: "Above the music player", style: { position: "fixed" as const, bottom: "70px", right: "120px", zIndex: 40 } },
        { section: "Top left corner", style: { position: "fixed" as const, top: "60px", left: "-30px", zIndex: 40 } },
      ];
      const spot = spots[Math.floor(Math.random() * spots.length)];
      setHidingSpot(spot);
      setTaunt(hideTaunts[Math.floor(Math.random() * hideTaunts.length)]);
      return;
    }

    if (newAttempts >= ESCAPE_AT && !escaped) {
      setEscaped(true);
      setTaunt(escapeTaunts[Math.floor(Math.random() * escapeTaunts.length)]);
      // Random position on viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos({ x: Math.random() * (vw - 200) - vw / 2 + 100, y: Math.random() * (vh - 200) - vh / 2 + 100 });
      return;
    }

    if (escaped) {
      setTaunt(escapeTaunts[Math.floor(Math.random() * escapeTaunts.length)]);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos({ x: Math.random() * (vw - 240), y: Math.random() * (vh - 100) });
    } else {
      setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
      const maxX = 250;
      const maxY = 80;
      setPos({ x: Math.random() * maxX * 2 - maxX, y: Math.random() * maxY * 2 - maxY });
    }
  }, [attempts, escaped, hidden]);

  const dodgeHidden = useCallback(() => {
    // Found it! It runs away again
    setHidden(false);
    setHidingSpot(null);
    setEscaped(true);
    setAttempts((a) => a + 1);
    setTaunt("You found me?! NO!");
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({ x: Math.random() * (vw - 240), y: Math.random() * (vh - 100) });
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
              {/* Box-contained cake (before escape) */}
              {!escaped && !hidden && (
                <motion.button
                  className="absolute bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 transition-colors z-10"
                  animate={{ x: pos.x, y: pos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={dodge}
                  onTouchStart={dodge}
                  onClick={dodge}
                >
                  {taunt}
                </motion.button>
              )}

              {/* Empty box message after escape */}
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
              {attempts >= 10 && !hidden && (
                <span className="absolute bottom-3 left-4 font-mono text-xs text-muted-foreground/50">
                  The cake was never real.
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Escaped cake - roams the viewport */}
      <AnimatePresence>
        {escaped && !hidden && (
          <motion.button
            className="fixed bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 transition-colors backdrop-blur-sm shadow-lg"
            style={{ zIndex: 90, top: 0, left: 0 }}
            animate={{ x: pos.x, y: pos.y }}
            initial={{ scale: 1.2, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            onClick={dodge}
          >
            {taunt}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hidden cake - peeking from a corner */}
      <AnimatePresence>
        {hidden && hidingSpot && (
          <motion.button
            className="bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-2 rounded-lg font-serif text-sm font-medium cursor-pointer select-none hover:bg-amber-400/20 transition-colors backdrop-blur-sm shadow-lg"
            style={hidingSpot.style}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 0.7, scale: 1, rotate: Math.random() > 0.5 ? 5 : -5 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 0.5, delay: 1.5 }}
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
