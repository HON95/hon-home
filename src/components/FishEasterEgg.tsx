import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fishImg from "@/assets/fish-easter-egg.png";

const TRAIL_COUNT = 8;

const FishEasterEgg = () => {
  const [visible, setVisible] = useState(false);
  const [fishPos, setFishPos] = useState({ x: 0, y: 50 });
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const trailId = useRef(0);
  const fishRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const schedule = () => {
      setFishPos({ x: 0, y: 20 + Math.random() * 60 });
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    };

    const timer = setInterval(() => schedule(), 25000 + Math.random() * 20000);
    const initial = setTimeout(() => {
      setFishPos({ x: 0, y: 40 + Math.random() * 30 });
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    }, 10000);

    return () => { clearInterval(timer); clearTimeout(initial); };
  }, []);

  // Emit trail bubbles while visible
  useEffect(() => {
    if (!visible) { setTrail([]); return; }
    const interval = setInterval(() => {
      if (!fishRef.current) return;
      const rect = fishRef.current.getBoundingClientRect();
      const id = trailId.current++;
      setTrail(prev => [
        ...prev.slice(-TRAIL_COUNT),
        { id, x: rect.right - 8, y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 20 },
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Bubble trail */}
          {trail.map((b) => (
            <motion.span
              key={b.id}
              className="fixed pointer-events-none text-sm select-none"
              style={{ left: b.x, top: b.y, zIndex: 39 }}
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 0.3, x: 30, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              🫧
            </motion.span>
          ))}

          <motion.div
            ref={fishRef}
            className="fixed z-40 pointer-events-auto cursor-pointer select-none"
            style={{ top: `${fishPos.y}%` }}
            initial={{ x: "calc(100vw + 100px)" }}
            animate={{ x: "-100px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 8, ease: "linear" }}
            title="🐟 Celine the Mackerel"
          >
            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
              style={{
                backgroundImage: `url(${fishImg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              animate={{ y: [0, -10, 0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-primary font-bold whitespace-nowrap opacity-80">
              🐟 Celine
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FishEasterEgg;
