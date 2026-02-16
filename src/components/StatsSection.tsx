import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

const stats = [
  { label: "GitHub Stars", value: 190, suffix: "+" },
  { label: "Open Source Repos", value: 20, suffix: "+" },
  { label: "Years on GitHub", value: 16, suffix: "" },
  { label: "Arctic Vault Contributor", value: 1, suffix: "x", isSpecial: true },
];

const StatsSection = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatItem = ({
  stat,
  delay,
}: {
  stat: (typeof stats)[0];
  delay: number;
}) => {
  const { count, ref } = useCountUp(stat.value);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="font-mono text-3xl md:text-4xl font-bold text-primary mb-2">
        {count}
        {stat.suffix}
      </div>
      <div className="text-muted-foreground text-sm">{stat.label}</div>
    </motion.div>
  );
};

export default StatsSection;
