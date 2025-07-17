package routes

import (
	"github.com/gofiber/fiber/v2"
	"backend/logic"
)

func AuthenticationRoutes(router fiber.Router) {
	router.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Auth Routes",
		})
	})

	router.Post("login/", logic.LoginHandler)
	router.Post("register/", logic.RegisterHandler)
}

