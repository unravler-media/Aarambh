package routes

import (
	"github.com/gofiber/fiber/v2"
)

func ApiRoutes(router fiber.Router) {
	router.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "API is Healthy",
		})
	})

	AuthenticationRoutes(router.Group("auth/"))
	CategoryRoutes(router.Group("category/"))
	PostRoutes(router.Group("posts/"))
	CommentRoutes(router.Group("comment/"))
}

// Todo: Add more routes grouping here.
