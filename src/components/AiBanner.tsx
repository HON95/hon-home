import { Bot } from "lucide-react";
import { motion } from "framer-motion";

const AiBanner = () => {
  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
        <Bot className="w-5 h-5 animate-bounce" />
        <span>
          🤖 This entire website is completely useless — 100% AI-generated with random content because the owner was too lazy to make one themselves. Nothing here is real. You've been warned.
        </span>
        <span className="text-lg">🗑️</span>
      </div>
    </motion.div>
  );
};

export default AiBanner;
