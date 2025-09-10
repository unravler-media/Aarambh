package logic

import (
	"backend/common"
	"backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func CreateComment(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.UnauthorizedRequest(c, "Invalid Authrisation.")
	}

	user_id := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	var comment models.Comment

	if err := c.BodyParser(&comment); err != nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	comment.AuthorID = user_id
	save := db.Create(&comment)

	if save.Error != nil {
		return common.InternalServerError(c, "Cannot Save Comment.")
	}

	response := make(map[string]any)
	response["id"] = comment.ID
	response["comment_text"] = comment.CommentText
	response["updated_at"] = comment.UpdatedAt

	return common.Success(c, &response)
}

func UpdateComment(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	session := c.Locals("session_user")
	if session == nil {
		return common.UnauthorizedRequest(c, "Unauthorized.")
	}

	user_session := session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	comment_id := c.Query("comment_id", "none")

	if comment_id == "none" {
		return common.InvalidRequest(c, "Invalid Comment ID")
	}

	type requestBody struct {
		CommentText string `json:"comment_text"`
	}

	var req requestBody
	var commentInstance models.Comment

	query := db.First(&commentInstance, "id = ?", comment_id)

	if err := c.BodyParser(&req); err != nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	if query.Error != nil {
		return common.InternalServerError(c, "Error Updating Comment.")
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Comment Not Found")
	}

	if commentInstance.AuthorID != user_session {
		return common.UnauthorizedRequest(c, "Unauthorized")
	}

	commentInstance.CommentText = req.CommentText
	commentInstance.AuthorID = user_session

	err := db.Save(&commentInstance).Error
	if err != nil {
		return common.InvalidRequest(c, "Cannot Update Comment.")
	}

	type responseStruct struct {
		ID          string `json:"id"`
		UpdatedAt   string `json:"updated_at"`
		CommentText string `json:"comment_text"`
		AuthorID    string `json:"author_id"`
	}

	var response = responseStruct{
		ID:          commentInstance.ID,
		UpdatedAt:   commentInstance.UpdatedAt,
		CommentText: commentInstance.CommentText,
		AuthorID:    commentInstance.AuthorID,
	}

	return common.Success(c, &response)
}

func DeleteComment(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	session := c.Locals("session_user")
	if session == nil {
		return common.UnauthorizedRequest(c, "Unauthorized")
	}

	user_session := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	comment_query := c.Query("id", "none")

	if comment_query == "none" {
		return common.InvalidRequest(c, "Invalid Comment Query.")
	}

	var comment models.Comment
	comnt_query := db.Where("id = ?", comment_query).First(&comment)

	if comnt_query.Error != nil {
		return common.InvalidRequest(c, "Unable to Fetch Comment.")
	}

	if comnt_query.RowsAffected < 1 {
		return common.NotFound(c, "Comment Does not Exist.")
	}

	if comment.AuthorID != user_session {
		return common.UnauthorizedRequest(c, "Unauthorized")
	}

	query := db.Delete(&comment)
	if query.Error != nil {
		return common.BadGateway(c, "Cannot Delete Comment.")
	}

	return c.SendStatus(200)
}
