package routes

import (
	"backend/logic"

	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func DashboardRoutes(router fiber.Router) {
	router.Post("member/", middlewares.Protect(), logic.MemberDashboard)
	router.Post("creator/", middlewares.Protect(), logic.CreatorDashboard)
	router.Post("admin/", middlewares.Protect(), logic.AdminDashboard)
}
