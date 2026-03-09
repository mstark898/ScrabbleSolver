export default function Controls({ onSolve, solving, hasHand }) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={onSolve}
        disabled={solving || !hasHand}
        className="px-6 py-2.5 rounded-full bg-[#2d5f4e] text-white font-semibold text-sm
          hover:bg-[#24503f] active:scale-[0.98] transition-all duration-100
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {solving ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search
          </>
        )}
      </button>
      <span className="text-sm text-[--text-secondary]">Top 40 answers</span>
    </div>
  );
}
