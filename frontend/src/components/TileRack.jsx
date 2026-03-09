import { TILE_SCORES } from '../utils/constants';

export default function TileRack({ tiles, onTileClick, selectedTileIndex }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-sm font-semibold text-[--text-secondary] uppercase tracking-widest">
        Your Tiles
      </h3>
      <div className="flex gap-1.5 sm:gap-2">
        {tiles.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => onTileClick(idx)}
            className={`
              relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center
              rounded-md cursor-pointer select-none transition-all duration-150
              bg-[#f2e4c6] border-2 shadow-[0_2px_6px_rgba(0,0,0,0.15)]
              ${selectedTileIndex === idx
                ? 'border-[#2c7a4b] scale-110 shadow-[0_4px_12px_rgba(44,122,75,0.3)]'
                : 'border-[#c9a96e] hover:scale-105 hover:shadow-[0_3px_8px_rgba(0,0,0,0.2)]'
              }
            `}
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
    </div>
  );
}
