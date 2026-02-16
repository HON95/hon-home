import { useState, useCallback } from "react";

const ROWS = 10;
const COLS = 10;
const MINES = 15;

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

const createBoard = (): Cell[][] => {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
        }
      }
      board[r][c].adjacent = count;
    }
  }
  return board;
};

const NUM_COLORS = [
  "",
  "hsl(220, 70%, 55%)",
  "hsl(140, 60%, 40%)",
  "hsl(0, 65%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(25, 80%, 50%)",
  "hsl(170, 60%, 50%)",
  "hsl(0, 0%, 50%)",
  "hsl(0, 0%, 30%)",
];

const MinesweeperGame = () => {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  const reveal = useCallback((b: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = b[r][c];
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(b, r + dr, c + dc);
        }
      }
    }
  }, []);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won) return;
    if (!started) setStarted(true);

    const b = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = b[r][c];
    if (cell.flagged || cell.revealed) return;

    if (cell.mine) {
      // Reveal all mines
      b.forEach((row) => row.forEach((c) => { if (c.mine) c.revealed = true; }));
      setBoard(b);
      setGameOver(true);
      return;
    }

    reveal(b, r, c);
    setBoard(b);

    // Win check
    const unrevealed = b.flat().filter((c) => !c.revealed && !c.mine).length;
    if (unrevealed === 0) {
      setWon(true);
      setGameOver(true);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won) return;
    const b = board.map((row) => row.map((cell) => ({ ...cell })));
    if (b[r][c].revealed) return;
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  };

  const restart = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setStarted(true);
  };

  const flags = board.flat().filter((c) => c.flagged).length;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full" style={{ maxWidth: COLS * 28 }}>
        <span className="font-mono text-xs text-muted-foreground">💣 {MINES - flags}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {won ? "🏆 YOU WIN!" : gameOver ? "💥 BOOM" : "Minesweeper"}
        </span>
      </div>

      <div
        className="border border-border rounded-md overflow-hidden inline-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 28px)` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className={`w-7 h-7 text-xs font-mono font-bold border border-border/30 flex items-center justify-center transition-colors ${
                cell.revealed
                  ? cell.mine
                    ? "bg-destructive/30"
                    : "bg-background/50"
                  : "bg-card hover:bg-secondary cursor-pointer"
              }`}
              style={{ color: cell.revealed && !cell.mine ? NUM_COLORS[cell.adjacent] : undefined }}
            >
              {cell.revealed
                ? cell.mine
                  ? "💣"
                  : cell.adjacent > 0
                  ? cell.adjacent
                  : ""
                : cell.flagged
                ? "🚩"
                : ""}
            </button>
          ))
        )}
      </div>

      {(!started || gameOver) && (
        <button
          onClick={restart}
          className="font-mono text-sm bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          {gameOver ? "Play Again" : "Start Minesweeper"}
        </button>
      )}

      <p className="font-mono text-xs text-muted-foreground hidden md:block">
        Click to reveal · Right-click to flag
      </p>
    </div>
  );
};

export default MinesweeperGame;
