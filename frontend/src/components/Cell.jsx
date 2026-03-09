import { BOARD_LAYOUT, PREMIUM_LABELS, TILE_SCORES } from '../utils/constants';

const PREMIUM_COLORS = {
  TW: { bg: '#ff6b6b', text: '#fff' },
  DW: { bg: '#ff9f43', text: '#fff' },
  TL: { bg: '#54a0ff', text: '#fff' },
  DL: { bg: '#5ec4b6', text: '#fff' },
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
            : 'bg-[#f5e6c8] border border-[#d4b87a]'
          }
          ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-[#2d5016]' : ''}
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
            ? 'bg-[#5a8f3d] border border-[#4a7a30]'
            : 'bg-[#3d7a2a] border border-[#346b22]/60'
        }
        ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-[#2d5016]' : ''}
        hover:brightness-110
      `}
    >
      {label ? (
        <span className="text-[min(0.5rem,1.4vw)] font-extrabold leading-none opacity-90">
          {label}
        </span>
      ) : isCenter ? (
        <span className="text-[min(0.9rem,2.4vw)] leading-none text-white/70">+</span>
      ) : null}
    </button>
  );
}
