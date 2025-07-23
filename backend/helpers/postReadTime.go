package helpers

import (
	"math"
	"strings"
)

// calculateReadTime takes blog content and returns estimated read time in minutes
func CalculateReadTime(content string) int {
	const wordsPerMinute = 200

	// Split content into words
	words := strings.Fields(content)
	wordCount := len(words)

	// Calculate read time and round up
	readTime := math.Ceil(float64(wordCount) / float64(wordsPerMinute))

	return int(readTime)
}
