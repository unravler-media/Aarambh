package logic

import (
	"backend/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func QueryPosts(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	query := c.Query("q", "none")
	if query == "none" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Query not provided.",
		})
	}

	type AuthorResponse struct {
		Username string `json:"username"`
		FullName string `json:"full_name"`
		Avatar string `json:"avatar"`
	}

	type CategoryResponse struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	type QueryPosts struct {
		UpdatedAt string `json:"updated_at"`
		PostTitle string `json:"post_title"`
		Slug string `json:"slug"`
		ShortContent string `json:"short_content"`
		CoverImage string `json:"cover_image"`
		Author AuthorResponse
		Category CategoryResponse
	}

	var posts []models.Post
	fetch_query := db.Debug().Preload("Author", func(db *gorm.DB) *gorm.DB {
		return db.Select("id","username","full_name","avatar")
	}).Preload("Category", func(db *gorm.DB) *gorm.DB {
		return db.Select("id","name","slug")
	}).Select(
		"id",
		"updated_at",
		"post_title",
		"slug",
		"short_content",
		"cover_image",
		"author_id",
		"category_id",
	).Where("slug LIKE ?", query).Find(&posts)
	if fetch_query.Error != nil {
		fmt.Printf("ERror in Query: %v", fetch_query)
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Unable to fetch Query.",
		})
	}

	if fetch_query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "No Posts Found.",
		})
	}

	var finalResponse []QueryPosts
	for _, post := range posts {
    finalResponse = append(finalResponse, QueryPosts{
        UpdatedAt:    post.UpdatedAt,
        PostTitle:    post.PostTitle,
        Slug:         post.Slug,
        ShortContent: post.ShortContent,
        CoverImage:   post.CoverImage,
        Author: AuthorResponse{
            Username: post.Author.Username,
            FullName: post.Author.FullName,
            Avatar:   post.Author.Avatar,
        },
        Category: CategoryResponse{
            Name: post.Category.Name,
            Slug: post.Category.Slug,
        },
    })
}

	return c.JSON(fiber.Map{
		"response": &finalResponse,
	})
}
