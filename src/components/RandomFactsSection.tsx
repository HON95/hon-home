import { motion } from "framer-motion";
import { Cpu, Wifi, Thermometer, HardDrive, Zap, Code, Globe, Wrench } from "lucide-react";

const facts = [
  {
    icon: Cpu,
    title: "Monitors UPS Batteries",
    text: "Built a Prometheus exporter for Network UPS Tools written in Rust — 133+ stars and counting.",
  },
  {
    icon: Thermometer,
    title: "Reads Room Temperature",
    text: "Connected an ESP8266 Arduino with a DHT sensor to Prometheus. Because why check a thermometer when you can check Grafana?",
  },
  {
    icon: Wifi,
    title: "Networking Nerd",
    text: "Maintains a personal wiki with notes on everything from VLAN trunking to BGP peering. Yes, for fun.",
  },
  {
    icon: HardDrive,
    title: "Homelab Operator",
    text: "Runs enough servers at home to heat a small apartment. The electricity bill is a feature, not a bug.",
  },
  {
    icon: Zap,
    title: "Arctic Code Vault",
    text: "Has code preserved in the GitHub Arctic Code Vault in Svalbard. Literally frozen code in a Norwegian mountain.",
  },
  {
    icon: Code,
    title: "Polyglot Programmer",
    text: "Writes Rust, Go, C++, Python, Java, and Shell. Picks the language based on how much pain they want that day.",
  },
  {
    icon: Globe,
    title: "The Gathering Volunteer",
    text: "Part of the crew at The Gathering — one of the world's largest LAN parties held in Norway.",
  },
  {
    icon: Wrench,
    title: "Config Hoarder",
    text: "Has a dedicated repo just for dotfiles and configs. Because losing your .vimrc is a personal crisis.",
  },
];

const RandomFactsSection = () => {
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
            # Random Facts
          </h2>
          <div className="h-px bg-border mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.title}
              className="group bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_hsl(170_60%_50%/0.1)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <fact.icon className="w-5 h-5 text-primary mt-0.5 shrink-0 group-hover:animate-pulse" />
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{fact.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{fact.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RandomFactsSection;
