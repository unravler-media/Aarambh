package routes

import (
	"backend/logic"
	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(router fiber.Router) {
	router.Post("/", middlewares.Protect(), logic.GetUsers)
	router.Post("get/:username", middlewares.Protect(), logic.GetUser)
	router.Put("edit/:username", middlewares.Protect(), logic.EditUser)
	router.Delete("delete/:username", middlewares.Protect(), logic.DeleteUser)
}
