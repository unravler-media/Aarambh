package logic

import (
	"backend/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// added just so we can reuse this response struct in this file alone.
type UserResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	FullName string `json:"full_name"`
	Avatar   string `json:"avatar"`
	Role     string `json:"role"`
}

type postsResponse struct {
	ID           string           `json:"id"`
	UpdatedAt    time.Time        `json:"updated_at"`
	PostTitle    string           `json:"post_title"    gorm:"index" validate:"required,min=4"`
	Slug         string           `json:"slug"`
	CoverImage   string           `json:"cover_image"`
	Author       UserResponse     `json:"author"`
	ReadTime     string           `json:"read_time"`
	IsFeatured   bool             `json:"is_featured"`
	Category     categoryResponse `json:"category"`
	ShortContent string           `json:"short_content"`
}

type categoryResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

func FetchPosts(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}

	var posts []models.Post
	query := db.Debug().
		Preload("Author").
		Preload("Category").
		Select("id", "post_title", "slug", "cover_image", "read_time", "is_featured", "updated_at", "author_id", "category_id", "short_content").
		Order("updated_at desc").
		Find(&posts)

	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Unable to query Database",
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "No Posts Exists.",
		})
	}

	var response []postsResponse

	for _, p := range posts {
		response = append(response, postsResponse{
			ID:           p.ID,
			UpdatedAt:    p.UpdatedAt,
			PostTitle:    p.PostTitle,
			Slug:         p.Slug,
			CoverImage:   p.CoverImage,
			ReadTime:     p.ReadTime,
			IsFeatured:   p.IsFeatured,
			ShortContent: p.ShortContent,
			Author: UserResponse{
				ID:       p.Author.ID,
				Username: p.Author.Username,
				FullName: p.Author.FullName,
				Avatar:   p.Author.Avatar,
				Role:     p.Author.Role,
			},
			Category: categoryResponse{
				ID:   p.Category.ID,
				Name: p.Category.Name,
				Slug: p.Category.Slug,
			},
		})
	}

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func FetchPost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}

	post_slug := c.Query("post")

	var post models.Post
	query := db.Preload("Author").
		Preload("Category").
		Preload("Comments").
		Preload("Comments.Author").
		Where("slug = ?", post_slug).
		First(&post)
	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Cannot Get the Post.",
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Post not Found.",
		})
	}

	type commentsResponse struct {
		ID          string
		UpdatedAt   string
		Author      UserResponse
		CommentText string
	}

	type postResponse struct {
		ID           string
		UpdatedAt    time.Time
		PostTitle    string
		Slug         string
		ShortContent string
		Content      string
		CoverImage   string `json:"cover_image"`
		Author       UserResponse
		Category     categoryResponse
		Comments     []commentsResponse
	}

	// Transform comments
	var transformedComments []commentsResponse
	for _, comment := range post.Comments {
		transformedComments = append(transformedComments, commentsResponse{
			ID:          comment.ID,
			UpdatedAt:   comment.UpdatedAt,
			CommentText: comment.CommentText,
			Author: UserResponse{
				ID:       comment.Author.ID,
				Username: comment.Author.Username,
				FullName: comment.Author.FullName,
				Avatar:   comment.Author.Avatar,
				Role:     comment.Author.Role,
			},
		})
	}

	var response postResponse
	response = postResponse{
		ID:           post.ID,
		UpdatedAt:    post.UpdatedAt,
		PostTitle:    post.PostTitle,
		Slug:         post.Slug,
		ShortContent: post.ShortContent,
		Content:      post.Content,
		CoverImage:   post.CoverImage,
		Author: UserResponse{
			ID:       post.Author.ID,
			Username: post.Author.Username,
			FullName: post.Author.FullName,
			Avatar:   post.Author.Avatar,
			Role:     post.Author.Role,
		},
		Category: categoryResponse{
			ID:   post.Category.ID,
			Name: post.Category.Name,
			Slug: post.Category.Slug,
		},
		Comments: transformedComments,
	}

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func CreatePost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}

	// extracting information from the token and decoding it and storing it inside the token var
	fmt.Println("Session User", c.Locals("session_user"))
	session_user := c.Locals("session_user")
	if session_user == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "User not found in session.",
		})
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	fmt.Println("jwtLocale", jwtLocale)
	token := jwtLocale.Claims.(jwt.MapClaims)

	// prepare & parse the request parameters
	var post models.Post
	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Invalid Request Parameters",
		})
	}

	// created the post object now add the user id to it.
	user_id := token["sub"].(string)
	post.AuthorID = user_id

	query := db.Create(&post)
	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Cannot Create Post.",
		})
	}

	response := make(map[string]any)
	response["id"] = post.ID
	response["updated_at"] = post.UpdatedAt
	response["slug"] = post.Slug
	response["author_id"] = post.AuthorID
	response["content"] = post.Content
	response["short_content"] = post.ShortContent
	response["category_id"] = post.CategoryID
	response["cover_image"] = post.CoverImage
	response["post_title"] = post.PostTitle
	response["is_featured"] = post.IsFeatured
	response["read_time"] = post.ReadTime

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func UpdatePost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	user_session := c.Locals("session_user")
	if user_session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Unable to process information.",
		})
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)

	post_slug := c.Query("post") // pass in the post slug
	if post_slug == "" {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Post ID not provided.",
		})
	}

	var post models.Post
	query := db.Where("slug = ?", post_slug).First(&post)
	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Unable to fetch request post.",
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Post Not Found.",
		})
	}

	if post.AuthorID != user_id {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthrised Action.",
		})
	}

	if err := c.BodyParser(&post); err != nil {
		c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Invalid Request information.",
		})
	}

	saving_query := db.Save(&post)
	if saving_query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Error Saving the Post.",
		})
	}

	return c.JSON(fiber.Map{
		"response": "Updated Post.",
	})
}

func DeletePost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	user_session := c.Locals("session_user")
	if user_session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Unable to Process information.",
		})
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)

	post_slug := c.Query("post")
	if post_slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Post Slug Not provided.",
		})
	}

	var post models.Post
	fetch_post := db.First(&post, "slug = ?", post_slug)

	if fetch_post.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Unable to perform Query.",
		})
	}

	if post.AuthorID != user_id {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthrised Action.",
		})
	}

	db.Delete(&post)

	return c.JSON(fiber.Map{
		"response": "Post Deleted.",
	})
}

func LikePost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}

	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "User session unavailable.",
		})
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Post Not Found!",
		})
	}

	if fetch_post_query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Something went wrong while getting Post.",
		})
	}

	// Validate if the post in question is already liked by the user in question or not.
	var already_liked_post models.PostLike
	already_liked := db.Where("liked_by_user = ? AND post_id = ?", user, postHolder.ID).
		Find(&already_liked_post)

	if already_liked.RowsAffected > 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"response": "Already Liked!",
		})
	} // means post is liked by this user in past.

	if already_liked.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Cannot Validate.",
		})
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var likedPostInstance models.PostLike
	likedPostInstance.LikedByUser = user
	likedPostInstance.PostID = postHolder.ID

	liking := db.Create(&likedPostInstance)
	if liking.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Cannot Like the Post.",
		})
	}
	return c.SendStatus(200)
}

func ReadPost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}
	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "User session unavailable.",
		})
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Post Not Found!",
		})
	}

	if fetch_post_query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Something went wrong while getting Post.",
		})
	}

	// Validate if the post in question is already liked by the user in question or not.
	var already_viewed_post models.PostView
	already_viewed := db.Where("viewed_by_user = ? AND viewed_post_id = ?", user, postHolder.ID).
		Find(&already_viewed_post)

	if already_viewed.RowsAffected > 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"response": "Already Viewed!",
		})
	} // means post is liked by this user in past.

	if already_viewed.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Cannot Validate.",
		})
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var ViewedPostInstance models.PostView
	ViewedPostInstance.ViewedByUser = user
	ViewedPostInstance.ViewedPostID = postHolder.ID

	viewing := db.Create(&ViewedPostInstance)
	if viewing.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Cannot Like the Post.",
		})
	}
	return c.SendStatus(200)
}

func SavePost(c *fiber.Ctx) error {
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}
	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "User session unavailable.",
		})
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)
	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Post Not Found!",
		})
	}

	if fetch_post_query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Something went wrong while getting Post.",
		})
	}

	// Validate if the post in question is already saved by the user in question or not.
	var already_saved_post models.SavedPosts
	already_saved := db.Where("saved_by_user = ? AND saved_post_id = ?", user, postHolder.ID).
		Find(&already_saved_post)

	if already_saved.RowsAffected > 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"response": "Already Saved!",
		})
	} // means post is liked by this user in past.

	if already_saved.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Cannot Validate.",
		})
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var SavedPostInstance models.SavedPosts
	SavedPostInstance.SavedByUser = user
	SavedPostInstance.SavedPostID = postHolder.ID

	viewing := db.Create(&SavedPostInstance)
	if viewing.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "Cannot Save the Post.",
		})
	}
	return c.SendStatus(200)

}
