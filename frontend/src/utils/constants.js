// NYT Crossplay board layout
// . = normal, DL = double letter (2L), TL = triple letter (3L), DW = double word (2W), TW = triple word (3W)
export const BOARD_LAYOUT = [
  ['TL', '.', '.', 'TW', '.', '.', '.', '.', '.', '.', '.', 'TW', '.', '.', 'TL'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['.', 'DL', '.', '.', 'TL', '.', '.', '.', '.', '.', 'TL', '.', '.', 'DL', '.'],
  ['TW', '.', 'DL', '.', '.', '.', '.', 'DW', '.', '.', '.', '.', 'DL', '.', 'TW'],
  ['.', '.', '.', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', '.', '.', '.'],
  ['.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.'],
  ['.', '.', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', '.', '.'],
  ['DL', '.', 'DW', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', 'DW', '.', 'DL'],
  ['.', '.', '.', '.', 'DL', '.', '.', '.', '.', '.', 'DL', '.', '.', '.', '.'],
  ['.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.'],
  ['.', '.', '.', '.', '.', '.', 'DL', '.', 'DL', '.', '.', '.', '.', '.', '.'],
  ['TW', '.', 'DL', '.', '.', '.', '.', 'DW', '.', '.', '.', '.', 'DL', '.', 'TW'],
  ['.', 'DL', '.', '.', 'TL', '.', '.', '.', '.', '.', 'TL', '.', '.', 'DL', '.'],
  ['.', 'DW', '.', '.', '.', 'TL', '.', '.', '.', 'TL', '.', '.', '.', 'DW', '.'],
  ['TL', '.', '.', 'TW', '.', '.', '.', '.', '.', '.', '.', 'TW', '.', '.', 'TL'],
];

// NYT Crossplay tile point values
export const TILE_SCORES = {
  A: 1, B: 4, C: 3, D: 2, E: 1, F: 4, G: 4, H: 3, I: 1,
  J: 10, K: 6, L: 2, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 2, V: 6, W: 5, X: 8, Y: 4, Z: 10, '?': 0,
};

// NYT Crossplay tile distribution (100 tiles total)
export const TILE_DISTRIBUTION = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 3, I: 8,
  J: 1, K: 1, L: 4, M: 2, N: 5, O: 8, P: 2, Q: 1, R: 6,
  S: 5, T: 6, U: 3, V: 2, W: 2, X: 1, Y: 2, Z: 1, '?': 3,
};

export const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?';

export const PREMIUM_LABELS = {
  TW: '3W',
  DW: '2W',
  TL: '3L',
  DL: '2L',
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
