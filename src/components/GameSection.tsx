import { motion, AnimatePresence } from "framer-motion";
import { useState, lazy, Suspense, useEffect, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

const TetrisGame = lazy(() => import("@/components/TetrisGame"));
const SnakeGame = lazy(() => import("@/components/SnakeGame"));
const PongGame = lazy(() => import("@/components/PongGame"));
const BreakoutGame = lazy(() => import("@/components/BreakoutGame"));
const MinesweeperGame = lazy(() => import("@/components/MinesweeperGame"));
const FlappyBirdGame = lazy(() => import("@/components/FlappyBirdGame"));
const Game2048 = lazy(() => import("@/components/Game2048"));

const games = ["Tetris", "Snake", "Pong", "Breakout", "Minesweeper", "Flappy Bird", "2048"] as const;

const GameSection = () => {
  const [activeGame, setActiveGame] = useState<typeof games[number]>("Tetris");
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), []);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const renderGame = () => {
    switch (activeGame) {
      case "Tetris": return <TetrisGame />;
      case "Snake": return <SnakeGame />;
      case "Pong": return <PongGame />;
      case "Breakout": return <BreakoutGame />;
      case "Minesweeper": return <MinesweeperGame />;
      case "Flappy Bird": return <FlappyBirdGame />;
      case "2048": return <Game2048 />;
    }
  };

  const gameContent = (
    <>
      {/* Game tabs */}
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {games.map((game) => (
          <button
            key={game}
            onClick={() => setActiveGame(game)}
            className={`font-mono text-sm px-4 py-1.5 rounded-md border transition-colors ${
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
    </>
  );

  return (
    <>
      <section id="games" className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-primary text-sm tracking-widest uppercase">
                # Arcade
              </h2>
              <button
                onClick={toggleFullscreen}
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                title="Fullscreen mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="h-px bg-border mb-4" />
            <p className="text-muted-foreground text-sm mb-6">
              Rest at this bonfire, Tarnished. The music is already playing. 🔥
            </p>

            {!fullscreen && gameContent}
          </motion.div>
        </div>
      </section>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={toggleFullscreen}
                className="bg-card border border-border rounded-full p-3 shadow-lg hover:border-primary/50 transition-colors group"
                title="Exit fullscreen (Esc)"
              >
                <Minimize2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>

            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="font-mono text-primary text-sm tracking-widest uppercase">
                # Arcade — {activeGame}
              </span>
            </div>

            <div className="w-full max-w-4xl px-6 pt-14">
              {gameContent}
            </div>

            <p className="absolute bottom-4 font-mono text-xs text-muted-foreground">
              Press <span className="text-primary">Esc</span> to return to the bonfire
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameSection;
