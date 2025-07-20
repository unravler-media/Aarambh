package middlewares

import (
	"os"

	jwtMiddleware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

// func for specify routes group with JWT authentication.
func Protect() func(*fiber.Ctx) error {
	// Create Configuration for JWT Auth Middleware
	config := jwtMiddleware.Config{
		SigningKey: jwtMiddleware.SigningKey{
			Key: []byte(os.Getenv("secretKey")),
		},
		ContextKey: "jwt",
		ErrorHandler: jwtError,
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
