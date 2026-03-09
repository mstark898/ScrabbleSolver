export default function Controls({
  onSolve,
  onClearBoard,
  solving,
  hasHand,
}) {
  return (
    <div className="flex gap-2 justify-center w-full max-w-md">
      <button
        onClick={onSolve}
        disabled={solving || !hasHand}
        className="flex-1 px-6 py-3 rounded-lg bg-[--accent] text-white font-semibold text-base
          hover:bg-[--accent-hover] active:scale-[0.98] transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
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
        onClick={onClearBoard}
        className="px-4 py-3 rounded-lg bg-[--bg-secondary] border border-[#c9a96e]/40
          font-semibold hover:bg-[#e5ddd0] active:scale-[0.98] transition-all duration-150"
      >
        Reset All
      </button>
    </div>
  );
}
