import { useRef } from 'react';
import { TILE_SCORES } from '../utils/constants';

export default function TileRack({ tiles, onTilesChange }) {
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z?]/g, '').slice(0, 7);
    onTilesChange(val.split(''));
  };

  const handleTileClick = (idx) => {
    // Remove tile at index
    onTilesChange(tiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      <h3 className="text-sm font-semibold text-[--text-secondary] uppercase tracking-widest">
        Your Hand
      </h3>

      {/* Tile display */}
      <div className="flex gap-1.5 sm:gap-2 justify-center">
        {tiles.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            title="Click to remove"
            className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center
              rounded-md cursor-pointer select-none transition-all duration-150
              bg-[#f2e4c6] border-2 border-[#c9a96e] shadow-[0_2px_6px_rgba(0,0,0,0.15)]
              hover:scale-105 hover:shadow-[0_3px_8px_rgba(0,0,0,0.2)]
              hover:border-red-400"
          >
            <span className="font-bold text-lg sm:text-xl text-[#2c2c2c]">
              {letter === '?' ? '' : letter}
            </span>
            {letter !== '?' && (
              <span className="absolute bottom-1 right-1.5 text-[0.55rem] font-semibold text-[#5a5a5a]">
                {TILE_SCORES[letter] ?? ''}
              </span>
            )}
            {letter === '?' && (
              <span className="text-xs text-[#888]">blank</span>
            )}
          </button>
        ))}
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 7 - tiles.length) }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-md border-2 border-dashed border-[#c9a96e]/40 bg-[#e8dcc4]/30"
          />
        ))}
      </div>

      {/* Text input for typing tiles */}
      <input
        ref={inputRef}
        type="text"
        value={tiles.join('')}
        onChange={handleInputChange}
        placeholder="Type your 7 tiles (use ? for blank)"
        maxLength={7}
        className="w-full px-4 py-2.5 rounded-lg border border-[#c9a96e]/60 bg-white
          text-base font-semibold tracking-[0.3em] text-center uppercase
          placeholder:text-[#aaa] placeholder:tracking-normal placeholder:normal-case placeholder:font-normal
          focus:outline-none focus:ring-2 focus:ring-[#2c7a4b] focus:border-transparent
          transition-all"
      />
    </div>
  );
}
