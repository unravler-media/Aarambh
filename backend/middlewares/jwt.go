package middlewares

import (
	"os"

	jwtMiddleware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	Username string `json:"username"`
	Email string `json:"email"`
	Role  string `json:"role"`
	FullName string `json:"full_name"`
	jwt.RegisteredClaims
}

// func for specify routes group with JWT authentication.

// JWT Middleware setup
// The `ContextKey` option specifies the key under which the token
// (and its claims) will be stored in c.Locals()
func Protect() func(*fiber.Ctx) error {
	// Create Configuration for JWT Auth Middleware
	
	config := jwtMiddleware.Config{
		SigningKey: jwtMiddleware.SigningKey{
			Key: []byte(os.Getenv("secretKey")),
		},
		ContextKey: "session_user",
		ErrorHandler: jwtError, // This is the default, but good to be explicit
		// Claims: &UserClaims{},  // This is important if you have custom claims
	}
	return jwtMiddleware.New(config)
}

func jwtError(c *fiber.Ctx, err error) error {
	// Return 401 for Failed Auth
	if err.Error() == "Missing or Malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": err.Error(),
		})
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"response": "Missing authentication tokens",
	})
}
