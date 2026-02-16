import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 20;
const CELL = 24;

type Piece = { shape: number[][]; color: string; x: number; y: number };

const SHAPES: { shape: number[][]; color: string }[] = [
  { shape: [[1,1,1,1]], color: "hsl(185, 70%, 55%)" },            // I
  { shape: [[1,1],[1,1]], color: "hsl(45, 80%, 55%)" },           // O
  { shape: [[0,1,0],[1,1,1]], color: "hsl(270, 50%, 55%)" },      // T
  { shape: [[1,0],[1,0],[1,1]], color: "hsl(25, 80%, 55%)" },     // L
  { shape: [[0,1],[0,1],[1,1]], color: "hsl(220, 70%, 55%)" },    // J
  { shape: [[0,1,1],[1,1,0]], color: "hsl(140, 60%, 45%)" },      // S
  { shape: [[1,1,0],[0,1,1]], color: "hsl(0, 65%, 55%)" },        // Z
];

const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const randomPiece = (): Piece => {
  const t = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return { shape: t.shape.map(r => [...r]), color: t.color, x: Math.floor(COLS / 2) - 1, y: 0 };
};

const rotate = (shape: number[][]) => {
  const rows = shape.length, cols = shape[0].length;
  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (_, r) => shape[rows - 1 - r][c])
  );
};

const collides = (board: (string | null)[][], piece: Piece) => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c, ny = piece.y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
};

const TetrisGame = () => {
  const [board, setBoard] = useState(createBoard);
  const [piece, setPiece] = useState(randomPiece);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const lock = useCallback(() => {
    setBoard(prev => {
      const b = prev.map(r => [...r]);
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            const ny = piece.y + r;
            if (ny < 0) { setGameOver(true); return prev; }
            b[ny][piece.x + c] = piece.color;
          }
        }
      }
      // Clear lines
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (b[r].every(c => c !== null)) {
          b.splice(r, 1);
          b.unshift(Array(COLS).fill(null));
          cleared++;
          r++;
        }
      }
      if (cleared) setScore(s => s + cleared * 100);
      return b;
    });
    const np = randomPiece();
    if (collides(board, np)) setGameOver(true);
    else setPiece(np);
  }, [piece, board]);

  const move = useCallback((dx: number, dy: number) => {
    setPiece(p => {
      const np = { ...p, x: p.x + dx, y: p.y + dy };
      if (collides(board, np)) {
        if (dy) lock();
        return p;
      }
      return np;
    });
  }, [board, lock]);

  const rotatePiece = useCallback(() => {
    setPiece(p => {
      const np = { ...p, shape: rotate(p.shape) };
      if (collides(board, np)) return p;
      return np;
    });
  }, [board]);

  const drop = useCallback(() => {
    setPiece(p => {
      let np = { ...p };
      while (!collides(board, { ...np, y: np.y + 1 })) np.y++;
      return np;
    });
    setTimeout(lock, 50);
  }, [board, lock]);

  // Keyboard
  useEffect(() => {
    if (!started || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1, 0);
      else if (e.key === "ArrowRight") move(1, 0);
      else if (e.key === "ArrowDown") move(0, 1);
      else if (e.key === "ArrowUp") rotatePiece();
      else if (e.key === " ") drop();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, gameOver, move, rotatePiece, drop]);

  // Game tick
  useEffect(() => {
    if (!started || gameOver) return;
    tickRef.current = setInterval(() => move(0, 1), 500);
    return () => clearInterval(tickRef.current);
  }, [started, gameOver, move]);

  const restart = () => {
    setBoard(createBoard());
    setPiece(randomPiece());
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  // Render
  const display = board.map(r => [...r]);
  if (!gameOver) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const ny = piece.y + r, nx = piece.x + c;
          if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) display[ny][nx] = piece.color;
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-[240px]">
        <span className="font-mono text-xs text-muted-foreground">SCORE</span>
        <span className="font-mono text-sm text-primary font-bold">{score}</span>
      </div>

      <div
        className="border border-border rounded-md overflow-hidden bg-card"
        style={{ width: COLS * CELL, height: ROWS * CELL }}
      >
        {display.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div
                key={c}
                style={{
                  width: CELL,
                  height: CELL,
                  backgroundColor: cell || "transparent",
                  boxShadow: cell ? `inset 0 0 4px rgba(255,255,255,0.2)` : undefined,
                }}
                className={`border border-border/20 ${!cell ? "bg-background/50" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && <p className="font-mono text-destructive text-sm mb-2">GAME OVER</p>}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}

      {started && !gameOver && (
        <div className="grid grid-cols-3 gap-2 md:hidden">
          <div />
          <button onClick={rotatePiece} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">↻</button>
          <div />
          <button onClick={() => move(-1, 0)} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">←</button>
          <button onClick={() => move(0, 1)} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">↓</button>
          <button onClick={() => move(1, 0)} className="bg-secondary text-secondary-foreground rounded p-2 font-mono text-xs">→</button>
          <div />
          <button onClick={drop} className="bg-primary text-primary-foreground rounded p-2 font-mono text-xs">Drop</button>
          <div />
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Arrow keys to move · ↑ rotate · Space to drop
      </p>
    </div>
  );
};

export default TetrisGame;
