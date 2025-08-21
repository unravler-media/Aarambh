package helpers

import (
	"regexp"
	"strings"
)

func Slugify(s string) string {
	// Step 1: lower case
	s = strings.ToLower(s)

	// Step 2: remove unwanted punctuation (but keep spaces & dashes)
	replacer := strings.NewReplacer(
		"'", "",
		"\"", "",
		".", " ",
		":", " ",
		"_", " ",
	)
	s = replacer.Replace(s)

	// Step 3: replace any non-letter/number with a dash
	re := regexp.MustCompile(`[^a-z0-9]+`)
	s = re.ReplaceAllString(s, "-")

	// Step 4: trim leading/trailing dashes
	s = strings.Trim(s, "-")

	return s
}
