import { motion } from "framer-motion";
import { MapPin, Terminal, Server } from "lucide-react";

const AboutSection = () => {
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
            # About
          </h2>
          <div className="h-px bg-border mb-10" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Based in Norway</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Working with infrastructure, networking, and open-source tooling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Terminal className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Open Source</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Contributing to monitoring tools, Prometheus exporters, and community projects.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Server className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Infrastructure</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Passionate about systems, networking, IoT sensors, and homelab setups.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
