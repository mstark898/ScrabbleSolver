import { ALL_LETTERS } from '../utils/constants';

export default function UnseenTiles({ unseenCounts, totalUnseen }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
          Unseen Tiles
        </label>
        <span className="text-xs font-bold text-[--text-secondary]">
          {totalUnseen} left
        </span>
      </div>

      <div className="bg-white rounded border border-[#ddd] p-2">
        <div className="grid grid-cols-9 gap-[3px]">
          {ALL_LETTERS.split('').map(letter => {
            const count = unseenCounts[letter] || 0;
            const isBlank = letter === '?';
            const isEmpty = count === 0;

            return (
              <div
                key={letter}
                className={`
                  flex flex-col items-center justify-center rounded-sm py-0.5 select-none
                  ${isEmpty ? 'opacity-25' : 'bg-[#f5ecd8]'}
                `}
              >
                <span className={`text-[0.65rem] font-bold leading-none ${isEmpty ? 'text-gray-400' : 'text-[#2c2c2c]'}`}>
                  {isBlank ? '?' : letter}
                </span>
                <span className={`text-[0.5rem] font-bold mt-px ${isEmpty ? 'text-gray-400' : 'text-[--accent]'}`}>
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
