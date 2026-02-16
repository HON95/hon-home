import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { Github, ExternalLink } from "lucide-react";
import useTypewriter from "@/hooks/useTypewriter";
import FloatingParticles from "@/components/FloatingParticles";

const roles = [
  "Infrastructure Engineer",
  "Open Source Contributor",
  "Prometheus Exporter Builder",
  "Homelab Enthusiast",
  "Rust & Go Developer",
];

const HeroSection = () => {
  const typedText = useTypewriter(roles, 70, 40, 2500);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-4">
            ~/håvard-ose-nordstrand
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            HON
          </h1>

          {/* Typewriter */}
          <div className="h-8 md:h-10 mb-8 flex items-center justify-center">
            <span className="font-mono text-base md:text-lg text-primary/80">
              {typedText}
            </span>
            <span className="w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Software engineer & infrastructure enthusiast from Norway.
            Building open-source tools for monitoring, IoT, and networking.
          </p>

          <div className="flex items-center justify-center gap-4 pointer-events-auto">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
