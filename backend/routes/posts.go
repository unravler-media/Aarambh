package routes

import (
	"backend/logic"

	"github.com/gofiber/fiber/v2"

	"backend/middlewares"
)

func PostRoutes(router fiber.Router) {
	router.Get("/", logic.FetchPosts)
	router.Get("get/", logic.FetchPost)

	router.Post("create/", middlewares.Protect(), logic.CreatePost)
	router.Put("update/", middlewares.Protect(), logic.UpdatePost)

	router.Delete("delete/", middlewares.Protect(), logic.DeletePost)
}
