package logic

import (
	"backend/common"
	"backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func QueryPosts(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	query := c.Query("q", "none")
	if query == "none" {
		return common.InvalidRequest(c, "Invalid Request")
	}

	type AuthorResponse struct {
		Username string `json:"username"`
		FullName string `json:"full_name"`
		Avatar   string `json:"avatar"`
	}

	type CategoryResponse struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	type QueryPosts struct {
		UpdatedAt    time.Time `json:"updated_at"`
		PostTitle    string    `json:"post_title"`
		Slug         string    `json:"slug"`
		ShortContent string    `json:"short_content"`
		CoverImage   string    `json:"cover_image"`
		Author       AuthorResponse
		Category     CategoryResponse
	}

	var posts []models.Post
	fetch_query := db.Debug().
		Scopes(common.Paginate(c)).
		Preload("Author", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "username", "full_name", "avatar").Distinct()
		}).
		Preload("Category", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "slug").Distinct()
		}).
		Select(
			"id",
			"updated_at",
			"post_title",
			"slug",
			"short_content",
			"cover_image",
			"author_id",
			"category_id",
		).
		Where("slug LIKE ?", "%"+query+"%").
		Find(&posts)

	if fetch_query.Error != nil {
		return common.InternalServerError(c, "Unable to Fetch Query")
	}

	if fetch_query.RowsAffected < 1 {
		return common.NotFound(c, "No Post Found")
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
	return common.Success(c, &finalResponse)
}
