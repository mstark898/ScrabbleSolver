import Cell from './Cell';

export default function Board({ boardTiles, selectedCell, onCellClick }) {
  return (
    <div className="inline-block bg-[#1a6b3c] p-2 sm:p-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div
        className="grid gap-[2px] sm:gap-[3px]"
        style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}
      >
        {Array.from({ length: 15 }, (_, row) =>
          Array.from({ length: 15 }, (_, col) => {
            const tile = boardTiles[row][col];
            const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;

            return (
              <Cell
                key={`${row}-${col}`}
                row={row}
                col={col}
                tile={tile}
                isSelected={isSelected}
                onClick={() => onCellClick(row, col)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
