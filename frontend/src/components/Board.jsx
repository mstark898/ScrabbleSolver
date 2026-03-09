import Cell from './Cell';

export default function Board({ boardTiles, selectedCell, onCellClick }) {
  return (
    <div className="inline-block bg-[#2d5016] p-1.5 sm:p-2 rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div
        className="grid gap-[1.5px] sm:gap-[2px]"
        style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
      >
        {Array.from({ length: 15 }, (_, row) =>
          Array.from({ length: 15 }, (_, col) => (
            <Cell
              key={`${row}-${col}`}
              row={row}
              col={col}
              tile={boardTiles[row][col]}
              isSelected={selectedCell && selectedCell[0] === row && selectedCell[1] === col}
              onClick={() => onCellClick(row, col)}
            />
          ))
        )}
      </div>
    </div>
  );
}
