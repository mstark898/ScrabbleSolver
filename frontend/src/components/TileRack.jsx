import { useRef } from 'react';

export default function TileRack({ tiles, onTilesChange }) {
  const inputRefs = useRef([]);

  const handleBoxChange = (idx, value) => {
    const char = value.slice(-1).toUpperCase();
    if (char && !/^[A-Z? ]$/.test(char)) return;
    const mapped = (char === ' ') ? '?' : char;

    const newTiles = [...tiles];
    while (newTiles.length < 7) newTiles.push('');
    newTiles[idx] = mapped || '';
    // Remove trailing empties
    while (newTiles.length > 0 && newTiles[newTiles.length - 1] === '') newTiles.pop();
    onTilesChange(newTiles.filter(t => t !== ''));

    // Auto-focus next box
    if (mapped && idx < 6) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleBoxKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !tiles[idx]) {
      e.preventDefault();
      if (idx > 0) {
        const newTiles = tiles.filter((_, i) => i !== idx - 1);
        onTilesChange(newTiles);
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        <h2 className="text-lg font-bold text-[--text-primary]">Enter your letters.</h2>
        <p className="text-xs text-[--text-secondary]">Use &apos;?&apos; or spacebar for blanks.</p>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: 7 }, (_, idx) => {
          const letter = tiles[idx] || '';
          return (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              value={letter === '?' ? '·' : (letter || '·')}
              onChange={(e) => handleBoxChange(idx, e.target.value)}
              onKeyDown={(e) => handleBoxKeyDown(idx, e)}
              onFocus={(e) => e.target.select()}
              maxLength={2}
              className={`w-10 h-10 sm:w-11 sm:h-11 text-center text-lg font-semibold
                rounded border-2 uppercase bg-white
                focus:outline-none focus:border-[#3d7a2a] focus:ring-1 focus:ring-[#3d7a2a]
                ${letter ? 'border-[#ccc] text-[--text-primary]' : 'border-[#e0e0e0] text-[#ccc]'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
