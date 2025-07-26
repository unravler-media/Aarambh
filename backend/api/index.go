package handler

import (
	"os"

	"github.com/go-playground/validator/v10"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"backend/databases"
	"backend/routes"

	"time"

	"github.com/gofiber/fiber/v2/middleware/cache"

	"net/http"

	"github.com/gofiber/fiber/v2/middleware/adaptor"

	"github.com/gofiber/storage/redis/v3"
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
		AllowOrigins: "https://aarambh-one.vercel.app, http://127.0.0.1:3000, https://31f32cda-2994-4292-bed6-4a187ba6a181.lovableproject.com",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
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

	// gonna use Redis as storage for caching.
	store := redis.New(redis.Config{
		URL: os.Getenv("REDIS_URL"),
		Reset: false,
	})

	app.Use(cache.New(cache.Config{
  	Next: func(c *fiber.Ctx) bool {
        return c.Query("noCache") == "true"
    },
    Expiration: 1 * time.Minute, // Cache Timeout set to 1 Minutes.
    CacheControl: true,
		Storage: store,
	}))	

	// using Routes Grouping for a better DX (Developer Experience)
	routes.ApiRoutes(app.Group("/api"))
	

	// Sample Route we can remove it as well.
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Server is up!",
		})
	})

	return adaptor.FiberApp(app)
}
