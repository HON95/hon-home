import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const techGroups = [
  {
    label: "Languages",
    items: ["Rust", "Go", "C++", "Python", "Java", "Shell", "TypeScript", "Lua", "YAML (it counts)"],
  },
  {
    label: "Infrastructure",
    items: ["Prometheus", "Grafana", "Docker", "Linux", "Networking", "Ansible", "Terraform", "Kubernetes", "BGP"],
  },
  {
    label: "Interests",
    items: ["IoT", "Monitoring", "Homelab", "Open Source", "DNS", "IPv6", "Home Automation", "LAN Parties", "Elden Ring"],
  },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TechSection = () => {
  const [shuffled, setShuffled] = useState(techGroups);

  useEffect(() => {
    setShuffled(techGroups.map(g => ({ ...g, items: shuffle(g.items) })));
  }, []);

  const reshuffle = () => {
    setShuffled(techGroups.map(g => ({ ...g, items: shuffle(g.items) })));
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-mono text-primary text-sm tracking-widest uppercase">
              # Tech & Skills
            </h2>
            <button
              onClick={reshuffle}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              title="Shuffle!"
            >
              🎲 shuffle
            </button>
          </div>
          <div className="h-px bg-border mb-10" />

          <div className="grid md:grid-cols-3 gap-10">
            {shuffled.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold text-foreground mb-4">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <motion.span
                      key={item}
                      layout
                      className="font-mono text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground border border-border"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechSection;
