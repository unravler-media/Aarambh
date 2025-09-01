package logic

import (
	"backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type usersDTO struct {
	Username  string    `json:"username"`
	FullName  string    `json:"full_name"`
	UpdatedAt time.Time `json:"updated_at"`
	Avatar    string    `json:"avatar"`
	Role      string    `json:"role"`
	Email     string    `json:"email"`
}

type userPostsDTO struct {
	Slug       string    `json:"slug"`
	PostTitle  string    `json:"post_title"`
	UpdatedAt  time.Time `json:"updated_at"`
	IsFeatured bool      `json:"is_featured"`
}

type userDTO struct {
	Username  string         `json:"username"`
	FullName  string         `json:"full_name"`
	UpdatedAt time.Time      `json:"updated_at"`
	Avatar    string         `json:"avatar"`
	Role      string         `json:"role"`
	Bio       string         `json:"bio"`
	Email     string         `json:"email"`
	Posts     []userPostsDTO `json:"posts"`
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

	var users []usersDTO
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

	var userModel models.Users

	query := db.
		Preload("Posts").
		First(&userModel, "username = ?", ctx.Params("username"))

	if query.RowsAffected < 1 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "User not Found.",
		})
	}

	if query.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Something went wrong.",
		})
	}

	// manually mapping the nested relations of posts.
	var posts []userPostsDTO // will store the posts in this slice.
	// ignore the index and loop over posts and store it into variable p.
	for _, p := range userModel.Posts {
		posts = append(
			posts,
			userPostsDTO{ // append function takes destination and source. each userPostsDTO into posts slice.
				Slug:       p.Slug,
				PostTitle:  p.PostTitle,
				UpdatedAt:  p.UpdatedAt,
				IsFeatured: p.IsFeatured,
			},
		)
	}
	user := userDTO{
		Username:  userModel.Username,
		FullName:  userModel.FullName,
		UpdatedAt: userModel.UpdatedAt,
		Avatar:    userModel.Avatar,
		Role:      userModel.Role,
		Bio:       userModel.Bio,
		Email:     userModel.Email,
		Posts:     posts,
	}

	return ctx.JSON(fiber.Map{
		"response": &user,
	})
}

func EditUser(ctx *fiber.Ctx) error {
	return nil
}

func DeleteUser(ctx *fiber.Ctx) error {
	return nil
}
