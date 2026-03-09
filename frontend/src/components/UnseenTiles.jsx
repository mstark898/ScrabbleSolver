import { TILE_SCORES, ALL_LETTERS } from '../utils/constants';

export default function UnseenTiles({ unseenCounts, totalUnseen }) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[--text-secondary] uppercase tracking-widest">
          Unseen Tiles
        </h3>
        <span className="text-sm font-bold text-[--text-secondary]">
          {totalUnseen} remaining
        </span>
      </div>

      <div className="bg-white rounded-lg border border-[#c9a96e]/30 p-3">
        <div className="grid grid-cols-7 gap-1">
          {ALL_LETTERS.split('').map(letter => {
            const count = unseenCounts[letter] || 0;
            const isBlank = letter === '?';
            const isEmpty = count === 0;

            return (
              <div
                key={letter}
                className={`
                  relative flex flex-col items-center justify-center
                  rounded-[3px] py-1 text-center select-none
                  ${isEmpty
                    ? 'bg-gray-100 opacity-40'
                    : 'bg-[#f5ecd8] border border-[#c9a96e]/40'
                  }
                `}
              >
                <span className={`text-sm font-bold leading-none ${isEmpty ? 'text-gray-400' : 'text-[#2c2c2c]'}`}>
                  {isBlank ? '_' : letter}
                </span>
                <span className={`text-[0.6rem] font-semibold mt-0.5 ${isEmpty ? 'text-gray-400' : 'text-[--accent]'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
