import { motion } from "framer-motion";
import TetrisGame from "@/components/TetrisGame";

const GameSection = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Break Time
          </h2>
          <div className="h-px bg-border mb-4" />
          <p className="text-muted-foreground text-sm mb-8">
            Take a break and play some Tetris. Hit the 🔊 button for the full retro experience.
          </p>

          <div className="flex justify-center">
            <TetrisGame />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameSection;
