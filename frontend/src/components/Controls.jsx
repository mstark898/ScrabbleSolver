export default function Controls({ onSolve, onClearBoard, solving, hasHand }) {
  return (
    <div className="flex gap-2 w-full">
      <button
        onClick={onSolve}
        disabled={solving || !hasHand}
        className="flex-1 px-4 py-2.5 rounded bg-[--accent] text-white font-semibold text-sm
          hover:bg-[--accent-hover] active:scale-[0.98] transition-all duration-100
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {solving ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Solving...
          </>
        ) : (
          'Find Best Moves'
        )}
      </button>
      <button
        onClick={onClearBoard}
        className="px-4 py-2.5 rounded bg-white border border-[#ddd] text-sm
          font-semibold text-[--text-secondary] hover:bg-[--bg-secondary]
          active:scale-[0.98] transition-all duration-100"
      >
        Reset
      </button>
    </div>
  );
}
