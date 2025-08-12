package routes

import (
	"backend/logic"

	"backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func DashboardRoutes(router fiber.Router) {
	router.Post("member/", middlewares.Protect(), logic.MemberDashboard)
}
