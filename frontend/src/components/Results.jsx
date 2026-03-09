import { TILE_SCORES } from '../utils/constants';

export default function Results({ results, onSelectResult, activeResult }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
        {results.map((result, idx) => {
          const isActive = activeResult &&
            activeResult.row === result.row &&
            activeResult.col === result.col &&
            activeResult.word === result.word &&
            activeResult.direction === result.direction;

          return (
            <button
              key={idx}
              onClick={() => onSelectResult(result)}
              className={`
                flex items-center justify-between px-3 py-2.5 text-left
                transition-colors duration-100 rounded-lg border-2
                ${isActive ? 'border-[#3d7a2a] bg-[#f0f8f0]' : 'border-[#e0e0e0] bg-white hover:border-[#bbb]'}
              `}
            >
              <div className="flex gap-0.5">
                {result.word.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="relative inline-flex items-center justify-center w-7 h-7
                      bg-[#4a6fa5] rounded-sm text-white"
                  >
                    <span className="text-sm font-extrabold leading-none">{letter}</span>
                    <span className="absolute bottom-[1px] right-[2px] text-[0.4rem] font-bold text-white/70 leading-none">
                      {TILE_SCORES[letter] ?? ''}
                    </span>
                  </span>
                ))}
              </div>
              <span className="w-9 h-9 rounded-full bg-[#2c3e50] text-white flex items-center justify-center text-sm font-bold tabular-nums flex-shrink-0 ml-2">
                {result.score}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
