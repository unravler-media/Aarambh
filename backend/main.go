package main

import (
	"fmt"

	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"backend/databases"
	"backend/routes"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Something went wrong while importing ENV Variables.")
	}

	database := databases.TursoConnecter()
	app := fiber.New(
		fiber.Config{
			ServerHeader: "Aarambh Server",
			AppName:      "Project Aarambh",
			JSONEncoder:  gojson.Marshal,
			JSONDecoder:  gojson.Unmarshal,
		},
	)

	// CORS middleware 
	app.Use(cors.New(cors.Config{
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	
	app.Use(databases.InjectDatabase(database))
	routes.ApiRoutes(app.Group("/api"))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Server is up!",
		})
	})
	app.Listen(":8000")
}
