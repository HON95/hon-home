import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 16;
const SIZE = 20;
const CANVAS = GRID * SIZE;

type Point = { x: number; y: number };

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 8, y: 8 }]);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 12, y: 8 });
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  const placeFood = useCallback(() => {
    const snake = snakeRef.current;
    let f: Point;
    do {
      f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    } while (snake.some(s => s.x === f.x && s.y === f.y));
    foodRef.current = f;
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;

    if (time - lastTickRef.current > 120) {
      lastTickRef.current = time;
      const snake = snakeRef.current;
      const dir = dirRef.current;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Collision
      if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        placeFood();
      } else {
        snake.pop();
      }
    }

    // Draw
    ctx.fillStyle = "hsl(220, 20%, 10%)";
    ctx.fillRect(0, 0, CANVAS, CANVAS);

    // Grid
    ctx.strokeStyle = "hsl(220, 15%, 14%)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, CANVAS); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(CANVAS, i * GRID); ctx.stroke();
    }

    // Food
    ctx.fillStyle = "hsl(0, 65%, 55%)";
    ctx.beginPath();
    ctx.arc(foodRef.current.x * GRID + GRID / 2, foodRef.current.y * GRID + GRID / 2, GRID / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snakeRef.current.forEach((s, i) => {
      const alpha = 1 - (i / snakeRef.current.length) * 0.5;
      ctx.fillStyle = `hsla(170, 60%, 50%, ${alpha})`;
      ctx.fillRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2);
    });

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [placeFood]);

  useEffect(() => {
    if (!started || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      else if (e.key === "ArrowDown" && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      else if (e.key === "ArrowLeft" && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      else if (e.key === "ArrowRight" && d.x !== -1) dirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", handler);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener("keydown", handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [started, gameOver, gameLoop]);

  const restart = () => {
    snakeRef.current = [{ x: 8, y: 8 }];
    dirRef.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setGameOver(false);
    setStarted(true);
    lastTickRef.current = 0;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full" style={{ maxWidth: CANVAS }}>
        <span className="font-mono text-xs text-muted-foreground">SCORE</span>
        <span className="font-mono text-sm text-primary font-bold">{score}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS}
        height={CANVAS}
        className="border border-border rounded-md"
      />

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && <p className="font-mono text-destructive text-sm mb-2">GAME OVER</p>}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start Snake"}
          </button>
        </div>
      )}

      {started && !gameOver && (
        <div className="grid grid-cols-3 gap-2 md:hidden">
          <div />
          <button onClick={() => { if (dirRef.current.y !== 1) dirRef.current = { x: 0, y: -1 }; }} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">↑</button>
          <div />
          <button onClick={() => { if (dirRef.current.x !== 1) dirRef.current = { x: -1, y: 0 }; }} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">←</button>
          <button onClick={() => { if (dirRef.current.y !== -1) dirRef.current = { x: 0, y: 1 }; }} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">↓</button>
          <button onClick={() => { if (dirRef.current.x !== -1) dirRef.current = { x: 1, y: 0 }; }} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">→</button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Arrow keys to control the snake
      </p>
    </div>
  );
};

export default SnakeGame;
