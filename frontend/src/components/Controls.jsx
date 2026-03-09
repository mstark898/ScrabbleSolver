export default function Controls({
  rackInput,
  onRackInputChange,
  onSetRack,
  onSolve,
  onClear,
  onClearBoard,
  solving,
  direction,
  onToggleDirection,
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Rack input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={rackInput}
          onChange={(e) => onRackInputChange(e.target.value.toUpperCase())}
          placeholder="Enter your tiles (e.g. AEINRST)"
          maxLength={7}
          className="flex-1 px-4 py-2.5 rounded-lg border border-[#c9a96e]/60 bg-white
            text-base font-semibold tracking-widest text-center uppercase
            placeholder:text-[#aaa] placeholder:tracking-normal placeholder:normal-case placeholder:font-normal
            focus:outline-none focus:ring-2 focus:ring-[#2c7a4b] focus:border-transparent
            transition-all"
        />
        <button
          onClick={onSetRack}
          className="px-5 py-2.5 rounded-lg bg-[--accent] text-white font-semibold
            hover:bg-[--accent-hover] active:scale-95 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!rackInput.trim()}
        >
          Set
        </button>
      </div>

      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm text-[--text-secondary]">Placement direction:</span>
        <button
          onClick={onToggleDirection}
          className="px-4 py-1.5 rounded-full bg-[--bg-secondary] border border-[#c9a96e]/40
            text-sm font-semibold hover:bg-[#e5ddd0] transition-all"
        >
          {direction === 'across' ? '\u2192 Across' : '\u2193 Down'}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={onSolve}
          disabled={solving}
          className="px-6 py-2.5 rounded-lg bg-[--accent] text-white font-semibold text-base
            hover:bg-[--accent-hover] active:scale-95 transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2"
        >
          {solving ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Solving...
            </>
          ) : (
            'Find Best Moves'
          )}
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2.5 rounded-lg bg-[--bg-secondary] border border-[#c9a96e]/40
            font-semibold hover:bg-[#e5ddd0] active:scale-95 transition-all duration-150"
        >
          Clear Placed
        </button>
        <button
          onClick={onClearBoard}
          className="px-4 py-2.5 rounded-lg bg-[--bg-secondary] border border-[#c9a96e]/40
            font-semibold hover:bg-[#e5ddd0] active:scale-95 transition-all duration-150"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
}
