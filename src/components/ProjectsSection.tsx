import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";

const projects = [
  {
    name: "prometheus-nut-exporter",
    description: "A Prometheus exporter for Network UPS Tools (NUT)",
    language: "Rust",
    stars: 133,
    forks: 18,
    url: "https://github.com/HON95/prometheus-nut-exporter",
  },
  {
    name: "prometheus-esp8266-dht-exporter",
    description: "A Prometheus exporter for Arduino using a DHT sensor",
    language: "C++",
    stars: 42,
    forks: 17,
    url: "https://github.com/HON95/prometheus-esp8266-dht-exporter",
  },
  {
    name: "prometheus-ethermine-exporter",
    description: "A Prometheus exporter for Ethermine and related mining pools",
    language: "Go",
    stars: 10,
    forks: 4,
    url: "https://github.com/HON95/prometheus-ethermine-exporter",
  },
  {
    name: "wiki",
    description: "Personal wiki with technical notes and documentation",
    language: "Shell",
    stars: 5,
    forks: 0,
    url: "https://github.com/HON95/wiki",
  },
];

const langColor: Record<string, string> = {
  Rust: "bg-orange-400",
  "C++": "bg-pink-400",
  Go: "bg-cyan-400",
  Shell: "bg-green-400",
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Projects
          </h2>
          <div className="h-px bg-border mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${langColor[project.language] || "bg-muted-foreground"}`} />
                  {project.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  {project.stars}
                </span>
                {project.forks > 0 && (
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    {project.forks}
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
