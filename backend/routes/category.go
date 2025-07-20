package routes
import (
	"github.com/gofiber/fiber/v2"
	"backend/logic"
	"backend/middlewares"
)
func CategoryRoutes(router fiber.Router) {
	router.Get("/", logic.FetchCategories)
	router.Get("get/", logic.FetchCategory)

	router.Post("create/", middlewares.Protect(), logic.CreateCategory)
	router.Put("edit/", middlewares.Protect(), logic.UpdateCategory)

	router.Delete("delete/", middlewares.Protect(), logic.DeleteCategory)
}
