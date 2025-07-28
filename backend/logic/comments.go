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
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	session := c.Locals("session_user")
	if session == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Authorisation not provided.",
		})
	}

	user_session := session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	commnt_query := c.Query("id","none")
	if commnt_query == "none" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Comment ID Not Provided",
		})
	}

	type requestBody struct {
		Comment string `json:"comment"`
	}

	var req requestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Invalid Request Parameters.",
		})
	}

	var comment models.Comment
	query := db.Preload("Author").Where("id = ?", commnt_query).First(&comment)

	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Error finding the comment.",
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Comment not found.",
		})
	}

	if comment.AuthorID != user_session {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthorized Action.",
		})
	}

	query_comment := db.Model(&models.Comment{}).Where("id == ?", commnt_query).Update("comment", req.Comment)
	if query_comment.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Unable to update comment.",
		})
	}

	type responseStruct struct {
		ID string `json:"id"`
		UpdatedAt string `json:"updated_at"`
		Comment string `json:"name"`
		Author UserResponse `json:"author"`
	}

	var authorResponse UserResponse
	authorResponse = UserResponse{
		ID: comment.Author.ID,
		Username: comment.Author.Username,
		Avatar: comment.Author.Avatar,
		FullName: comment.Author.FullName,
	}

	var response responseStruct
	response = responseStruct{
		ID: comment.ID,
		UpdatedAt: comment.UpdatedAt,
		Comment: comment.Comment,
		Author: authorResponse,
	}

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func DeleteComment(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}
	session := c.Locals("session_user")
	if session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Authorisation not provided.",
		})
	}
	user_session := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	comment_query := c.Query("id", "none")
	if comment_query == "none" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Comment Query not provided",
		})
	}

	var comment models.Comment
	comnt_query := db.Where("id = ?", comment_query).First(&comment)
	if comnt_query.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Cannot get the comment",
		})
	}

	if comnt_query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Comment not Found",
		})
	}

	if comment.AuthorID != user_session {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthorized Action.",
		})
	}

	query := db.Delete(&comment)
	if query.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "Cannot Delete the comment.",
		})
	}

	return c.SendStatus(200)
}
