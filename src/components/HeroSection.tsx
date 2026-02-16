import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { Github, ExternalLink } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-4">
            ~/håvard-ose-nordstrand
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            HON
            <span className="text-primary">95</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Software engineer & infrastructure enthusiast from Norway.
            Building open-source tools for monitoring, IoT, and networking.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/HON95"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Projects
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
