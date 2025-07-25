package logic

import (
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func CreateComment(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	user_session := c.Locals("session_user")
	if user_session == nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Authrisation Not Provided.",
		})
	}

	user_id := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	var comment models.Comment
	if err := c.BodyParser(&comment); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Invalid Request Body.",
		})
	}

	comment.AuthorID = user_id
	save := db.Create(&comment)
	if save.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Unable to Save Query.",
		})
	}

	response := make(map[string]any)
	response["id"] = comment.ID
	response["comment"] = comment.Comment
	response["updated_at"] = comment.UpdatedAt

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func UpdateComment(c *fiber.Ctx) error {
	return nil
}

func DeleteComment(c *fiber.Ctx) error {
	return nil
}
