import { TILE_SCORES } from '../utils/constants';

export default function TileRack({ tiles, onTilesChange }) {
  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z?]/g, '').slice(0, 7);
    onTilesChange(val.split(''));
  };

  const handleTileClick = (idx) => {
    onTilesChange(tiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <label className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
        Your Hand
      </label>

      <div className="flex gap-1.5 justify-center">
        {tiles.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            title="Click to remove"
            className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
              rounded cursor-pointer select-none transition-all duration-100
              bg-[#f5e6c8] border border-[#d4b87a] shadow-sm
              hover:scale-105 hover:border-red-400"
          >
            <span className="font-extrabold text-base sm:text-lg text-[#2c2c2c]">
              {letter === '?' ? '' : letter}
            </span>
            {letter !== '?' && (
              <span className="absolute bottom-0.5 right-1 text-[0.5rem] font-bold text-[#8b7355]">
                {TILE_SCORES[letter] ?? ''}
              </span>
            )}
            {letter === '?' && (
              <span className="text-[0.6rem] text-[#999]">blank</span>
            )}
          </button>
        ))}
        {Array.from({ length: Math.max(0, 7 - tiles.length) }, (_, i) => (
          <div
            key={`e-${i}`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded border-2 border-dashed border-[#ccc]/50 bg-[#f0ece4]/40"
          />
        ))}
      </div>

      <input
        type="text"
        value={tiles.join('')}
        onChange={handleInputChange}
        placeholder="Type tiles (? = blank)"
        maxLength={7}
        className="w-full px-3 py-2 rounded border border-[#ddd] bg-white
          text-sm font-semibold tracking-[0.25em] text-center uppercase
          placeholder:text-[#bbb] placeholder:tracking-normal placeholder:normal-case placeholder:font-normal
          focus:outline-none focus:ring-2 focus:ring-[--accent] focus:border-transparent"
      />
    </div>
  );
}
