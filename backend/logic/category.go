package logic

import (
	"backend/models"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"

)

// to handle url: GET /api/category/
func FetchCategory(c *fiber.Ctx) error {
	// Fetch all Categories
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		fmt.Println("DB Fucked!")
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"response": "Something went Wrong.",
		})
	}

	type UserResponse struct {
		ID string
		username string
		Avatar string 
		FullName string
	}

	type PostsResponse struct {
		ID string
		PostTitle string
		Slug string
		CoverImage string
		Author UserResponse
		ReadTime string
		IsFeatured bool
	}

	// prepare a structure for response
	type CategoryResponse struct {
		ID string
		Name string
		Slug string
		Description string
		Posts []PostsResponse
	}

	// empty variable of list (slice) of category
	var category models.Category

	query_slug := c.Query("slug")

	// db query 
	categories_fetch := db.Debug().Preload("Posts", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Author")
	}).Select("id","updated_at","name","slug","description").Where("slug = ?", query_slug).First(&category)
	if categories_fetch.RowsAffected < 1 {
		return c.Status(404).JSON(fiber.Map{
			"response": "No Categories Exist.",
		})
	}

	if categories_fetch.Error != nil {
		fmt.Println("Error with Categories Fetch all Query: ", categories_fetch.Error)
		return c.Status(500).JSON(fiber.Map{
			"response": "Something went wrong.",
		})
	}

	// Build response
	var response CategoryResponse
		// Map posts
	var postsResp []PostsResponse
	for _, post := range category.Posts {
		postsResp = append(postsResp, PostsResponse{
			ID:         post.ID,
			PostTitle:  post.PostTitle,
			Slug:       post.Slug,
			CoverImage: post.CoverImage,
			ReadTime:   post.ReadTime,
			IsFeatured: post.IsFeatured,
			Author: UserResponse{
				ID:       post.Author.ID,
				username: post.Author.Username,
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
		Posts: postsResp,
	}

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func CreateCategory(c *fiber.Ctx) error {
	// Create Single Category
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(500).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}
	
	jwtLocale := c.Locals("session_user").(*jwt.Token)
	token := jwtLocale.Claims.(jwt.MapClaims)
	
	// parse the incoming request.
	var category models.Category

	// auto parsing the request params and populating category var
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"response": "Invalid Request Parameters",
		})
	}

	// using the auto populated category to Create
  // Add user id to category
	category.UserID = token["sub"].(string) // assert string because token["sub"]
 	if creation := db.Create(&category); creation.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Cannot Create the category",
		})
	}
	
	response := make(map[string]string)
	response["ID"] = category.ID
	response["Name"] = category.Name
	response["Slug"] = category.Slug
	response["desctiption"] = category.Description
	response["user"] = category.UserID

	return c.JSON(fiber.Map{
		"response": &response,
	})
}

func FetchCategories(c *fiber.Ctx) error {
	// Fetch a Category
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}	
	type result struct {
		ID string
		Name string
		Slug string
		Description string
	}

	var category []result
	query_lookup := db.Model(&models.Category{}).Select("id", "name", "slug", "description").Find(&category)

	if query_lookup.Error != nil {
		fmt.Println("Error while Fetching Categories: ", query_lookup.Error)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Something went wrong while Fetching Categories",
		})
	}

	if query_lookup.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "No Categories Found.",
		})
	}

	return c.JSON(fiber.Map{
		"response": category,
	})
}

func UpdateCategory(c *fiber.Ctx) error {
	// Update a Category
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}
	
	// get the user id from the JWT session
	token := c.Locals("session_user").(*jwt.Token).Claims.(jwt.MapClaims)
	user_id := token["sub"].(string)
	category_id := c.Query("category_id")
	
	// fetch the category in question
	var category models.Category
	query := db.Find(&category, "id == ?", category_id)
	if query.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "Cannot Query for this Category",
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "Category Not Found.",
		})
	}

	// check if the logged in user is the creator of that category
	if user_id == category.UserID {
		// empty means ignore if true
	} else {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Unauthorized Operation.",
		})
	}

	// if the above check is done and the user logged in is the creator then we can continue
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "Invalid Information Provided.",
		})	
	}

	save_query := db.Save(&category)
	if save_query.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"responnse": "Error while updating category",
		})
	}

	response := make(map[string]string)
	response["id"] = category.ID
	response["updated_at"] = category.UpdatedAt.String()
	response["slug"] = category.Slug
	response["description"] = category.Description

	return c.JSON(fiber.Map{
		"response": response,
	})
}

func DeleteCategory(c *fiber.Ctx) error {
	// Delete a Category 
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": "DB Fucked",
		})
	}

	category_id := c.Query("category_id")
	var category models.Category
	query := db.Delete(&category, "id = ?", category_id)
	if query.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"response": query.Error,
		})
	}

	if query.RowsAffected < 1 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"response": "No Category Exist.",
		})
	}

	return c.JSON(fiber.Map{
		"response": "Category Deleted Succesfully.",
	})
}
