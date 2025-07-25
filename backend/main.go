package main

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"backend/databases"
	"backend/routes"

	"github.com/joho/godotenv"

	"github.com/gofiber/fiber/v2/middleware/cache"
	"time"
)

func main() {
	// To Ensure loading of .env files. (dont need this in serverless environments)
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Something went wrong while importing ENV Variables.")
	}

	// Initialise the Database Connection using a Custom Controller
	database := databases.TursoConnecter()

	// Initialise fiber instance with additional config
	// using custom JSON Encoders & decoders for faster performance (useless in Go V1.25)
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
		AllowOrigins: "https://localhost, https://127.0.0.1, https://aarambh-one.vercel.app, https://*.lovable.app",
	}))
	
	// adding validator globally to reuse later in project 
	var validate *validator.Validate
	validate = validator.New(validator.WithRequiredStructEnabled())
	
	// Using in the fiber middleware to initiate & validator 
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("validator", validate)
		return c.Next()
	})

	// adding database middleware to reuse globally
	app.Use(databases.InjectDatabase(database))
	
	// Implement Default In-Memory Caching
	app.Use(cache.New(cache.Config{
  	Next: func(c *fiber.Ctx) bool {
        return c.Query("noCache") == "true"
    },
    Expiration: 1 * time.Minute, // Cache Timeout set to 1 Minutes.
    CacheControl: true,
	}))
	
	
	// using Routes Grouping for a better DX (Developer Experience)
	routes.ApiRoutes(app.Group("/api"))
	

	// Sample Route we can remove it as well.
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Server is up!",
		})
	})

	// Initialise and listen on given port.
	app.Listen(":8000")
}
