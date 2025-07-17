package logic

import (
	"backend/models"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

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
		UpdatedAt time.Time `json:"updated_at"`
		Name string
		Slug string
		PostCount string `json:"post_count"`
	}

	var categories []models.Category
	categories_fetch := db.Find(&categories).Model(&CategoryResponse{})
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

	// parse the incoming request.
	var category models.Category

	// auto parsing the request params and populating category var
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusNotAcceptable).JSON(fiber.Map{
			"response": "Invalid Request Parameters",
		})
	}

	// using the auto populated category to Create
	creation := db.Create(&category)
	if creation.Error != nil {
		c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"response": "Cannot Create the category",
		})
	}

	return c.JSON(fiber.Map{
		"response": &category,
	})
}

func FetchCategory(c *fiber.Ctx) error {
	// Fetch a Category
	return nil
}

func UpdateCategory(c *fiber.Ctx) error {
	// Update a Category 
	return nil 
}

func DeleteCategory(c *fiber.Ctx) error {
	// Delete a Category 
	return nil
}
