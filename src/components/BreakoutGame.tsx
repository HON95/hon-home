import { useCallback, useEffect, useRef, useState } from "react";

const W = 320;
const H = 400;
const PADDLE_W = 60;
const PADDLE_H = 10;
const BALL_R = 5;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_W = W / BRICK_COLS;
const BRICK_H = 16;
const BRICK_TOP = 40;

const COLORS = [
  "hsl(0, 65%, 55%)",
  "hsl(25, 80%, 55%)",
  "hsl(45, 80%, 55%)",
  "hsl(140, 60%, 45%)",
  "hsl(170, 60%, 50%)",
];

const createBricks = () =>
  Array.from({ length: BRICK_ROWS }, (_, r) =>
    Array.from({ length: BRICK_COLS }, (_, c) => ({
      x: c * BRICK_W,
      y: BRICK_TOP + r * BRICK_H,
      alive: true,
      color: COLORS[r],
    }))
  ).flat();

const BreakoutGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2,
    ballY: H - 40,
    dx: 3,
    dy: -3,
    bricks: createBricks(),
    score: 0,
  });
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef(0);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    // Input
    if (keysRef.current.has("ArrowLeft")) s.paddleX = Math.max(0, s.paddleX - 6);
    if (keysRef.current.has("ArrowRight")) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + 6);

    // Ball movement
    s.ballX += s.dx;
    s.ballY += s.dy;

    // Walls
    if (s.ballX - BALL_R <= 0 || s.ballX + BALL_R >= W) s.dx *= -1;
    if (s.ballY - BALL_R <= 0) s.dy *= -1;

    // Paddle
    if (
      s.ballY + BALL_R >= H - 20 - PADDLE_H &&
      s.ballY + BALL_R <= H - 20 &&
      s.ballX >= s.paddleX &&
      s.ballX <= s.paddleX + PADDLE_W &&
      s.dy > 0
    ) {
      s.dy *= -1;
      const hit = (s.ballX - s.paddleX) / PADDLE_W - 0.5;
      s.dx = hit * 6;
    }

    // Bottom
    if (s.ballY > H) {
      setGameOver(true);
      return;
    }

    // Bricks
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      if (
        s.ballX >= brick.x &&
        s.ballX <= brick.x + BRICK_W &&
        s.ballY - BALL_R <= brick.y + BRICK_H &&
        s.ballY + BALL_R >= brick.y
      ) {
        brick.alive = false;
        s.dy *= -1;
        s.score += 10;
        setScore(s.score);
        break;
      }
    }

    // Win check
    if (s.bricks.every((b) => !b.alive)) {
      setWon(true);
      setGameOver(true);
      return;
    }

    // Draw
    ctx.fillStyle = "hsl(220, 20%, 10%)";
    ctx.fillRect(0, 0, W, H);

    // Bricks
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x + 1, brick.y + 1, BRICK_W - 2, BRICK_H - 2);
    }

    // Paddle
    ctx.fillStyle = "hsl(170, 60%, 50%)";
    ctx.fillRect(s.paddleX, H - 20 - PADDLE_H, PADDLE_W, PADDLE_H);

    // Ball
    ctx.fillStyle = "hsl(45, 90%, 65%)";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const down = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(rafRef.current);
    };
  }, [started, gameOver, gameLoop]);

  const handleTouch = useCallback((e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.touches[0].clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2));
  }, []);

  const restart = () => {
    const s = stateRef.current;
    s.paddleX = W / 2 - PADDLE_W / 2;
    s.ballX = W / 2;
    s.ballY = H - 40;
    s.dx = 3;
    s.dy = -3;
    s.bricks = createBricks();
    s.score = 0;
    setScore(0);
    setGameOver(false);
    setWon(false);
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
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      />

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && (
            <p className={`font-mono text-sm mb-2 ${won ? "text-primary" : "text-destructive"}`}>
              {won ? "YOU WIN! 🏆" : "GAME OVER"}
            </p>
          )}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start Breakout"}
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Arrow keys to move · Touch/drag on mobile
      </p>
    </div>
  );
};

export default BreakoutGame;
