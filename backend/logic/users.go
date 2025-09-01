package logic

import (
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type usersStructure struct {
	Username  string `json:"username"`
	FullName  string `json:"full_name"`
	UpdatedAt string `json:"updated_at"`
	Avatar    string `json:"avatar"`
	Role      string `json:"role"`
	Email     string `json:"email"`
}

func GetUsers(ctx *fiber.Ctx) error {
	db := ctx.Locals("db").(*gorm.DB)

	// Validate if the Request is from Admin or not.
	session_user := ctx.Locals("session_user")
	if session_user == nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "User not found in session.",
		})
	}

	jwtLocale := ctx.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)

	// created the post object now add the user id to it.
	user_id := token["sub"].(string)
	var userObject models.Users
	db.First(&userObject, "id = ?", user_id)
	if userObject.Role != "admin" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthorized.",
		})
	}

	var users []usersStructure
	query := db.Model(&models.Users{}).
		Select("username", "full_name", "updated_at", "avatar", "role", "email").
		Order("updated_at DESC").
		Find(&users)

	if query.RowsAffected < 1 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "No Users Exist.",
		})
	}

	if query.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Something Went Wrong.",
		})
	}
	return ctx.JSON(fiber.Map{
		"response": &users,
	})
}

func GetUser(ctx *fiber.Ctx) error {
	return nil
}

func EditUser(ctx *fiber.Ctx) error {
	return nil
}

func DeleteUser(ctx *fiber.Ctx) error {
	return nil
}
