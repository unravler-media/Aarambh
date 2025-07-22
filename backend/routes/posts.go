package routes

import (
	"backend/logic"

	"github.com/gofiber/fiber/v2"
)

func PostRoutes(router fiber.Router) {
	router.Get("/", logic.FetchPosts)
	router.Get("get/", logic.FetchPost)

	router.Post("create/", logic.CreatePost)
	router.Put("update/", logic.UpdatePost)

	router.Delete("delete/", logic.DeletePost)
}
