export default function Results({ results, onSelectResult, activeResult }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full">
      <label className="text-xs font-semibold text-[--text-secondary] uppercase tracking-wider mb-1.5 block">
        Best Moves ({results.length})
      </label>
      <div className="flex flex-col max-h-[360px] overflow-y-auto rounded border border-[#ddd] bg-white">
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
                flex items-center justify-between px-3 py-2 text-left
                transition-colors duration-100 hover:bg-[#f0f8f0]
                ${isActive ? 'bg-[#e8f5e9]' : ''}
                ${idx > 0 ? 'border-t border-[#eee]' : ''}
              `}
            >
              <div className="flex items-center gap-2.5">
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold
                  ${idx === 0 ? 'bg-[--accent] text-white' : 'bg-[#eee] text-[#888]'}
                `}>
                  {idx + 1}
                </span>
                <div>
                  <div className="flex gap-px">
                    {result.word.split('').map((letter, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center w-6 h-6
                          bg-[#f5e6c8] border border-[#d4b87a] rounded-sm
                          text-xs font-extrabold text-[#2c2c2c]"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                  <span className="text-[0.6rem] text-[--text-secondary] mt-0.5 block">
                    ({result.row + 1},{result.col + 1}) {result.direction}
                  </span>
                </div>
              </div>
              <span className={`text-lg font-extrabold tabular-nums ${idx === 0 ? 'text-[--accent]' : 'text-[--text-primary]'}`}>
                {result.score}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
