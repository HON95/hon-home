import { useCallback, useEffect, useRef, useState } from "react";

const W = 280;
const H = 400;
const BIRD_R = 12;
const PIPE_W = 40;
const GAP = 120;
const GRAVITY = 0.4;
const FLAP = -6.5;
const PIPE_SPEED = 2.5;

type Pipe = { x: number; topH: number };

const FlappyBirdGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    birdY: H / 2,
    velocity: 0,
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
  });
  const rafRef = useRef(0);

  const flap = useCallback(() => {
    if (!started || gameOver) return;
    stateRef.current.velocity = FLAP;
  }, [started, gameOver]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    s.frame++;
    s.velocity += GRAVITY;
    s.birdY += s.velocity;

    // Spawn pipes
    if (s.frame % 90 === 0) {
      const topH = 50 + Math.random() * (H - GAP - 100);
      s.pipes.push({ x: W, topH });
    }

    // Move pipes
    for (const pipe of s.pipes) {
      pipe.x -= PIPE_SPEED;
    }

    // Score
    for (const pipe of s.pipes) {
      if (pipe.x + PIPE_W < W / 4 && pipe.x + PIPE_W >= W / 4 - PIPE_SPEED) {
        s.score++;
        setScore(s.score);
      }
    }

    // Remove off-screen pipes
    s.pipes = s.pipes.filter((p) => p.x + PIPE_W > -10);

    // Collision
    const birdX = W / 4;
    if (s.birdY + BIRD_R > H || s.birdY - BIRD_R < 0) {
      setGameOver(true);
      return;
    }
    for (const pipe of s.pipes) {
      if (birdX + BIRD_R > pipe.x && birdX - BIRD_R < pipe.x + PIPE_W) {
        if (s.birdY - BIRD_R < pipe.topH || s.birdY + BIRD_R > pipe.topH + GAP) {
          setGameOver(true);
          return;
        }
      }
    }

    // Draw
    ctx.fillStyle = "hsl(220, 20%, 10%)";
    ctx.fillRect(0, 0, W, H);

    // Pipes
    ctx.fillStyle = "hsl(140, 60%, 35%)";
    for (const pipe of s.pipes) {
      ctx.fillRect(pipe.x, 0, PIPE_W, pipe.topH);
      ctx.fillRect(pipe.x, pipe.topH + GAP, PIPE_W, H - pipe.topH - GAP);
      // Pipe caps
      ctx.fillStyle = "hsl(140, 60%, 45%)";
      ctx.fillRect(pipe.x - 3, pipe.topH - 12, PIPE_W + 6, 12);
      ctx.fillRect(pipe.x - 3, pipe.topH + GAP, PIPE_W + 6, 12);
      ctx.fillStyle = "hsl(140, 60%, 35%)";
    }

    // Bird
    ctx.fillStyle = "hsl(45, 90%, 60%)";
    ctx.beginPath();
    ctx.arc(birdX, s.birdY, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = "hsl(220, 20%, 10%)";
    ctx.beginPath();
    ctx.arc(birdX + 4, s.birdY - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        stateRef.current.velocity = FLAP;
      }
    };
    window.addEventListener("keydown", handler);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener("keydown", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [started, gameOver, gameLoop]);

  const restart = () => {
    const s = stateRef.current;
    s.birdY = H / 2;
    s.velocity = 0;
    s.pipes = [];
    s.score = 0;
    s.frame = 0;
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full" style={{ maxWidth: W }}>
        <span className="font-mono text-xs text-muted-foreground">SCORE</span>
        <span className="font-mono text-sm text-primary font-bold">{score}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border border-border rounded-md"
        onClick={flap}
        onTouchStart={(e) => { e.preventDefault(); flap(); }}
      />

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && <p className="font-mono text-destructive text-sm mb-2">GAME OVER — Score: {score}</p>}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start Flappy Bird"}
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Space/↑ or tap to flap
      </p>
    </div>
  );
};

export default FlappyBirdGame;
