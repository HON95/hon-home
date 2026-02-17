import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fishImg from "@/assets/fish-easter-egg.png";
import { useExplosion } from "@/hooks/useExplosion";

const FishEasterEgg = () => {
  const [visible, setVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [fishPos, setFishPos] = useState({ x: 0, y: 50 });
  const [fishExploded, setFishExploded] = useState(false);
  const { explode, ExplosionRenderer } = useExplosion();

  useEffect(() => {
    const schedule = () => {
      if (fishExploded) return;
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
  }, [fishExploded]);

  const handleClick = (e: React.MouseEvent) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      // FISH EXPLOSION
      setFishExploded(true);
      setVisible(false);
      explode(e.clientX, e.clientY, {
        particleCount: 50,
        radius: 250,
        emojis: ["🐟", "🐠", "🐡", "🎣", "🌊", "💦", "🫧", "✨"],
        label: "🐟 CELINE NOOO! 🐟",
      });
      setTimeout(() => explode(e.clientX + 40, e.clientY - 30, {
        particleCount: 25,
        radius: 180,
        emojis: ["🐟", "💀", "🫧"],
      }), 400);

      // Respawn after a while
      setTimeout(() => {
        setFishExploded(false);
        setClickCount(0);
      }, 15000);
    } else {
      // Small splash on each click
      explode(e.clientX, e.clientY, {
        particleCount: 12,
        radius: 80,
        emojis: ["💦", "🫧", "✨"],
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && !fishExploded && (
          <motion.div
            className="fixed z-40 pointer-events-auto cursor-pointer select-none"
            style={{ top: `${fishPos.y}%` }}
            initial={{ x: "calc(100vw + 100px)" }}
            animate={{ x: "-100px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 8, ease: "linear" }}
            onClick={handleClick}
            title="🐟 You found Celine the Mackerel! Click her!"
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
            {clickCount > 0 && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-primary font-bold whitespace-nowrap">
                🐟 Celine ×{clickCount}
                {clickCount >= 3 && " ⚠️"}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <ExplosionRenderer />
    </>
  );
};

export default FishEasterEgg;
