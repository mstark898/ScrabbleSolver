import { BOARD_LAYOUT, PREMIUM_LABELS, TILE_SCORES } from '../utils/constants';

const PREMIUM_COLORS = {
  TW: { bg: '#d4a0a0', text: '#8b4040' },
  DW: { bg: '#c4b8d4', text: '#6b5080' },
  TL: { bg: '#b8c8a0', text: '#5a6e3a' },
  DL: { bg: '#c8d8e8', text: '#5a7a9a' },
};

export default function Cell({ row, col, tile, isSelected, onClick }) {
  const premium = BOARD_LAYOUT[row][col];
  const isCenter = row === 7 && col === 7;

  if (tile) {
    const letter = tile.letter;
    const isBlank = tile.isBlank;
    const isPreview = tile.isPreview;

    return (
      <button
        onClick={onClick}
        className={`
          relative w-full aspect-square flex items-center justify-center
          rounded-sm cursor-pointer select-none transition-all duration-100
          ${isPreview
            ? 'bg-[#c8e6c9] border-2 border-[#43a047]'
            : 'bg-[#f5e6c8] border border-[#d4b87a] shadow-sm'
          }
          ${isSelected ? 'ring-2 ring-[#4a90d9] ring-offset-1' : ''}
        `}
      >
        <span className={`
          font-extrabold leading-none
          ${isBlank ? 'text-[#999] italic' : isPreview ? 'text-[#2e7d32]' : 'text-[#2c2c2c]'}
          text-[min(1.2rem,3.2vw)]
        `}>
          {letter}
        </span>
        {!isBlank && (
          <span className={`
            absolute bottom-[1px] right-[2px] font-bold
            text-[min(0.45rem,1.3vw)] leading-none
            ${isPreview ? 'text-[#2e7d32]/50' : 'text-[#8b7355]'}
          `}>
            {TILE_SCORES[letter] ?? ''}
          </span>
        )}
      </button>
    );
  }

  const premiumInfo = PREMIUM_COLORS[premium];
  const label = PREMIUM_LABELS[premium];

  return (
    <button
      onClick={onClick}
      style={premiumInfo ? { backgroundColor: premiumInfo.bg, color: premiumInfo.text } : undefined}
      className={`
        w-full aspect-square flex items-center justify-center
        rounded-sm cursor-pointer select-none transition-all duration-100
        ${premiumInfo
          ? ''
          : isCenter
            ? 'bg-[#2c2c2c]'
            : 'bg-[#e8e4dc] border border-[#d8d4cc]'
        }
        ${isSelected ? 'ring-2 ring-[#4a90d9] ring-offset-1' : ''}
        hover:brightness-95
      `}
    >
      {label ? (
        <span className="text-[min(0.5rem,1.4vw)] font-extrabold leading-none opacity-80">
          {label}
        </span>
      ) : isCenter ? (
        <span className="text-[min(0.9rem,2.4vw)] leading-none text-white">★</span>
      ) : null}
    </button>
  );
}
