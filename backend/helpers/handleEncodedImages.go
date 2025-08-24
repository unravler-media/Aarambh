package helpers

import (
	"encoding/base64"
	"strings"
)

func HandleBase64Image(img string) ([]byte, error) {
	raw := img

	// frontend will give us base64 with extra information (data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...)
	// we need to remove that.
	if strings.Contains(raw, ",") {
		parts := strings.SplitN(raw, ",", 2)
		raw = parts[1]
	}

	// frontend or json might inlcude whitespaces or line breaks. handle that
	raw = strings.TrimSpace(raw)
	raw = strings.ReplaceAll(raw, "\n", "")

	n, err := base64.StdEncoding.DecodeString(raw)
	if err != nil {
		return nil, err
	}

	data := []byte(n)
	return data, nil
}
