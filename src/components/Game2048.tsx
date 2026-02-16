import { useState, useEffect, useCallback } from "react";

const SIZE = 4;

const TILE_COLORS: Record<number, string> = {
  2: "hsl(45, 60%, 50%)",
  4: "hsl(40, 65%, 48%)",
  8: "hsl(25, 70%, 50%)",
  16: "hsl(15, 75%, 50%)",
  32: "hsl(5, 70%, 55%)",
  64: "hsl(0, 75%, 50%)",
  128: "hsl(45, 80%, 55%)",
  256: "hsl(45, 85%, 50%)",
  512: "hsl(45, 90%, 45%)",
  1024: "hsl(45, 95%, 40%)",
  2048: "hsl(50, 100%, 45%)",
};

type Board = number[][];

const emptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (board: Board): Board => {
  const b = board.map((r) => [...r]);
  const empty: [number, number][] = [];
  b.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
};

const slideRow = (row: number[]): { result: number[]; score: number } => {
  const filtered = row.filter((v) => v);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { result: merged, score };
};

const rotateBoard = (board: Board): Board => {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => board[SIZE - 1 - c][r])
  );
};

const moveLeft = (board: Board): { board: Board; score: number } => {
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const { result, score } = slideRow(row);
    totalScore += score;
    return result;
  });
  return { board: newBoard, score: totalScore };
};

const moveBoard = (board: Board, direction: "left" | "right" | "up" | "down"): { board: Board; score: number } => {
  let b = board.map((r) => [...r]);
  const rotations = { left: 0, down: 1, right: 2, up: 3 };
  for (let i = 0; i < rotations[direction]; i++) b = rotateBoard(b);
  const result = moveLeft(b);
  let rb = result.board;
  for (let i = 0; i < (4 - rotations[direction]) % 4; i++) rb = rotateBoard(rb);
  return { board: rb, score: result.score };
};

const boardsEqual = (a: Board, b: Board) => a.every((row, r) => row.every((v, c) => v === b[r][c]));

const canMove = (board: Board) => {
  for (const dir of ["left", "right", "up", "down"] as const) {
    const { board: newBoard } = moveBoard(board, dir);
    if (!boardsEqual(board, newBoard)) return true;
  }
  return false;
};

const Game2048 = () => {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(emptyBoard())));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const handleMove = useCallback((dir: "left" | "right" | "up" | "down") => {
    setBoard((prev) => {
      const { board: newBoard, score: gained } = moveBoard(prev, dir);
      if (boardsEqual(prev, newBoard)) return prev;
      const withNew = addRandom(newBoard);
      setScore((s) => s + gained);
      if (!canMove(withNew)) {
        setTimeout(() => setGameOver(true), 300);
      }
      return withNew;
    });
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
      };
      if (map[e.key]) {
        e.preventDefault();
        handleMove(map[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, gameOver, handleMove]);

  // Touch support
  const touchRef = useState<{ x: number; y: number } | null>(null);

  const restart = () => {
    setBoard(addRandom(addRandom(emptyBoard())));
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  const CELL = 64;
  const GAP = 6;
  const totalSize = CELL * SIZE + GAP * (SIZE + 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full" style={{ maxWidth: totalSize }}>
        <span className="font-mono text-xs text-muted-foreground">SCORE</span>
        <span className="font-mono text-sm text-primary font-bold">{score}</span>
      </div>

      <div
        className="rounded-lg p-1.5 bg-card border border-border"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`,
          gap: GAP,
          padding: GAP,
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          (touchRef as any)[1]({ x: t.clientX, y: t.clientY });
        }}
        onTouchEnd={(e) => {
          const start = (touchRef as any)[0];
          if (!start) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          if (Math.max(absDx, absDy) < 30) return;
          if (absDx > absDy) handleMove(dx > 0 ? "right" : "left");
          else handleMove(dy > 0 ? "down" : "up");
          (touchRef as any)[1](null);
        }}
      >
        {board.flat().map((val, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-md font-mono font-bold transition-all duration-100"
            style={{
              width: CELL,
              height: CELL,
              backgroundColor: val ? (TILE_COLORS[val] || "hsl(50, 100%, 40%)") : "hsl(220, 15%, 15%)",
              color: val > 4 ? "hsl(220, 25%, 6%)" : val ? "hsl(200, 20%, 90%)" : "transparent",
              fontSize: val >= 1024 ? 14 : val >= 128 ? 18 : 22,
            }}
          >
            {val || ""}
          </div>
        ))}
      </div>

      {(!started || gameOver) && (
        <div className="text-center">
          {gameOver && <p className="font-mono text-destructive text-sm mb-2">GAME OVER — Score: {score}</p>}
          <button
            onClick={restart}
            className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            {gameOver ? "Play Again" : "Start 2048"}
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Arrow keys or swipe to move tiles
      </p>
    </div>
  );
};

export default Game2048;
