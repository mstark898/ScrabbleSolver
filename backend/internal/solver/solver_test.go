package solver

import (
	"testing"

	"github.com/mstark898/scrabble-solver/internal/dictionary"
)

func buildTestDict() *dictionary.Trie {
	trie := dictionary.NewTrie()
	words := []string{
		"CAT", "CAR", "CART", "CARE", "CARD", "CATS", "CARS",
		"DOG", "DOT", "DONE", "DOOR",
		"AT", "AN", "AS", "IS", "IT", "IN", "ON", "OR", "TO",
		"THE", "AND", "ARE", "FOR", "NOT",
		"STAR", "STARS", "STARE", "START",
		"ART", "ARTS",
	}
	for _, w := range words {
		trie.Insert(w)
	}
	return trie
}

func TestFindMovesEmptyBoard(t *testing.T) {
	dict := buildTestDict()
	s := NewSolver(dict)

	var board Board
	for i := range board {
		for j := range board[i] {
			board[i][j] = '.'
		}
	}

	moves := s.FindMoves(board, "CATDOGS")
	if len(moves) == 0 {
		t.Fatal("Expected at least one move on empty board")
	}

	t.Logf("Found %d moves", len(moves))
	for _, m := range moves[:min(5, len(moves))] {
		t.Logf("  %s at (%d,%d) %s = %d pts", m.Word, m.Row, m.Col, m.Direction, m.Score)
	}
}

func TestFindMovesWithExistingTile(t *testing.T) {
	dict := buildTestDict()
	s := NewSolver(dict)

	var board Board
	for i := range board {
		for j := range board[i] {
			board[i][j] = '.'
		}
	}
	// Place CAT across the center
	board[7][7] = 'C'
	board[7][8] = 'A'
	board[7][9] = 'T'

	moves := s.FindMoves(board, "DOGS")
	if len(moves) == 0 {
		t.Fatal("Expected at least one move with existing tiles")
	}

	t.Logf("Found %d moves", len(moves))
	for _, m := range moves[:min(5, len(moves))] {
		t.Logf("  %s at (%d,%d) %s = %d pts", m.Word, m.Row, m.Col, m.Direction, m.Score)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
