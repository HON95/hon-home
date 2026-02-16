import { motion } from "framer-motion";
import { useState, lazy, Suspense } from "react";

const TetrisGame = lazy(() => import("@/components/TetrisGame"));
const SnakeGame = lazy(() => import("@/components/SnakeGame"));
const PongGame = lazy(() => import("@/components/PongGame"));
const BreakoutGame = lazy(() => import("@/components/BreakoutGame"));
const MinesweeperGame = lazy(() => import("@/components/MinesweeperGame"));

const games = ["Tetris", "Snake", "Pong", "Breakout", "Minesweeper"] as const;

const GameSection = () => {
  const [activeGame, setActiveGame] = useState<typeof games[number]>("Tetris");

  const renderGame = () => {
    switch (activeGame) {
      case "Tetris": return <TetrisGame />;
      case "Snake": return <SnakeGame />;
      case "Pong": return <PongGame />;
      case "Breakout": return <BreakoutGame />;
      case "Minesweeper": return <MinesweeperGame />;
    }
  };

  return (
    <section id="games" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-primary text-sm tracking-widest uppercase mb-3">
            # Arcade
          </h2>
          <div className="h-px bg-border mb-4" />
          <p className="text-muted-foreground text-sm mb-6">
            Take a break. The music is already playing. 🎵
          </p>

          {/* Game tabs */}
          <div className="flex gap-2 mb-8 justify-center flex-wrap">
            {games.map((game) => (
              <button
                key={game}
                onClick={() => setActiveGame(game)}
                className={`font-mono text-sm px-5 py-2 rounded-md border transition-colors ${
                  activeGame === game
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <Suspense fallback={<div className="font-mono text-xs text-muted-foreground">Loading...</div>}>
              {renderGame()}
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameSection;
