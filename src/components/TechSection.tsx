import { motion } from "framer-motion";

const techGroups = [
  {
    label: "Languages",
    items: ["Rust", "Go", "C++", "Python", "Java", "Shell"],
  },
  {
    label: "Infrastructure",
    items: ["Prometheus", "Grafana", "Docker", "Linux", "Networking"],
  },
  {
    label: "Interests",
    items: ["IoT", "Monitoring", "Homelab", "Open Source"],
  },
];

const TechSection = () => {
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
            # Tech & Skills
          </h2>
          <div className="h-px bg-border mb-10" />

          <div className="grid md:grid-cols-3 gap-10">
            {techGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold text-foreground mb-4">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground border border-border"
                    >
                      {item}
                    </span>
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
