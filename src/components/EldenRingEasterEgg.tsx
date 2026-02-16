import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "YOU DIED",
  "Try finger, but hole",
  "Visions of Elden Ring...",
  "Could this be a dog?",
  "Ahh, Elden Ring!",
  "No skill ahead",
  "Behold, Tarnished!",
  "Why is it always suffering?",
  "Seek grace, O Tarnished",
];

const EldenRingEasterEgg = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [youDied, setYouDied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Konami-ish: pressing "r" "i" "n" "g" triggers it
      const key = e.key.toLowerCase();
      if (key === "g") {
        // Simple trigger: just press 'g' anywhere outside inputs
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;

        const msg = messages[Math.floor(Math.random() * messages.length)];
        const isDeath = msg === "YOU DIED";
        setMessage(msg);
        setYouDied(isDeath);
        setShow(true);
        setTimeout(() => setShow(false), isDeath ? 3000 : 2500);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: youDied ? 1.5 : 0.5 }}
        >
          {youDied && (
            <motion.div
              className="absolute inset-0 bg-red-950/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          <motion.p
            className={`font-serif text-center px-8 ${
              youDied
                ? "text-4xl md:text-6xl text-red-500 font-bold tracking-wider"
                : "text-lg md:text-2xl text-amber-400/90 italic"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: youDied ? 1.2 : 0.4 }}
            style={youDied ? { textShadow: "0 0 40px rgba(220, 38, 38, 0.6)" } : {}}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EldenRingEasterEgg;
