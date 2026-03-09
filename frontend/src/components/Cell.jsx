import { BOARD_LAYOUT, PREMIUM_LABELS, TILE_SCORES } from '../utils/constants';

const PREMIUM_STYLES = {
  TW: 'bg-[#e05555] text-white',
  DW: 'bg-[#e8a0a0] text-[#8b3a3a]',
  TL: 'bg-[#3a8fd4] text-white',
  DL: 'bg-[#7ec8e3] text-[#2a6a80]',
  ST: 'bg-[#e8a0a0] text-[#8b3a3a]',
  '.': 'bg-[#d6c9a8]',
};

export default function Cell({ row, col, tile, isNew, isSelected, onClick }) {
  const premium = BOARD_LAYOUT[row][col];

  if (tile) {
    const letter = tile.letter;
    const isBlank = tile.isBlank;
    return (
      <button
        onClick={onClick}
        className={`
          relative w-full aspect-square flex items-center justify-center
          rounded-[3px] cursor-pointer select-none transition-all duration-150
          ${isNew
            ? 'bg-[#f5e0b0] border-2 border-[#d4a843] shadow-[0_2px_8px_rgba(212,168,67,0.4)]'
            : 'bg-[#f2e4c6] border border-[#c9a96e] shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
          }
          ${isSelected ? 'ring-2 ring-[#2c7a4b] ring-offset-1' : ''}
          hover:brightness-105
        `}
      >
        <span className={`
          font-bold leading-none
          ${isBlank ? 'text-[#888]' : 'text-[#2c2c2c]'}
          text-[min(1.4rem,3.5vw)]
        `}>
          {letter}
        </span>
        {letter !== '?' && (
          <span className="absolute bottom-[2px] right-[3px] text-[min(0.5rem,1.5vw)] font-semibold text-[#5a5a5a]">
            {TILE_SCORES[letter] ?? ''}
          </span>
        )}
      </button>
    );
  }

  const premiumStyle = PREMIUM_STYLES[premium] || PREMIUM_STYLES['.'];
  const label = PREMIUM_LABELS[premium];

  return (
    <button
      onClick={onClick}
      className={`
        w-full aspect-square flex items-center justify-center
        rounded-[3px] cursor-pointer select-none transition-all duration-150
        border border-[#b8a88a]/40
        ${premiumStyle}
        ${isSelected ? 'ring-2 ring-[#2c7a4b] ring-offset-1' : ''}
        hover:brightness-110
      `}
    >
      {label && (
        premium === 'ST' ? (
          <span className="text-[min(1.2rem,3vw)] leading-none">{label}</span>
        ) : (
          <span className="text-[min(0.4rem,1.2vw)] font-bold leading-tight text-center uppercase tracking-wide px-[1px]">
            {label.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
          </span>
        )
      )}
    </button>
  );
}
