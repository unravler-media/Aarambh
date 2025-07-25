package routes

import (
	"backend/middlewares"
	"backend/logic"
	"github.com/gofiber/fiber/v2"
)

func CommentRoutes(router fiber.Router) {
	router.Post("create/", middlewares.Protect() ,logic.CreateComment)
	router.Put("edit/", middlewares.Protect(), logic.UpdateComment)
	router.Delete("delete/", middlewares.Protect(), logic.DeleteComment)
}
