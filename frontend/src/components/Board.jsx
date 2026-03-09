import Cell from './Cell';

export default function Board({ boardTiles, newTiles, selectedCell, onCellClick }) {
  return (
    <div className="inline-block bg-[#1a6b3c] p-2 sm:p-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-15 gap-[2px] sm:gap-[3px]"
        style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}
      >
        {Array.from({ length: 15 }, (_, row) =>
          Array.from({ length: 15 }, (_, col) => {
            const key = `${row}-${col}`;
            const tile = boardTiles[row][col];
            const isNew = newTiles.has(key);
            const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;

            return (
              <Cell
                key={key}
                row={row}
                col={col}
                tile={tile}
                isNew={isNew}
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
