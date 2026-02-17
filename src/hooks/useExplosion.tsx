import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  duration: number;
  emoji?: string;
}

const COLORS = [
  "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#22c55e",
  "#ec4899", "#f97316", "#3b82f6", "#14b8a6", "#eab308",
];

interface ExplosionConfig {
  particleCount?: number;
  emojis?: string[];
  radius?: number;
  label?: string;
}

export const useExplosion = () => {
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number; particles: Particle[]; label?: string }[]>([]);

  const explode = useCallback((x: number, y: number, config: ExplosionConfig = {}) => {
    const {
      particleCount = 40,
      emojis = [],
      radius = 200,
      label,
    } = config;

    const id = Date.now() + Math.random();
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = radius * 0.4 + Math.random() * radius * 0.6;
      const useEmoji = emojis.length > 0 && Math.random() < 0.3;
      particles.push({
        id: i,
        x: 0,
        y: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 3 + Math.random() * 8,
        angle,
        distance,
        duration: 0.8 + Math.random() * 1.2,
        emoji: useEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
      });
    }

    setExplosions((prev) => [...prev, { id, x, y, particles, label }]);
    setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== id));
    }, 3000);
  }, []);

  const ExplosionRenderer = useCallback(() => (
    <AnimatePresence>
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="fixed pointer-events-none"
          style={{ left: explosion.x, top: explosion.y, zIndex: 9999 }}
        >
          {/* Flash */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 100,
              height: 100,
              x: -50,
              y: -50,
              background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(245,158,11,0.4) 40%, transparent 70%)",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Ring */}
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              width: 40,
              height: 40,
              x: -20,
              y: -20,
              borderColor: "rgba(245, 158, 11, 0.6)",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Particles */}
          {explosion.particles.map((p) => {
            const tx = Math.cos(p.angle) * p.distance;
            const ty = Math.sin(p.angle) * p.distance;
            return (
              <motion.div
                key={p.id}
                className="absolute"
                style={{
                  width: p.emoji ? "auto" : p.size,
                  height: p.emoji ? "auto" : p.size,
                  fontSize: p.emoji ? `${12 + Math.random() * 16}px` : undefined,
                  backgroundColor: p.emoji ? undefined : p.color,
                  borderRadius: p.emoji ? undefined : "50%",
                  boxShadow: p.emoji ? undefined : `0 0 ${p.size * 2}px ${p.color}`,
                  x: -p.size / 2,
                  y: -p.size / 2,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: tx,
                  y: ty + 40,
                  opacity: 0,
                  scale: p.emoji ? [1, 1.5, 0] : [1, 0.3],
                }}
                transition={{
                  duration: p.duration,
                  ease: "easeOut",
                }}
              >
                {p.emoji || null}
              </motion.div>
            );
          })}

          {/* Sparkle trails */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12;
            return (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: "#fff" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: [0, Math.cos(angle) * 60, Math.cos(angle) * 120],
                  y: [0, Math.sin(angle) * 60, Math.sin(angle) * 120 + 30],
                  opacity: [1, 0.8, 0],
                  scale: [1, 0.5, 0],
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            );
          })}

          {/* Label */}
          {explosion.label && (
            <motion.p
              className="absolute font-serif font-bold text-center whitespace-nowrap"
              style={{ x: "-50%", color: "#f59e0b", textShadow: "0 0 20px rgba(245,158,11,0.8)" }}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -80, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <span className="text-2xl md:text-4xl">{explosion.label}</span>
            </motion.p>
          )}
        </div>
      ))}
    </AnimatePresence>
  ), [explosions]);

  return { explode, ExplosionRenderer };
};
