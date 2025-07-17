package routes
import (
	"github.com/gofiber/fiber/v2"
	"backend/logic"
)
func CategoryRoutes(router fiber.Router) {
	router.Get("/", logic.FetchCategories)
	router.Get("get/", logic.FetchCategory)

	router.Post("create/", logic.CreateCategory)
	router.Put("edit", logic.UpdateCategory)

	router.Delete("delete/", logic.DeleteCategory)
}
