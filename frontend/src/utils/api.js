const API_BASE = '/api';

export async function solveMoves(board, rack) {
  const response = await fetch(`${API_BASE}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board, rack }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Failed to get solutions');
  }

  return response.json();
}
