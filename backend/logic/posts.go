package logic

import (
	"backend/common"
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
	db, _ := c.Locals("db").(*gorm.DB)

	var posts []models.Post
	query := db.Debug().Scopes(common.Paginate(c)).
		Preload("Author").
		Preload("Category").
		Select("id", "post_title", "slug", "cover_image", "read_time", "is_featured", "updated_at", "author_id", "category_id", "short_content").
		Order("updated_at desc").
		Find(&posts)

	if query.Error != nil {
		return common.InternalServerError(c, "Cannot query.")
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Post Does Not Exist.")
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

	return common.Success(c, &response)
}

func FetchPost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	post_slug := c.Query("post")

	var post models.Post
	query := db.Preload("Author").
		Preload("Category").
		Preload("Comments").
		Preload("Comments.Author").
		Where("slug = ?", post_slug).
		First(&post)
	if query.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Post Does Not Exist.")
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

	var response = postResponse{
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

	return common.Success(c, &response)
}

func FetchPostMeta(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// extracting information from the token and decoding it and storing it inside the token var
	session_user := c.Locals("session_user")
	if session_user == nil {
		return common.InvalidRequest(c, "user does not exist.")
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)

	var has_liked bool
	var has_saved bool

	// fetch if the logged in user liked this post in past.
	var likeCounter int64
	post_id := c.Params("id")
	db.Model(&models.PostLike{}).
		Where("post_id = ? AND liked_by_user = ?", post_id, user_id).
		Count(&likeCounter)

	if likeCounter > 0 {
		has_liked = true
	} else {
		has_liked = false
	}

	// fetch if the logged in user saved this post in past.
	var saveCounter int64
	db.Model(&models.SavedPosts{}).
		Where("saved_post_id = ? AND saved_by_user = ?", post_id, user_id).
		Count(&saveCounter)

	if saveCounter > 0 {
		has_saved = true
	} else {
		has_saved = false
	}

	type metaResponse struct {
		HasLiked bool
		HasSaved bool
	}

	var response = metaResponse{
		HasLiked: has_liked,
		HasSaved: has_saved,
	}

	return common.Success(c, &response)
}

func CreatePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// extracting information from the token and decoding it and storing it inside the token var
	fmt.Println("Session User", c.Locals("session_user"))
	session_user := c.Locals("session_user")

	if session_user == nil {
		return common.InvalidRequest(c, "user does not exist.")
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	fmt.Println("jwtLocale", jwtLocale)
	token := jwtLocale.Claims.(jwt.MapClaims)

	// prepare & parse the request parameters
	var post models.Post
	if err := c.BodyParser(&post); err != nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	// created the post object now add the user id to it.
	user_id := token["sub"].(string)
	post.AuthorID = user_id

	query := db.Create(&post)
	if query.Error != nil {
		return common.InternalServerError(c, "Cannot Create Post.")
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

	return common.Success(c, &response)
}

func UpdatePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Information.")
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)

	post_slug := c.Query("post") // pass in the post slug
	if post_slug == "" {
		return common.InvalidRequest(c, "Post ID Invalid.")
	}

	var post models.Post
	query := db.Where("slug = ?", post_slug).First(&post)

	if query.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Post not Found.")
	}

	if post.AuthorID != user_id {
		return common.UnauthorizedRequest(c, "Unauthrized")
	}

	if err := c.BodyParser(&post); err != nil {
		return common.InvalidRequest(c, "Invalid Information")
	}

	saving_query := db.Save(&post)
	if saving_query.Error != nil {
		return common.InternalServerError(c, "Cannot Save the Post.")
	}

	return common.Success(c, "Updated Post.")
}

func DeletePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Information")
	}

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)

	post_slug := c.Query("post")
	if post_slug == "" {
		return common.InvalidRequest(c, "invalid slug.")
	}

	var post models.Post
	fetch_post := db.First(&post, "slug = ?", post_slug)

	if fetch_post.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	if post.AuthorID != user_id {
		return common.UnauthorizedRequest(c, "Unauthrized.")
	}

	db.Delete(&post)

	return common.Success(c, "Post Deleted")
}

func LikePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return common.NotFound(c, "Post Does not Exist.")
	}

	if fetch_post_query.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	// Validate if the post in question is already liked by the user in question or not.
	var already_liked_post models.PostLike
	already_liked := db.Where("liked_by_user = ? AND post_id = ?", user, postHolder.ID).
		Find(&already_liked_post)

	if already_liked.RowsAffected > 0 {
		return common.Forbidden(c, "Already Liked!")
	} // means post is liked by this user in past.

	if already_liked.Error != nil {
		return common.InvalidRequest(c, "Cannot Validate Request.")
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var likedPostInstance models.PostLike
	likedPostInstance.LikedByUser = user
	likedPostInstance.PostID = postHolder.ID

	liking := db.Create(&likedPostInstance)
	if liking.Error != nil {
		return common.InternalServerError(c, "Cannot Like Post.")
	}

	return c.SendStatus(200)
}

func UnlikePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return common.NotFound(c, "Post Not Found.")
	}

	if fetch_post_query.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	// Validate if the post in question is already liked by the user in question or not.
	var already_liked_post models.PostLike
	already_liked := db.Where("liked_by_user = ? AND post_id = ?", user, postHolder.ID).
		Find(&already_liked_post)

	if already_liked.RowsAffected > 0 {
		deleteQeury := db.Delete(&already_liked_post)
		if deleteQeury.Error != nil {
			return common.InvalidRequest(c, "Cannot unike the post")
		}
	} // means post is liked by this user in past.

	if already_liked.Error != nil {
		return common.InvalidRequest(c, "Cannot Validate.")
	}

	return c.SendStatus(200)
}

func ReadPost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return common.NotFound(c, "Post Not Found.")
	}

	if fetch_post_query.Error != nil {
		return common.InternalServerError(c, "Cannot Get Post")
	}

	// Validate if the post in question is already liked by the user in question or not.
	var already_viewed_post models.PostView
	already_viewed := db.Where("viewed_by_user = ? AND viewed_post_id = ?", user, postHolder.ID).
		Find(&already_viewed_post)

	if already_viewed.RowsAffected > 0 {
		return common.Forbidden(c, "Already Viewed!")
	} // means post is liked by this user in past.

	if already_viewed.Error != nil {
		return common.InvalidRequest(c, "Cannot Validate")
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var ViewedPostInstance models.PostView
	ViewedPostInstance.ViewedByUser = user
	ViewedPostInstance.ViewedPostID = postHolder.ID

	viewing := db.Create(&ViewedPostInstance)
	if viewing.Error != nil {
		return common.InternalServerError(c, "Cannot Like the Post")
	}
	return c.SendStatus(200)
}

func SavePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// Get user information from headers.
	user_session := c.Locals("session_user")
	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return common.NotFound(c, "Post Not Found")
	}

	if fetch_post_query.Error != nil {
		return common.InternalServerError(c, "Cannot Get Post.")
	}

	// Validate if the post in question is already saved by the user in question or not.
	var already_saved_post models.SavedPosts
	already_saved := db.Where("saved_by_user = ? AND saved_post_id = ?", user, postHolder.ID).
		Find(&already_saved_post)

	if already_saved.RowsAffected > 0 {
		return common.Forbidden(c, "Already Saved")
	} // means post is liked by this user in past.

	if already_saved.Error != nil {
		return common.InvalidRequest(c, "Cannot Validate")
	}

	// if post exists create a new instance of PostLike and submit data into that struct
	var SavedPostInstance models.SavedPosts
	SavedPostInstance.SavedByUser = user
	SavedPostInstance.SavedPostID = postHolder.ID

	viewing := db.Create(&SavedPostInstance)
	if viewing.Error != nil {
		return common.InternalServerError(c, "Cannot Save the Post.")
	}
	return c.SendStatus(200)
}

func UnSavePost(c *fiber.Ctx) error {
	db, _ := c.Locals("db").(*gorm.DB)

	// Get user information from headers.
	user_session := c.Locals("session_user")

	if user_session == nil {
		return common.InvalidRequest(c, "Invalid Request")
	}

	user := user_session.(*jwt.Token).Claims.(jwt.MapClaims)["sub"].(string)

	// get the post from the slug
	post_slug := c.Params("slug")
	var postHolder models.Post
	fetch_post_query := db.First(&postHolder, "slug = ?", post_slug)

	if fetch_post_query.RowsAffected < 1 {
		return common.NotFound(c, "Post Not Found")
	}

	if fetch_post_query.Error != nil {
		return common.InternalServerError(c, "Cannot Fetch Post")
	}

	// Validate if the post in question is already saved by the user in question or not.
	var already_saved_post models.SavedPosts
	already_saved := db.Where("saved_by_user = ? AND saved_post_id = ?", user, postHolder.ID).
		Find(&already_saved_post)

	if already_saved.RowsAffected > 0 {
		deleteQuery := db.Delete(&already_saved_post)
		if deleteQuery.Error != nil {
			return common.InvalidRequest(c, "Cannot UnBookmark the Post")
		}
	} // means post is saved by this user in past.

	if already_saved.Error != nil {
		return common.InvalidRequest(c, "Cannot Validate")
	}
	return c.SendStatus(200)
}
