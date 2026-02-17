import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const soapstoneMessages = [
  "Try finger, but hole",
  "Could this be a dog?",
  "Why is it always suffering?",
  "No skill ahead",
  "Behold, Tarnished!",
  "Seek grace, O Tarnished",
  "If only I had a giant, but hole",
  "Visions of Elden Ring...",
  "Didn't expect edge, lord",
  "Fort, night",
  "Offer rump",
  "Time for crab",
  "Liar ahead",
  "Hidden path ahead (there isn't one)",
  "Try jumping (don't)",
  "Dog? (it's a turtle)",
  "Praise the sun! \\[T]/",
  "YOU DIED",
  "Humanity Restored",
  "BONFIRE LIT",
  "Illusory wall ahead",
  "Amazing chest ahead",
  "Be wary of left",
  "I can't take this...",
];

const positions = [
  { top: "15%", left: "5%" },
  { top: "25%", right: "8%" },
  { bottom: "30%", left: "3%" },
  { bottom: "20%", right: "5%" },
  { top: "45%", left: "2%" },
  { top: "60%", right: "3%" },
  { bottom: "45%", left: "6%" },
  { top: "75%", right: "6%" },
];

const EldenRingEasterEgg = () => {
  const [activeMessage, setActiveMessage] = useState<{ text: string; pos: typeof positions[0]; id: number } | null>(null);

  const showMessage = useCallback(() => {
    const text = soapstoneMessages[Math.floor(Math.random() * soapstoneMessages.length)];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    const id = Date.now();
    setActiveMessage({ text, pos, id });
    const duration = text === "YOU DIED" || text === "BONFIRE LIT" || text === "Humanity Restored" ? 4000 : 3000;
    setTimeout(() => setActiveMessage((m) => (m?.id === id ? null : m)), duration);
  }, []);

  useEffect(() => {
    // Show first message after 20-40s, then every 25-50s
    const initialDelay = 20000 + Math.random() * 20000;
    const initialTimer = setTimeout(() => {
      showMessage();
      const interval = setInterval(() => {
        showMessage();
      }, 25000 + Math.random() * 25000);
      return () => clearInterval(interval);
    }, initialDelay);
    return () => clearTimeout(initialTimer);
  }, [showMessage]);

  return (
    <AnimatePresence>
      {activeMessage && (
        <motion.div
          key={activeMessage.id}
          className="fixed z-[90] pointer-events-none select-none"
          style={activeMessage.pos}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          {activeMessage.text === "YOU DIED" ? (
            <div className="fixed inset-0 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-red-950/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.p
                className="relative font-serif text-4xl md:text-6xl text-red-500 font-bold tracking-wider"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1.2 }}
                style={{ textShadow: "0 0 40px rgba(220, 38, 38, 0.6)" }}
              >
                YOU DIED
              </motion.p>
            </div>
          ) : activeMessage.text === "BONFIRE LIT" ? (
            <div className="fixed inset-0 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-amber-950/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.p
                className="relative font-serif text-3xl md:text-5xl text-amber-400 font-bold tracking-wider"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1 }}
                style={{ textShadow: "0 0 30px rgba(245, 158, 11, 0.5)" }}
              >
                🔥 BONFIRE LIT
              </motion.p>
            </div>
          ) : activeMessage.text === "Humanity Restored" ? (
            <div className="fixed inset-0 flex items-center justify-center">
              <motion.p
                className="relative font-serif text-2xl md:text-4xl text-amber-200/90 italic tracking-wide"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                Humanity Restored
              </motion.p>
            </div>
          ) : (
            <div className="bg-card/80 backdrop-blur-sm border border-amber-900/30 rounded px-4 py-2 shadow-lg max-w-[250px]">
              <p className="font-serif text-amber-400/90 text-sm italic leading-relaxed">
                {activeMessage.text}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-600/60 text-[10px]">📜 Soapstone Message</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EldenRingEasterEgg;
