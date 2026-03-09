import { useState, useCallback, useEffect } from 'react';
import Board from './components/Board';
import TileRack from './components/TileRack';
import Controls from './components/Controls';
import Results from './components/Results';
import { createEmptyBoard } from './utils/constants';
import { solveMoves } from './utils/api';

function App() {
  const [boardTiles, setBoardTiles] = useState(createEmptyBoard);
  const [rackTiles, setRackTiles] = useState([]);
  const [rackInput, setRackInput] = useState('');
  const [newTiles, setNewTiles] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [direction, setDirection] = useState('across');
  const [results, setResults] = useState([]);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState(null);

  const handleSetRack = useCallback(() => {
    const letters = rackInput.replace(/[^A-Z?]/g, '').split('').slice(0, 7);
    setRackTiles(letters);
    setSelectedTileIndex(null);
  }, [rackInput]);

  const handleCellClick = useCallback((row, col) => {
    if (selectedTileIndex !== null && rackTiles[selectedTileIndex]) {
      // Place tile on board
      setBoardTiles(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = { letter: rackTiles[selectedTileIndex], isBlank: rackTiles[selectedTileIndex] === '?' };
        return next;
      });
      setNewTiles(prev => {
        const next = new Set(prev);
        next.add(`${row}-${col}`);
        return next;
      });

      // Remove tile from rack
      setRackTiles(prev => prev.filter((_, i) => i !== selectedTileIndex));
      setSelectedTileIndex(null);

      // Auto-advance selection
      if (direction === 'across' && col < 14) {
        setSelectedCell([row, col + 1]);
      } else if (direction === 'down' && row < 14) {
        setSelectedCell([row + 1, col]);
      } else {
        setSelectedCell(null);
      }
    } else if (boardTiles[row][col] && newTiles.has(`${row}-${col}`)) {
      // Pick up a placed tile
      const tile = boardTiles[row][col];
      setBoardTiles(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = null;
        return next;
      });
      setNewTiles(prev => {
        const next = new Set(prev);
        next.delete(`${row}-${col}`);
        return next;
      });
      setRackTiles(prev => [...prev, tile.letter]);
    } else {
      setSelectedCell([row, col]);
    }
  }, [selectedTileIndex, rackTiles, boardTiles, newTiles, direction]);

  const handleTileClick = useCallback((idx) => {
    setSelectedTileIndex(prev => prev === idx ? null : idx);
  }, []);

  const handleClearPlaced = useCallback(() => {
    const returned = [];
    setBoardTiles(prev => {
      const next = prev.map(r => [...r]);
      for (const key of newTiles) {
        const [row, col] = key.split('-').map(Number);
        if (next[row][col]) {
          returned.push(next[row][col].letter);
          next[row][col] = null;
        }
      }
      return next;
    });
    setRackTiles(prev => [...prev, ...returned]);
    setNewTiles(new Set());
    setSelectedCell(null);
    setSelectedTileIndex(null);
  }, [newTiles]);

  const handleClearBoard = useCallback(() => {
    setBoardTiles(createEmptyBoard());
    setNewTiles(new Set());
    setResults([]);
    setSelectedCell(null);
    setSelectedTileIndex(null);
    // Return all tiles from new placements to rack
    setRackTiles(prev => {
      const input = rackInput.replace(/[^A-Z?]/g, '').split('').slice(0, 7);
      return input;
    });
  }, [rackInput]);

  const handleSolve = useCallback(async () => {
    setSolving(true);
    setError(null);
    try {
      // Convert board to string format for API
      const boardData = boardTiles.map(row =>
        row.map(cell => cell ? cell.letter : '.')
      );
      const rack = rackTiles.join('');
      const data = await solveMoves(boardData, rack);
      setResults(data.moves || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setSolving(false);
    }
  }, [boardTiles, rackTiles]);

  const handleSelectResult = useCallback((result) => {
    // Clear newly placed tiles first
    handleClearPlaced();

    // Place the result word on the board
    setBoardTiles(prev => {
      const next = prev.map(r => [...r]);
      const newKeys = new Set();
      for (let i = 0; i < result.word.length; i++) {
        const r = result.direction === 'across' ? result.row : result.row + i;
        const c = result.direction === 'across' ? result.col + i : result.col;
        if (!next[r][c]) {
          next[r][c] = { letter: result.word[i], isBlank: false };
          newKeys.add(`${r}-${c}`);
        }
      }
      setNewTiles(newKeys);
      return next;
    });
  }, [handleClearPlaced]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter) && selectedCell) {
        const idx = rackTiles.findIndex(t => t === letter);
        if (idx !== -1) {
          setSelectedTileIndex(idx);
          // Trigger placement
          const [row, col] = selectedCell;
          setBoardTiles(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = { letter, isBlank: false };
            return next;
          });
          setNewTiles(prev => {
            const next = new Set(prev);
            next.add(`${row}-${col}`);
            return next;
          });
          setRackTiles(prev => prev.filter((_, i) => i !== idx));
          setSelectedTileIndex(null);

          if (direction === 'across' && col < 14) {
            setSelectedCell([row, col + 1]);
          } else if (direction === 'down' && row < 14) {
            setSelectedCell([row + 1, col]);
          }
        }
      }

      if (e.key === 'Backspace' && selectedCell) {
        const [row, col] = selectedCell;
        const key = `${row}-${col}`;
        if (newTiles.has(key) && boardTiles[row][col]) {
          const tile = boardTiles[row][col];
          setBoardTiles(prev => {
            const next = prev.map(r => [...r]);
            next[row][col] = null;
            return next;
          });
          setNewTiles(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          setRackTiles(prev => [...prev, tile.letter]);
        }
      }

      if (e.key === ' ') {
        e.preventDefault();
        setDirection(prev => prev === 'across' ? 'down' : 'across');
      }

      // Arrow keys
      if (selectedCell) {
        const [r, c] = selectedCell;
        if (e.key === 'ArrowUp' && r > 0) setSelectedCell([r - 1, c]);
        if (e.key === 'ArrowDown' && r < 14) setSelectedCell([r + 1, c]);
        if (e.key === 'ArrowLeft' && c > 0) setSelectedCell([r, c - 1]);
        if (e.key === 'ArrowRight' && c < 14) setSelectedCell([r, c + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, rackTiles, direction, newTiles, boardTiles]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[--text-primary]">
          Scrabble Solver
        </h1>
        <p className="text-sm text-[--text-secondary] mt-1">
          Place tiles on the board, then find the best moves
        </p>
      </header>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        {/* Board */}
        <div className="flex-shrink-0">
          <Board
            boardTiles={boardTiles}
            newTiles={newTiles}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <p className="text-xs text-[--text-secondary] mt-2 text-center">
            Click a cell to select it &middot; Space to toggle direction &middot; Type to place tiles
          </p>
        </div>

        {/* Side panel */}
        <div className="flex flex-col items-center gap-6 w-full lg:w-auto">
          <TileRack
            tiles={rackTiles}
            onTileClick={handleTileClick}
            selectedTileIndex={selectedTileIndex}
          />

          <Controls
            rackInput={rackInput}
            onRackInputChange={setRackInput}
            onSetRack={handleSetRack}
            onSolve={handleSolve}
            onClear={handleClearPlaced}
            onClearBoard={handleClearBoard}
            solving={solving}
            direction={direction}
            onToggleDirection={() => setDirection(d => d === 'across' ? 'down' : 'across')}
          />

          {error && (
            <div className="w-full max-w-md px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Results results={results} onSelectResult={handleSelectResult} />
        </div>
      </div>
    </div>
  );
}

export default App;
