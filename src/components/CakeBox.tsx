import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExplosion } from "@/hooks/useExplosion";

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
const EXPLODE_AT = 18;

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
  const [exploded, setExploded] = useState(false);
  const hidingRotation = useRef(0);
  const { explode, ExplosionRenderer } = useExplosion();

  const dodge = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Final explosion
    if (newAttempts >= EXPLODE_AT && !exploded) {
      setExploded(true);
      setEscaped(false);
      setHidden(false);
      const clientX = e && "clientX" in e ? e.clientX : freePos.x;
      const clientY = e && "clientY" in e ? e.clientY : freePos.y;
      // Triple explosion
      explode(clientX, clientY, { particleCount: 60, radius: 300, emojis: ["🎂", "🍰", "🎉", "🎆", "✨", "💥", "🔥"], label: "💥 THE CAKE EXPLODED 💥" });
      setTimeout(() => explode(clientX - 80, clientY - 40, { particleCount: 30, radius: 200, emojis: ["🎂", "🍰", "🧁"] }), 300);
      setTimeout(() => explode(clientX + 60, clientY + 30, { particleCount: 30, radius: 200, emojis: ["🎉", "🎆", "⭐"] }), 600);
      return;
    }

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
  }, [attempts, escaped, hidden, exploded, freePos, explode]);

  const dodgeHidden = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= EXPLODE_AT) {
      setExploded(true);
      setHidden(false);
      setEscaped(false);
      const clientX = e && "clientX" in e ? e.clientX : freePos.x;
      const clientY = e && "clientY" in e ? e.clientY : freePos.y;
      explode(clientX, clientY, { particleCount: 60, radius: 300, emojis: ["🎂", "🍰", "🎉", "🎆", "✨", "💥", "🔥"], label: "💥 THE CAKE EXPLODED 💥" });
      setTimeout(() => explode(clientX - 80, clientY - 40, { particleCount: 30, radius: 200, emojis: ["🎂", "🍰", "🧁"] }), 300);
      setTimeout(() => explode(clientX + 60, clientY + 30, { particleCount: 30, radius: 200, emojis: ["🎉", "🎆", "⭐"] }), 600);
      return;
    }

    setHidden(false);
    setTaunt("You found me?! NO!");
    setFreePos(clampedRandom());
  }, [attempts, freePos, explode]);

  const reset = useCallback(() => {
    setAttempts(0);
    setExploded(false);
    setEscaped(false);
    setHidden(false);
    setBoxPos({ x: 0, y: 0 });
    setTaunt("🎂 Free cake! Click me!");
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
              {!escaped && !hidden && !exploded && (
                <motion.button
                  className="absolute bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 transition-colors z-10"
                  animate={{ x: boxPos.x, y: boxPos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={(e) => dodge(e)}
                  onTouchStart={(e) => dodge(e)}
                  onClick={(e) => dodge(e)}
                >
                  {taunt}
                </motion.button>
              )}

              {(escaped || hidden) && !exploded && (
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

              {exploded && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="font-serif text-amber-400 text-lg mb-2">💥 The cake has been destroyed 💥</p>
                  <p className="text-muted-foreground text-xs mb-4">It took {attempts} attempts. It was never real anyway.</p>
                  <button
                    onClick={reset}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    Respawn cake?
                  </button>
                </motion.div>
              )}

              {attempts > 0 && !exploded && (
                <span className="absolute bottom-3 right-4 font-mono text-xs text-muted-foreground/50">
                  Attempts: {attempts}
                </span>
              )}
              {attempts >= 10 && !hidden && !exploded && (
                <span className="absolute bottom-3 left-4 font-mono text-xs text-muted-foreground/50">
                  The cake was never real.
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {escaped && !hidden && !exploded && (
          <motion.button
            key="escaped-cake"
            className="fixed bg-amber-400/10 border border-amber-400/30 text-amber-400 px-6 py-3 rounded-lg font-serif font-medium cursor-pointer select-none hover:bg-amber-400/20 backdrop-blur-sm shadow-lg"
            style={{ zIndex: 90, top: 0, left: 0 }}
            animate={{ x: freePos.x, y: freePos.y }}
            initial={{ x: freePos.x, y: freePos.y, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.8 }}
            onMouseEnter={(e) => dodge(e)}
            onTouchStart={(e) => dodge(e)}
            onClick={(e) => dodge(e)}
          >
            {taunt}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hidden && !exploded && (
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
            onClick={(e) => dodgeHidden(e)}
            onMouseEnter={(e) => dodgeHidden(e)}
          >
            🎂 ...
          </motion.button>
        )}
      </AnimatePresence>

      <ExplosionRenderer />
    </>
  );
};

export default CakeBox;
