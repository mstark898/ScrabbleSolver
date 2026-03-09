package solver

import (
	"sort"

	"github.com/mstark898/scrabble-solver/internal/dictionary"
)

const BoardSize = 15

var TileScores = map[byte]int{
	'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
	'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
	'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10,
}

// Premium square types
type Premium int

const (
	None Premium = iota
	DL
	TL
	DW
	TW
)

// Standard Scrabble board premium layout
var BoardLayout [BoardSize][BoardSize]Premium

func init() {
	// Triple word scores
	tw := [][2]int{{0, 0}, {0, 7}, {0, 14}, {7, 0}, {7, 14}, {14, 0}, {14, 7}, {14, 14}}
	for _, p := range tw {
		BoardLayout[p[0]][p[1]] = TW
	}

	// Double word scores
	dw := [][2]int{
		{1, 1}, {1, 13}, {2, 2}, {2, 12}, {3, 3}, {3, 11}, {4, 4}, {4, 10},
		{10, 4}, {10, 10}, {11, 3}, {11, 11}, {12, 2}, {12, 12}, {13, 1}, {13, 13},
		{7, 7}, // center star
	}
	for _, p := range dw {
		BoardLayout[p[0]][p[1]] = DW
	}

	// Triple letter scores
	tl := [][2]int{
		{1, 5}, {1, 9}, {5, 1}, {5, 5}, {5, 9}, {5, 13},
		{9, 1}, {9, 5}, {9, 9}, {9, 13}, {13, 5}, {13, 9},
	}
	for _, p := range tl {
		BoardLayout[p[0]][p[1]] = TL
	}

	// Double letter scores
	dl := [][2]int{
		{0, 3}, {0, 11}, {2, 6}, {2, 8}, {3, 0}, {3, 7}, {3, 14},
		{6, 2}, {6, 6}, {6, 8}, {6, 12},
		{7, 3}, {7, 11},
		{8, 2}, {8, 6}, {8, 8}, {8, 12},
		{11, 0}, {11, 7}, {11, 14}, {12, 6}, {12, 8}, {14, 3}, {14, 11},
	}
	for _, p := range dl {
		BoardLayout[p[0]][p[1]] = DL
	}
}

type Board [BoardSize][BoardSize]byte // '.' for empty, 'A'-'Z' for tiles

type Move struct {
	Word      string `json:"word"`
	Row       int    `json:"row"`
	Col       int    `json:"col"`
	Direction string `json:"direction"` // "across" or "down"
	Score     int    `json:"score"`
}

type Solver struct {
	Dict *dictionary.Trie
}

func NewSolver(dict *dictionary.Trie) *Solver {
	return &Solver{Dict: dict}
}

func (s *Solver) FindMoves(board Board, rack string) []Move {
	var moves []Move

	rackMap := make(map[byte]int)
	for i := 0; i < len(rack); i++ {
		rackMap[rack[i]]++
	}

	isEmpty := true
	for r := 0; r < BoardSize; r++ {
		for c := 0; c < BoardSize; c++ {
			if board[r][c] != '.' {
				isEmpty = false
				break
			}
		}
		if !isEmpty {
			break
		}
	}

	// Find all anchor squares (empty cells adjacent to a filled cell, or center on empty board)
	anchors := s.findAnchors(board, isEmpty)

	// Try placing words across and down from each anchor
	for _, anchor := range anchors {
		s.findMovesAt(board, rackMap, anchor[0], anchor[1], true, &moves)  // across
		s.findMovesAt(board, rackMap, anchor[0], anchor[1], false, &moves) // down
	}

	// Deduplicate moves
	seen := make(map[string]bool)
	var unique []Move
	for _, m := range moves {
		key := moveKey(m.Row, m.Col, m.Direction, m.Word)
		if !seen[key] {
			seen[key] = true
			unique = append(unique, m)
		}
	}

	// Sort by score descending
	sort.Slice(unique, func(i, j int) bool {
		return unique[i].Score > unique[j].Score
	})

	// Return top 20
	if len(unique) > 20 {
		unique = unique[:20]
	}

	return unique
}

func moveKey(row, col int, direction, word string) string {
	return string(rune(row)) + "|" + string(rune(col)) + "|" + direction + "|" + word
}

func (s *Solver) findAnchors(board Board, isEmpty bool) [][2]int {
	if isEmpty {
		return [][2]int{{7, 7}}
	}

	var anchors [][2]int
	for r := 0; r < BoardSize; r++ {
		for c := 0; c < BoardSize; c++ {
			if board[r][c] == '.' && hasAdjacentTile(board, r, c) {
				anchors = append(anchors, [2]int{r, c})
			}
		}
	}
	return anchors
}

func hasAdjacentTile(board Board, r, c int) bool {
	if r > 0 && board[r-1][c] != '.' {
		return true
	}
	if r < BoardSize-1 && board[r+1][c] != '.' {
		return true
	}
	if c > 0 && board[r][c-1] != '.' {
		return true
	}
	if c < BoardSize-1 && board[r][c+1] != '.' {
		return true
	}
	return false
}

func (s *Solver) findMovesAt(board Board, rack map[byte]int, anchorRow, anchorCol int, across bool, moves *[]Move) {
	// Find the leftmost/topmost position we can start from
	var startR, startC int
	if across {
		startR = anchorRow
		startC = anchorCol
		// Walk left to find where we can start placing
		for startC > 0 && board[startR][startC-1] != '.' {
			startC--
		}
		// Also try extending left with rack tiles
		maxLeft := 0
		for c := anchorCol - 1; c >= 0 && board[startR][c] == '.' && !hasAdjacentTile(board, startR, c); c-- {
			maxLeft++
		}
		// Try starting from various positions
		for leftExt := 0; leftExt <= maxLeft; leftExt++ {
			sc := anchorCol - leftExt
			if sc < startC {
				sc = startC
			}
			s.tryBuild(board, rack, sc, anchorRow, across, anchorRow, anchorCol, moves)
		}
		if startC < anchorCol {
			s.tryBuild(board, rack, startC, anchorRow, across, anchorRow, anchorCol, moves)
		}
	} else {
		startR = anchorRow
		startC = anchorCol
		for startR > 0 && board[startR-1][startC] != '.' {
			startR--
		}
		maxUp := 0
		for r := anchorRow - 1; r >= 0 && board[r][startC] == '.' && !hasAdjacentTile(board, r, startC); r-- {
			maxUp++
		}
		for upExt := 0; upExt <= maxUp; upExt++ {
			sr := anchorRow - upExt
			if sr < startR {
				sr = startR
			}
			s.tryBuild(board, rack, startC, sr, across, anchorRow, anchorCol, moves)
		}
		if startR < anchorRow {
			s.tryBuild(board, rack, startC, startR, across, anchorRow, anchorCol, moves)
		}
	}
}

func (s *Solver) tryBuild(board Board, rack map[byte]int, startC, startR int, across bool, anchorR, anchorC int, moves *[]Move) {
	rackCopy := make(map[byte]int)
	for k, v := range rack {
		rackCopy[k] = v
	}

	s.buildWord(board, rackCopy, startR, startC, across, anchorR, anchorC,
		s.Dict.Root, []byte{}, false, moves)
}

func (s *Solver) buildWord(board Board, rack map[byte]int, row, col int, across bool, anchorR, anchorC int, node *dictionary.Node, word []byte, usedAnchor bool, moves *[]Move) {
	if row < 0 || row >= BoardSize || col < 0 || col >= BoardSize {
		// End of board - check if valid word
		if node.IsWord && usedAnchor && len(word) >= 2 {
			s.checkAndAddMove(board, word, row, col, across, moves)
		}
		return
	}

	isAnchor := row == anchorR && col == anchorC

	if board[row][col] != '.' {
		// Existing tile on board
		ch := board[row][col]
		child := node.Children[ch]
		if child == nil {
			return
		}
		newWord := append(append([]byte{}, word...), ch)
		nextR, nextC := nextPos(row, col, across)
		s.buildWord(board, rack, nextR, nextC, across, anchorR, anchorC,
			child, newWord, usedAnchor || isAnchor, moves)
	} else {
		// Empty cell - try placing rack tiles
		// First check: if we're past the anchor and haven't used it, bail
		if !usedAnchor && isPast(row, col, anchorR, anchorC, across) {
			return
		}

		// Check if word so far is complete
		if node.IsWord && usedAnchor && len(word) >= 2 {
			s.checkAndAddMove(board, word, row, col, across, moves)
		}

		for ch := byte('A'); ch <= 'Z'; ch++ {
			child := node.Children[ch]
			if child == nil {
				continue
			}
			if rack[ch] > 0 {
				// Check cross-words
				if !s.isValidCrossWord(board, row, col, ch, across) {
					continue
				}
				rack[ch]--
				newWord := append(append([]byte{}, word...), ch)
				nextR, nextC := nextPos(row, col, across)
				s.buildWord(board, rack, nextR, nextC, across, anchorR, anchorC,
					child, newWord, usedAnchor || isAnchor, moves)
				rack[ch]++
			}
			// Try blank tile
			if rack['?'] > 0 {
				if !s.isValidCrossWord(board, row, col, ch, across) {
					continue
				}
				rack['?']--
				newWord := append(append([]byte{}, word...), ch)
				nextR, nextC := nextPos(row, col, across)
				s.buildWord(board, rack, nextR, nextC, across, anchorR, anchorC,
					child, newWord, usedAnchor || isAnchor, moves)
				rack['?']++
			}
		}
	}
}

func isPast(row, col, anchorR, anchorC int, across bool) bool {
	if across {
		return col > anchorC
	}
	return row > anchorR
}

func nextPos(row, col int, across bool) (int, int) {
	if across {
		return row, col + 1
	}
	return row + 1, col
}

func (s *Solver) isValidCrossWord(board Board, row, col int, letter byte, mainAcross bool) bool {
	// Check perpendicular cross-word
	var start, end int

	if mainAcross {
		// Check vertical cross-word
		start = row
		for start > 0 && board[start-1][col] != '.' {
			start--
		}
		end = row
		for end < BoardSize-1 && board[end+1][col] != '.' {
			end++
		}
		if start == end {
			return true // No cross-word
		}
		// Build the cross-word
		word := make([]byte, 0, end-start+1)
		for r := start; r <= end; r++ {
			if r == row {
				word = append(word, letter)
			} else {
				word = append(word, board[r][col])
			}
		}
		return s.Dict.Contains(string(word))
	} else {
		// Check horizontal cross-word
		start = col
		for start > 0 && board[row][start-1] != '.' {
			start--
		}
		end = col
		for end < BoardSize-1 && board[row][end+1] != '.' {
			end++
		}
		if start == end {
			return true
		}
		word := make([]byte, 0, end-start+1)
		for c := start; c <= end; c++ {
			if c == col {
				word = append(word, letter)
			} else {
				word = append(word, board[row][c])
			}
		}
		return s.Dict.Contains(string(word))
	}
}

func (s *Solver) checkAndAddMove(board Board, word []byte, endRow, endCol int, across bool, moves *[]Move) {
	// Calculate start position
	wordLen := len(word)
	var startR, startC int
	if across {
		startR = endRow
		startC = endCol - wordLen
	} else {
		startR = endRow - wordLen
		startC = endCol
	}

	if startR < 0 || startC < 0 {
		return
	}

	// Verify the word is actually placed touching/using at least one new tile
	usedNewTile := false
	for i := 0; i < wordLen; i++ {
		r, c := startR, startC
		if across {
			c += i
		} else {
			r += i
		}
		if r >= BoardSize || c >= BoardSize {
			return
		}
		if board[r][c] == '.' {
			usedNewTile = true
		}
	}
	if !usedNewTile {
		return
	}

	score := s.scoreMove(board, word, startR, startC, across)

	dir := "across"
	if !across {
		dir = "down"
	}

	*moves = append(*moves, Move{
		Word:      string(word),
		Row:       startR,
		Col:       startC,
		Direction: dir,
		Score:     score,
	})
}

func (s *Solver) scoreMove(board Board, word []byte, startR, startC int, across bool) int {
	mainWordScore := 0
	wordMultiplier := 1
	crossWordScores := 0
	tilesPlaced := 0

	for i := 0; i < len(word); i++ {
		r, c := startR, startC
		if across {
			c += i
		} else {
			r += i
		}

		letter := word[i]
		letterScore := TileScores[letter]

		if board[r][c] != '.' {
			// Existing tile - no premium
			mainWordScore += letterScore
		} else {
			tilesPlaced++
			// New tile - apply premiums
			premium := BoardLayout[r][c]
			switch premium {
			case DL:
				mainWordScore += letterScore * 2
			case TL:
				mainWordScore += letterScore * 3
			case DW:
				mainWordScore += letterScore
				wordMultiplier *= 2
			case TW:
				mainWordScore += letterScore
				wordMultiplier *= 3
			default:
				mainWordScore += letterScore
			}

			// Score cross-words
			crossScore := s.scoreCrossWord(board, r, c, letter, across)
			if crossScore > 0 {
				// Apply letter premium to cross-word score too
				crossLetterScore := letterScore
				switch premium {
				case DL:
					crossLetterScore = letterScore * 2
				case TL:
					crossLetterScore = letterScore * 3
				default:
					crossLetterScore = letterScore
				}
				crossBase := crossScore - letterScore + crossLetterScore
				switch premium {
				case DW:
					crossBase *= 2
				case TW:
					crossBase *= 3
				}
				crossWordScores += crossBase
			}
		}
	}

	total := mainWordScore*wordMultiplier + crossWordScores

	// Bingo bonus: 50 points for using all 7 tiles
	if tilesPlaced == 7 {
		total += 50
	}

	return total
}

func (s *Solver) scoreCrossWord(board Board, row, col int, letter byte, mainAcross bool) int {
	score := 0

	if mainAcross {
		// Vertical cross-word
		start := row
		for start > 0 && board[start-1][col] != '.' {
			start--
		}
		end := row
		for end < BoardSize-1 && board[end+1][col] != '.' {
			end++
		}
		if start == end {
			return 0
		}
		for r := start; r <= end; r++ {
			if r == row {
				score += TileScores[letter]
			} else {
				score += TileScores[board[r][col]]
			}
		}
	} else {
		// Horizontal cross-word
		start := col
		for start > 0 && board[row][start-1] != '.' {
			start--
		}
		end := col
		for end < BoardSize-1 && board[row][end+1] != '.' {
			end++
		}
		if start == end {
			return 0
		}
		for c := start; c <= end; c++ {
			if c == col {
				score += TileScores[letter]
			} else {
				score += TileScores[board[row][c]]
			}
		}
	}

	return score
}
