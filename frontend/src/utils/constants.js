// Standard Scrabble board layout
// . = normal, DL = double letter, TL = triple letter, DW = double word, TW = triple word, ST = star (center)
export const BOARD_LAYOUT = [
  ['TW', '.', '.', 'DL', '.', '.', '.', 'TW', '.', '.', '.', 'DL', '.', '.', 'TW'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['.', '.', 'DW', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DW', '.', '.'],
  ['DL', '.', '.', 'DW', '.', '.', '.', 'DL', '.', '.', '.', 'DW', '.', '.', 'DL'],
  ['.', '.', '.', '.', 'DW', '.', '.', '.', '.', '.', 'DW', '.', '.', '.', '.'],
  ['.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.'],
  ['.', '.', 'DL', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DL', '.', '.'],
  ['TW', '.', '.', 'DL', '.', '.', '.', 'ST', '.', '.', '.', 'DL', '.', '.', 'TW'],
  ['.', '.', 'DL', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DL', '.', '.'],
  ['.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.'],
  ['.', '.', '.', '.', 'DW', '.', '.', '.', '.', '.', 'DW', '.', '.', '.', '.'],
  ['DL', '.', '.', 'DW', '.', '.', '.', 'DL', '.', '.', '.', 'DW', '.', '.', 'DL'],
  ['.', '.', 'DW', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DW', '.', '.'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['TW', '.', '.', 'DL', '.', '.', '.', 'TW', '.', '.', '.', 'DL', '.', '.', 'TW'],
];

export const TILE_SCORES = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10, '?': 0,
};

// Full Scrabble tile distribution (100 tiles total)
export const TILE_DISTRIBUTION = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9,
  J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6,
  S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1, '?': 2,
};

export const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?';

export const PREMIUM_LABELS = {
  TW: 'TRIPLE WORD',
  DW: 'DOUBLE WORD',
  TL: 'TRIPLE LETTER',
  DL: 'DOUBLE LETTER',
  ST: '\u2605',
};

export function createEmptyBoard() {
  return Array.from({ length: 15 }, () => Array(15).fill(null));
}

// Compute unseen tiles: total distribution minus what's on the board minus what's in hand
export function computeUnseen(boardTiles, handTiles) {
  // Start with full distribution
  const remaining = {};
  for (const [letter, count] of Object.entries(TILE_DISTRIBUTION)) {
    remaining[letter] = count;
  }

  // Subtract board tiles
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      const cell = boardTiles[r][c];
      if (cell) {
        const key = cell.isBlank ? '?' : cell.letter;
        if (remaining[key] !== undefined) {
          remaining[key] = Math.max(0, remaining[key] - 1);
        }
      }
    }
  }

  // Subtract hand tiles
  for (const letter of handTiles) {
    const key = letter === '?' ? '?' : letter;
    if (remaining[key] !== undefined) {
      remaining[key] = Math.max(0, remaining[key] - 1);
    }
  }

  return remaining;
}

export function totalTileCount(tileCounts) {
  return Object.values(tileCounts).reduce((sum, n) => sum + n, 0);
}
