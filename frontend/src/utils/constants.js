// Words With Friends / NYT Crossplay board layout
// . = normal, DL = double letter, TL = triple letter, DW = double word, TW = triple word
export const BOARD_LAYOUT = [
  ['.', '.', '.', 'TW', '.', '.', 'TL', '.', 'TL', '.', '.', 'TW', '.', '.', '.'],
  ['.', '.', 'DL', '.', '.', 'DW', '.', '.', '.', 'DW', '.', '.', 'DL', '.', '.'],
  ['.', 'DL', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', 'DL', '.'],
  ['TW', '.', '.', 'TL', '.', '.', '.', 'DW', '.', '.', '.', 'TL', '.', '.', 'TW'],
  ['.', '.', 'DL', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DL', '.', '.'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['TL', '.', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', '.', 'TL'],
  ['.', '.', '.', 'DW', '.', '.', '.', '.', '.', '.', '.', 'DW', '.', '.', '.'],
  ['TL', '.', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', '.', 'TL'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['.', '.', 'DL', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', 'DL', '.', '.'],
  ['TW', '.', '.', 'TL', '.', '.', '.', 'DW', '.', '.', '.', 'TL', '.', '.', 'TW'],
  ['.', 'DL', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', 'DL', '.'],
  ['.', '.', 'DL', '.', '.', 'DW', '.', '.', '.', 'DW', '.', '.', 'DL', '.', '.'],
  ['.', '.', '.', 'TW', '.', '.', 'TL', '.', 'TL', '.', '.', 'TW', '.', '.', '.'],
];

// Words With Friends tile point values
export const TILE_SCORES = {
  A: 1, B: 4, C: 4, D: 2, E: 1, F: 4, G: 3, H: 3, I: 1,
  J: 10, K: 5, L: 2, M: 4, N: 2, O: 1, P: 4, Q: 10, R: 1,
  S: 1, T: 1, U: 2, V: 5, W: 4, X: 8, Y: 3, Z: 10, '?': 0,
};

// Words With Friends tile distribution (104 tiles total)
export const TILE_DISTRIBUTION = {
  A: 9, B: 2, C: 2, D: 5, E: 13, F: 2, G: 3, H: 4, I: 8,
  J: 1, K: 1, L: 4, M: 2, N: 5, O: 8, P: 2, Q: 1, R: 6,
  S: 5, T: 7, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1, '?': 2,
};

export const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?';

export const PREMIUM_LABELS = {
  TW: 'TW',
  DW: 'DW',
  TL: 'TL',
  DL: 'DL',
};

export function createEmptyBoard() {
  return Array.from({ length: 15 }, () => Array(15).fill(null));
}

// Compute unseen tiles: total distribution minus what's on the board minus what's in hand
export function computeUnseen(boardTiles, handTiles) {
  const remaining = {};
  for (const [letter, count] of Object.entries(TILE_DISTRIBUTION)) {
    remaining[letter] = count;
  }

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
