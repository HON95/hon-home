import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fishImg from "@/assets/fish-easter-egg.png";

const FishEasterEgg = () => {
  const [visible, setVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [fishPos, setFishPos] = useState({ x: 0, y: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setFishPos({ x: 0, y: 20 + Math.random() * 60 });
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    }, 25000 + Math.random() * 20000);

    const initial = setTimeout(() => {
      setFishPos({ x: 0, y: 40 + Math.random() * 30 });
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    }, 10000);

    return () => { clearInterval(timer); clearTimeout(initial); };
  }, []);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-40 pointer-events-auto cursor-pointer select-none"
          style={{ top: `${fishPos.y}%` }}
          initial={{ x: "calc(100vw + 100px)" }}
          animate={{ x: "-100px" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 8, ease: "linear" }}
          onClick={handleClick}
          title="🐟 You found Celine the Mackerel!"
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
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FishEasterEgg;
