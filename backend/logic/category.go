package logic

import (
	"backend/models"

	"backend/common"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// to handle url: GET /api/category/
func FetchCategory(c *fiber.Ctx) error {
	// Fetch all Categories
	db, _ := c.Locals("db").(*gorm.DB)

	type UserResponse struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Avatar   string `json:"avatar"`
		FullName string `json:"full_name"`
	}

	type PostsResponse struct {
		ID           string       `json:"id"`
		PostTitle    string       `json:"post_title"`
		Slug         string       `json:"slug"`
		CoverImage   string       `json:"cover_image"`
		Author       UserResponse `json:"author"`
		ReadTime     string       `json:"read_time"`
		IsFeatured   bool         `json:"is_featured"`
		ShortContent string       `json:"short_content"`
	}

	// prepare a structure for response
	type CategoryResponse struct {
		ID          string          `json:"id"`
		Name        string          `json:"name"`
		Slug        string          `json:"slug"`
		Description string          `json:"description"`
		Posts       []PostsResponse `json:"posts"`
	}

	// empty variable of list (slice) of category
	var category models.Category

	query_slug := c.Query("slug")

	// db query
	categories_fetch := db.Debug().Preload("Posts", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Author")
	}).Select("id", "updated_at", "name", "slug", "description").Where("slug = ?", query_slug).First(&category)
	if categories_fetch.RowsAffected < 1 {
		return common.NotFound(c, "Category Does Not Exist.")
	}

	if categories_fetch.Error != nil {
		return common.InternalServerError(c, "Something Went Wrong.")
	}

	// Build response
	var response CategoryResponse

	// Map posts
	var postsResp []PostsResponse
	for _, post := range category.Posts {
		postsResp = append(postsResp, PostsResponse{
			ID:           post.ID,
			PostTitle:    post.PostTitle,
			Slug:         post.Slug,
			CoverImage:   post.CoverImage,
			ReadTime:     post.ReadTime,
			IsFeatured:   post.IsFeatured,
			ShortContent: post.ShortContent,
			Author: UserResponse{
				ID:       post.Author.ID,
				Username: post.Author.Username,
				FullName: post.Author.FullName,
				Avatar:   post.Author.Avatar,
			},
		})
	}

	// Add full category
	response = CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		Posts:       postsResp,
	}

	return common.Success(c, &response)
}

func CreateCategory(c *fiber.Ctx) error {
	// Create Single Category
	db, _ := c.Locals("db").(*gorm.DB)

	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)

	// parse the incoming request.
	var category models.Category

	// auto parsing the request params and populating category var
	if err := c.BodyParser(&category); err != nil {
		return common.InvalidRequest(c, "Invalid Request.")
	}

	// using the auto populated category to Create
	// Add user id to category
	category.UserID = token["sub"].(string) // assert string because token["sub"]
	if creation := db.Create(&category); creation.Error != nil {
		return common.InvalidRequest(c, "Unable to Create Category.")
	}

	response := make(map[string]string)
	response["ID"] = category.ID
	response["Name"] = category.Name
	response["Slug"] = category.Slug
	response["desctiption"] = category.Description
	response["user"] = category.UserID

	return common.Success(c, &response)
}

func FetchCategories(c *fiber.Ctx) error {
	// Fetch a Category
	db, _ := c.Locals("db").(*gorm.DB)

	type result struct {
		ID          string
		Name        string
		Slug        string
		Description string
	}

	var category []result
	query_lookup := db.Model(&models.Category{}).
		Select("id", "name", "slug", "description").
		Find(&category)

	if query_lookup.Error != nil {
		return common.BadGateway(c, "Cannot Fetch Categories.")
	}

	if query_lookup.RowsAffected < 1 {
		return common.NotFound(c, "No Categories.")
	}

	return common.Success(c, &category)
}

func UpdateCategory(c *fiber.Ctx) error {
	// Update a Category
	db, _ := c.Locals("db").(*gorm.DB)

	// get the user id from the JWT session
	token := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)
	category_id := c.Query("category_id")

	// fetch the category in question
	var category models.Category
	query := db.Find(&category, "id == ?", category_id)

	if query.Error != nil {
		return common.BadGateway(c, "Cannot Handle Query.")
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Category Does Not Exist.")
	}

	// check if the logged in user is the creator of that category
	if user_id == category.UserID {
		// empty means ignore if true
	} else {
		return common.UnauthorizedRequest(c, "Unauthorized.")
	}

	// if the above check is done and the user logged in is the creator then we can continue
	if err := c.BodyParser(&category); err != nil {
		return common.InvalidRequest(c, "Invalid Information")
	}

	save_query := db.Save(&category)
	if save_query.Error != nil {
		return common.InvalidRequest(c, "Cannot Update Category.")
	}

	response := make(map[string]string)
	response["id"] = category.ID
	response["updated_at"] = category.UpdatedAt.String()
	response["slug"] = category.Slug
	response["description"] = category.Description

	return common.Success(c, &response)
}

func DeleteCategory(c *fiber.Ctx) error {
	// Delete a Category
	db, _ := c.Locals("db").(*gorm.DB)

	category_id := c.Query("category_id")
	var category models.Category

	query := db.Delete(&category, "id = ?", category_id)
	if query.Error != nil {
		return common.InvalidRequest(c, query.Error.Error())
	}

	if query.RowsAffected < 1 {
		return common.NotFound(c, "Category Does Not Exist.")
	}

	return common.Success(c, "Category Deleted.")
}
