package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/mstark898/scrabble-solver/internal/dictionary"
	"github.com/mstark898/scrabble-solver/internal/solver"
)

type SolveRequest struct {
	Board [][]string `json:"board"`
	Rack  string     `json:"rack"`
}

type SolveResponse struct {
	Moves []solver.Move `json:"moves"`
}

func main() {
	// Find the word list
	wordListPath := os.Getenv("WORD_LIST_PATH")
	if wordListPath == "" {
		// Try common locations
		candidates := []string{
			"data/words.txt",
			"../data/words.txt",
			"/usr/share/dict/words",
		}
		exe, _ := os.Executable()
		if exe != "" {
			candidates = append([]string{
				filepath.Join(filepath.Dir(exe), "data", "words.txt"),
			}, candidates...)
		}
		for _, c := range candidates {
			if _, err := os.Stat(c); err == nil {
				wordListPath = c
				break
			}
		}
	}

	if wordListPath == "" {
		log.Fatal("No word list found. Set WORD_LIST_PATH or place words.txt in data/")
	}

	log.Printf("Loading dictionary from %s...", wordListPath)
	dict, err := dictionary.LoadFromFile(wordListPath)
	if err != nil {
		log.Fatalf("Failed to load dictionary: %v", err)
	}
	log.Printf("Loaded %d words", dict.WordCount)

	s := solver.NewSolver(dict)

	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/solve", func(w http.ResponseWriter, r *http.Request) {
		var req SolveRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if len(req.Board) != 15 {
			http.Error(w, "Board must be 15x15", http.StatusBadRequest)
			return
		}

		var board solver.Board
		for i := 0; i < 15; i++ {
			if len(req.Board[i]) != 15 {
				http.Error(w, "Board must be 15x15", http.StatusBadRequest)
				return
			}
			for j := 0; j < 15; j++ {
				cell := req.Board[i][j]
				if cell == "." || cell == "" {
					board[i][j] = '.'
				} else if len(cell) == 1 && cell[0] >= 'A' && cell[0] <= 'Z' {
					board[i][j] = cell[0]
				} else {
					http.Error(w, fmt.Sprintf("Invalid cell value at [%d][%d]: %q", i, j, cell), http.StatusBadRequest)
					return
				}
			}
		}

		if len(req.Rack) == 0 || len(req.Rack) > 7 {
			http.Error(w, "Rack must have 1-7 tiles", http.StatusBadRequest)
			return
		}

		moves := s.FindMoves(board, req.Rack)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(SolveResponse{Moves: moves})
	})

	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "ok",
			"words":  dict.WordCount,
		})
	})

	// Serve frontend static files in production
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "../frontend/dist"
	}
	if info, err := os.Stat(staticDir); err == nil && info.IsDir() {
		fs := http.FileServer(http.Dir(staticDir))
		mux.Handle("/", fs)
		log.Printf("Serving static files from %s", staticDir)
	}

	// CORS middleware for development
	handler := corsMiddleware(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on :%s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
