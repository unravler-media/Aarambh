package handler

import (
 "github.com/gofiber/fiber/v2/middleware/adaptor"
 "github.com/gofiber/fiber/v2"
 "net/http"

	// "fmt"
	"github.com/go-playground/validator/v10"
	gojson "github.com/goccy/go-json"
	
	"backend/databases"
	"backend/routes"

// 	"github.com/joho/godotenv"

	"github.com/gofiber/fiber/v2/middleware/cors"
)

// This vercel.go is basically for deploying to vercel.
// all of main.go should be replicated inside the handler() function
// the handler will return the http interface and fulfill requirements for vercel runtime.

// Handler is the main entry point of the application. Think of it like the main() method
func Handler(w http.ResponseWriter, r *http.Request) {
	// This is needed to set the proper request path in `*fiber.Ctx`
	r.RequestURI = r.URL.String()
	handler().ServeHTTP(w, r)
}


// building the fiber application
func handler() http.HandlerFunc {
	// ignore this shit in vercel?
	// godotenv.Load()

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
	
	// adding validator globally to reuse globally
	var validate *validator.Validate
	validate = validator.New(validator.WithRequiredStructEnabled())

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("validator", validate)
		return c.Next()
	})

	// adding database middleware to reuse globally
	app.Use(databases.InjectDatabase(database))
	routes.ApiRoutes(app.Group("/api"))
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Server is up!",
		})
	})

	return adaptor.FiberApp(app)
}
