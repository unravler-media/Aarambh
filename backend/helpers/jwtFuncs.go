package helpers

import (
	"fmt"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func ExtractUser(tokenString string) (interface{}, error) {
	newToken := strings.Replace(tokenString, " ", "", 1)
	var secretKey = []byte(os.Getenv("secretKey"))
	token, err := jwt.Parse(newToken, func(t *jwt.Token) (any, error) {
		// Validate signing method (HMAC in this case)
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println("Token is valid ✅")
		sub := claims["sub"]
		return sub, nil
	} else {
		fmt.Println("Invalid token ❌")
		return nil, err
	}
}
