import { useState, useCallback, useEffect, useMemo } from 'react';
import Board from './components/Board';
import TileRack from './components/TileRack';
import Controls from './components/Controls';
import Results from './components/Results';
import UnseenTiles from './components/UnseenTiles';
import { createEmptyBoard, computeUnseen, totalTileCount } from './utils/constants';
import { solveMoves } from './utils/api';

function App() {
  const [boardTiles, setBoardTiles] = useState(createEmptyBoard);
  const [handTiles, setHandTiles] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [results, setResults] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState(null);
  // Preview tiles placed by selecting a result
  const [previewTiles, setPreviewTiles] = useState(new Set());

  // Compute unseen tiles
  const unseenCounts = useMemo(
    () => computeUnseen(boardTiles, handTiles),
    [boardTiles, handTiles]
  );
  const totalUnseen = useMemo(() => totalTileCount(unseenCounts), [unseenCounts]);

  // Click a cell to select it
  const handleCellClick = useCallback((row, col) => {
    // If clicking the already-selected cell, toggle direction
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      setDirection(d => d === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell([row, col]);
    }
  }, [selectedCell]);

  const clearPreview = useCallback(() => {
    if (previewTiles.size > 0) {
      setBoardTiles(prev => {
        const next = prev.map(r => [...r]);
        for (const key of previewTiles) {
          const [r, c] = key.split('-').map(Number);
          next[r][c] = null;
        }
        return next;
      });
      setPreviewTiles(new Set());
      setActiveResult(null);
    }
  }, [previewTiles]);

  // Place a letter on the board at the selected cell
  const placeLetter = useCallback((letter, isBlank = false) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;

    // Clear any preview
    clearPreview();

    setBoardTiles(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = { letter: letter.toUpperCase(), isBlank };
      return next;
    });

    // Auto-advance cursor
    if (direction === 'across' && col < 14) {
      setSelectedCell([row, col + 1]);
    } else if (direction === 'down' && row < 14) {
      setSelectedCell([row + 1, col]);
    }
  }, [selectedCell, direction, clearPreview]);

  // Remove letter from board at selected cell
  const removeLetter = useCallback(() => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;

    clearPreview();

    // Clear the current cell if it has a tile
    if (boardTiles[row][col]) {
      setBoardTiles(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = null;
        return next;
      });
    } else {
      // Move back and delete
      let prevR = row, prevC = col;
      if (direction === 'across' && col > 0) {
        prevC = col - 1;
      } else if (direction === 'down' && row > 0) {
        prevR = row - 1;
      }
      if (prevR !== row || prevC !== col) {
        setBoardTiles(prev => {
          const next = prev.map(r => [...r]);
          next[prevR][prevC] = null;
          return next;
        });
        setSelectedCell([prevR, prevC]);
      }
    }
  }, [selectedCell, boardTiles, direction, clearPreview]);

  const handleClearBoard = useCallback(() => {
    setBoardTiles(createEmptyBoard());
    setHandTiles([]);
    setResults([]);
    setActiveResult(null);
    setPreviewTiles(new Set());
    setSelectedCell(null);
    setError(null);
  }, []);

  const handleSolve = useCallback(async () => {
    clearPreview();
    setSolving(true);
    setError(null);
    setResults([]);
    setActiveResult(null);
    try {
      const boardData = boardTiles.map(row =>
        row.map(cell => cell ? cell.letter : '.')
      );
      const rack = handTiles.join('');
      const data = await solveMoves(boardData, rack);
      setResults(data.moves || []);
      if (!data.moves || data.moves.length === 0) {
        setError('No valid moves found.');
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setSolving(false);
    }
  }, [boardTiles, handTiles, clearPreview]);

  const handleSelectResult = useCallback((result) => {
    // First, clear any existing preview
    setBoardTiles(prev => {
      const next = prev.map(r => [...r]);
      // Remove previous preview tiles
      for (const key of previewTiles) {
        const [r, c] = key.split('-').map(Number);
        next[r][c] = null;
      }
      // Place the new result word, only for positions that are empty
      const newPreview = new Set();
      for (let i = 0; i < result.word.length; i++) {
        const r = result.direction === 'across' ? result.row : result.row + i;
        const c = result.direction === 'across' ? result.col + i : result.col;
        if (!next[r][c]) {
          next[r][c] = { letter: result.word[i], isBlank: false, isPreview: true };
          newPreview.add(`${r}-${c}`);
        }
      }
      setPreviewTiles(newPreview);
      return next;
    });
    setActiveResult(result);
  }, [previewTiles]);

  // Keyboard: type letters into the board, backspace to remove, arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in the hand input
      if (e.target.tagName === 'INPUT') return;

      const key = e.key;

      // Letter keys — place on board
      if (/^[a-zA-Z]$/.test(key) && selectedCell) {
        e.preventDefault();
        placeLetter(key.toUpperCase());
        return;
      }

      // Backspace — remove
      if (key === 'Backspace') {
        e.preventDefault();
        removeLetter();
        return;
      }

      // Delete — clear current cell
      if (key === 'Delete' && selectedCell) {
        e.preventDefault();
        const [row, col] = selectedCell;
        if (boardTiles[row][col]) {
          clearPreview();
          setBoardTiles(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = null;
            return next;
          });
        }
        return;
      }

      // Space — toggle direction
      if (key === ' ') {
        e.preventDefault();
        setDirection(d => d === 'across' ? 'down' : 'across');
        return;
      }

      // Arrow keys
      if (selectedCell) {
        const [r, c] = selectedCell;
        if (key === 'ArrowUp' && r > 0) { e.preventDefault(); setSelectedCell([r - 1, c]); }
        if (key === 'ArrowDown' && r < 14) { e.preventDefault(); setSelectedCell([r + 1, c]); }
        if (key === 'ArrowLeft' && c > 0) { e.preventDefault(); setSelectedCell([r, c - 1]); }
        if (key === 'ArrowRight' && c < 14) { e.preventDefault(); setSelectedCell([r, c + 1]); }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, placeLetter, removeLetter, boardTiles, clearPreview]);

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-3 sm:py-6 sm:px-4">
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[--text-primary]">
          Crossplay Solver
        </h1>
        <p className="text-xs text-[--text-secondary] mt-0.5">
          Enter the board &amp; your tiles, find the best move
        </p>
      </header>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start justify-center w-full max-w-5xl">
        {/* Left: Board */}
        <div className="flex-shrink-0">
          <Board
            boardTiles={boardTiles}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <div className="mt-1.5 px-0.5 flex items-center gap-2">
            <span className="text-[0.65rem] text-[--text-secondary]">
              Click cell &amp; type &middot; Space toggles direction
            </span>
            <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-[--bg-secondary] font-semibold text-[--text-primary]">
              {direction === 'across' ? '\u2192 Across' : '\u2193 Down'}
            </span>
          </div>
        </div>

        {/* Right: Controls panel */}
        <div className="flex flex-col gap-4 w-full lg:w-72">
          <TileRack tiles={handTiles} onTilesChange={setHandTiles} />

          <Controls
            onSolve={handleSolve}
            onClearBoard={handleClearBoard}
            solving={solving}
            hasHand={handTiles.length > 0}
          />

          {error && (
            <div className="px-3 py-2 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <Results
            results={results}
            onSelectResult={handleSelectResult}
            activeResult={activeResult}
          />

          <UnseenTiles
            unseenCounts={unseenCounts}
            totalUnseen={totalUnseen}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
