import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 320;
const PADDLE_H = 60;
const PADDLE_W = 10;
const BALL_R = 6;
const AI_SPEED = 3.5;

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    playerY: CANVAS_SIZE / 2 - PADDLE_H / 2,
    aiY: CANVAS_SIZE / 2 - PADDLE_H / 2,
    ballX: CANVAS_SIZE / 2,
    ballY: CANVAS_SIZE / 2,
    ballDX: 3,
    ballDY: 2,
    playerScore: 0,
    aiScore: 0,
  });
  const rafRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());

  const resetBall = useCallback(() => {
    const s = stateRef.current;
    s.ballX = CANVAS_SIZE / 2;
    s.ballY = CANVAS_SIZE / 2;
    s.ballDX = (Math.random() > 0.5 ? 1 : -1) * 3;
    s.ballDY = (Math.random() - 0.5) * 4;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    // Player input
    if (keysRef.current.has("ArrowUp")) s.playerY = Math.max(0, s.playerY - 5);
    if (keysRef.current.has("ArrowDown")) s.playerY = Math.min(CANVAS_SIZE - PADDLE_H, s.playerY + 5);

    // AI
    const aiCenter = s.aiY + PADDLE_H / 2;
    if (aiCenter < s.ballY - 10) s.aiY += AI_SPEED;
    else if (aiCenter > s.ballY + 10) s.aiY -= AI_SPEED;
    s.aiY = Math.max(0, Math.min(CANVAS_SIZE - PADDLE_H, s.aiY));

    // Ball
    s.ballX += s.ballDX;
    s.ballY += s.ballDY;

    // Top/bottom walls
    if (s.ballY - BALL_R <= 0 || s.ballY + BALL_R >= CANVAS_SIZE) s.ballDY *= -1;

    // Player paddle (left)
    if (s.ballX - BALL_R <= PADDLE_W + 10 && s.ballY >= s.playerY && s.ballY <= s.playerY + PADDLE_H && s.ballDX < 0) {
      s.ballDX = Math.abs(s.ballDX) * 1.05;
      s.ballDY += (s.ballY - (s.playerY + PADDLE_H / 2)) * 0.1;
    }

    // AI paddle (right)
    if (s.ballX + BALL_R >= CANVAS_SIZE - PADDLE_W - 10 && s.ballY >= s.aiY && s.ballY <= s.aiY + PADDLE_H && s.ballDX > 0) {
      s.ballDX = -Math.abs(s.ballDX) * 1.05;
      s.ballDY += (s.ballY - (s.aiY + PADDLE_H / 2)) * 0.1;
    }

    // Scoring
    if (s.ballX < 0) {
      s.aiScore++;
      setScore({ player: s.playerScore, ai: s.aiScore });
      if (s.aiScore >= 5) { setGameOver(true); return; }
      resetBall();
    }
    if (s.ballX > CANVAS_SIZE) {
      s.playerScore++;
      setScore({ player: s.playerScore, ai: s.aiScore });
      if (s.playerScore >= 5) { setGameOver(true); return; }
      resetBall();
    }

    // Cap speed
    const maxSpeed = 8;
    s.ballDX = Math.max(-maxSpeed, Math.min(maxSpeed, s.ballDX));
    s.ballDY = Math.max(-maxSpeed, Math.min(maxSpeed, s.ballDY));

    // Draw
    ctx.fillStyle = "hsl(220, 20%, 10%)";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Center line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "hsl(220, 15%, 20%)";
    ctx.beginPath();
    ctx.moveTo(CANVAS_SIZE / 2, 0);
    ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "hsl(170, 60%, 50%)";
    ctx.fillRect(10, s.playerY, PADDLE_W, PADDLE_H);
    ctx.fillStyle = "hsl(0, 65%, 55%)";
    ctx.fillRect(CANVAS_SIZE - PADDLE_W - 10, s.aiY, PADDLE_W, PADDLE_H);

    // Ball
    ctx.fillStyle = "hsl(45, 90%, 65%)";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [resetBall]);

  useEffect(() => {
    if (!started || gameOver) return;
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) { e.preventDefault(); keysRef.current.add(e.key); }
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

  const restart = () => {
    const s = stateRef.current;
    s.playerY = CANVAS_SIZE / 2 - PADDLE_H / 2;
    s.aiY = CANVAS_SIZE / 2 - PADDLE_H / 2;
    s.playerScore = 0;
    s.aiScore = 0;
    resetBall();
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    setStarted(true);
  };

  // Touch controls
  const handleTouch = useCallback((e: React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.touches[0].clientY - rect.top;
    stateRef.current.playerY = Math.max(0, Math.min(CANVAS_SIZE - PADDLE_H, y - PADDLE_H / 2));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full" style={{ maxWidth: CANVAS_SIZE }}>
        <span className="font-mono text-xs text-primary font-bold">YOU: {score.player}</span>
        <span className="font-mono text-xs text-muted-foreground">First to 5</span>
        <span className="font-mono text-xs text-destructive font-bold">CPU: {score.ai}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border border-border rounded-md"
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      />

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && (
            <p className={`font-mono text-sm mb-2 ${score.player >= 5 ? "text-primary" : "text-destructive"}`}>
              {score.player >= 5 ? "YOU WIN! 🏆" : "CPU WINS!"}
            </p>
          )}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start Pong"}
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Arrow keys to move · Touch/drag on mobile
      </p>
    </div>
  );
};

export default PongGame;
