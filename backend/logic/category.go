package logic

import (
	"backend/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"

)

// to handle url: GET /api/category/
func FetchCategories(c *fiber.Ctx) error {
	// Fetch all Categories
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		fmt.Println("DB Fucked!")
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"response": "Something went Wrong.",
		})
	}

	// prepare a structure for response
	type CategoryResponse struct {
		ID string
		Name string
		Slug string
	}

	// empty variable of list (slice) of category
	var categories []CategoryResponse

	// db query 
	categories_fetch := db.Select("id","updated_at","name","slug").Model(&models.Category{}).Find(&categories)
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

	return c.JSON(fiber.Map{
		"response": categories,
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
		c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
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

func FetchCategory(c *fiber.Ctx) error {
	// Fetch a Category
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": "DB Fucked.",
		})
	}	
	category_id := c.Query("category_id")

	type result struct {
		ID string
		Name string
		Slug string
		Description string
	}

	var categorySingle result
	query_lookup := db.Debug().Model(&models.Category{}).Select("id", "name", "slug", "description").Where("id = ?", category_id).First(&categorySingle)

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
		"response": categorySingle,
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

	category_id := c.Query("category_id")
	fmt.Println(category_id)
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
