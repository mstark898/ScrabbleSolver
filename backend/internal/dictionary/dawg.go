package dictionary

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// Node represents a node in the trie (used as the basis for word lookup).
// For a Scrabble solver, a simple trie is sufficient and much simpler to
// implement correctly than a full DAWG. Performance is still excellent
// since lookups traverse at most 15 characters.
type Node struct {
	Children map[byte]*Node
	IsWord   bool
}

type Trie struct {
	Root      *Node
	WordCount int
}

func NewTrie() *Trie {
	return &Trie{
		Root: &Node{Children: make(map[byte]*Node)},
	}
}

func (t *Trie) Insert(word string) {
	node := t.Root
	for i := 0; i < len(word); i++ {
		ch := word[i]
		if node.Children[ch] == nil {
			node.Children[ch] = &Node{Children: make(map[byte]*Node)}
		}
		node = node.Children[ch]
	}
	if !node.IsWord {
		node.IsWord = true
		t.WordCount++
	}
}

func (t *Trie) Contains(word string) bool {
	node := t.Root
	for i := 0; i < len(word); i++ {
		node = node.Children[word[i]]
		if node == nil {
			return false
		}
	}
	return node.IsWord
}

// HasPrefix checks if any word starts with the given prefix.
func (t *Trie) HasPrefix(prefix string) bool {
	node := t.Root
	for i := 0; i < len(prefix); i++ {
		node = node.Children[prefix[i]]
		if node == nil {
			return false
		}
	}
	return true
}

// LoadFromFile loads a word list (one word per line, uppercase).
func LoadFromFile(path string) (*Trie, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("open word list: %w", err)
	}
	defer f.Close()

	trie := NewTrie()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		word := strings.TrimSpace(strings.ToUpper(scanner.Text()))
		if len(word) >= 2 && len(word) <= 15 {
			trie.Insert(word)
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("read word list: %w", err)
	}

	return trie, nil
}
