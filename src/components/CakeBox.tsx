import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const taunts = [
  "Too slow!",
  "Nice try!",
  "The cake is a lie.",
  "Git gud.",
  "You Died.",
  "Nope.",
  "Almost!",
  "Not today.",
  "Skill issue.",
  "Try rolling.",
  "Dodge this.",
  "🎂❌",
];

const CakeBox = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [taunt, setTaunt] = useState("🎂 Free cake! Click me!");
  const [attempts, setAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const dodge = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const maxX = rect.width - 180;
    const maxY = rect.height - 60;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    setPos({ x: newX, y: newY });
    setAttempts((a) => a + 1);
    setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
  }, []);

  return (
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

          <div
            ref={containerRef}
            className="relative h-64 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center"
          >
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
  );
};

export default CakeBox;
