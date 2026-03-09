import { TILE_SCORES } from '../utils/constants';

export default function Results({ results, onSelectResult, activeResult }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-semibold text-[--text-secondary] uppercase tracking-widest mb-3">
        Best Moves ({results.length})
      </h3>
      <div className="flex flex-col max-h-[400px] overflow-y-auto rounded-lg border border-[#c9a96e]/30 bg-white">
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
                flex items-center justify-between px-4 py-3 text-left
                transition-all duration-150 hover:bg-[--bg-secondary]
                ${isActive ? 'bg-[#e8f5ec]' : ''}
                ${idx === 0 && !isActive ? 'bg-[#f6faf7]' : ''}
                ${idx === 0 ? 'rounded-t-lg' : ''}
                ${idx === results.length - 1 ? 'rounded-b-lg' : ''}
                ${idx > 0 ? 'border-t border-[#c9a96e]/15' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${idx === 0
                    ? 'bg-[--accent] text-white'
                    : 'bg-[--bg-secondary] text-[--text-secondary]'
                  }
                `}>
                  {idx + 1}
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {result.word.split('').map((letter, i) => {
                      // Determine if this letter position uses a tile from the rack
                      const r = result.direction === 'across' ? result.row : result.row + i;
                      const c = result.direction === 'across' ? result.col + i : result.col;
                      const isNew = result.tiles_used && result.tiles_used.includes(i);

                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center justify-center w-7 h-7
                            border rounded-[3px] text-sm font-bold
                            ${isNew
                              ? 'bg-[#dff0e5] border-[--accent] text-[--accent]'
                              : 'bg-[#f2e4c6] border-[#c9a96e] text-[#2c2c2c]'
                            }`}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-xs text-[--text-secondary] mt-1 block">
                    {result.row + 1},{result.col + 1} &middot; {result.direction}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`
                  text-xl font-extrabold
                  ${idx === 0 ? 'text-[--accent]' : 'text-[--text-primary]'}
                `}>
                  {result.score}
                </span>
                <span className="text-xs text-[--text-secondary] block">pts</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
