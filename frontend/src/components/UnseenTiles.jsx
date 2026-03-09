import { ALL_LETTERS, TILE_SCORES } from '../utils/constants';

export default function UnseenTiles({ unseenCounts, totalUnseen }) {
  return (
    <div className="w-full bg-white rounded-lg border border-[#ddd] p-4">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-xl font-bold text-[--text-primary]">Tiles remaining</h3>
        <span className="text-sm text-[--text-secondary]">({totalUnseen})</span>
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1.5 items-center">
        {ALL_LETTERS.split('').map(letter => {
          const count = unseenCounts[letter] || 0;
          const isBlank = letter === '?';
          const isEmpty = count === 0;
          const score = TILE_SCORES[letter] ?? 0;

          return (
            <div key={letter} className={`flex items-center gap-0.5 ${isEmpty ? 'opacity-25' : ''}`}>
              <span className="relative inline-flex items-center justify-center w-6 h-6
                bg-[#4a6fa5] rounded-sm text-white">
                <span className="text-xs font-extrabold leading-none">
                  {isBlank ? '_' : letter}
                </span>
                <span className="absolute top-[1px] right-[2px] text-[0.35rem] font-bold text-white/70 leading-none">
                  {score}
                </span>
              </span>
              <span className="text-xs text-[--text-secondary] font-medium">&times;{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
