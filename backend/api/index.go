package handler

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"github.com/go-playground/validator/v10"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"backend/databases"
	"backend/helpers"
	"backend/middlewares"
	"backend/routes"

	"os"

	"github.com/redis/go-redis/v9"
)

// Handler is the main entry point of the application. Think of it like the main() method
func Handler(w http.ResponseWriter, r *http.Request) {
	// This is needed to set the proper request path in `*fiber.Ctx`
	r.RequestURI = r.URL.String()

	handler().ServeHTTP(w, r)
}

// building the fiber application
func handler() http.HandlerFunc {
	// To Ensure loading of .env files. (dont need this in serverless environments)
	godotenv.Load()

	// Initialise the Database Connection using a Custom Controller
	database := databases.TursoConnecter()

	// Initialise fiber instance with additional config
	// using custom JSON Encoders & decoders for faster performance (useless in Go V1.25)
	app := fiber.New(
		fiber.Config{
			ServerHeader: "Aikyum Server",
			AppName:      "Project Aikyum",
			JSONEncoder:  gojson.Marshal,
			JSONDecoder:  gojson.Unmarshal,
			BodyLimit:    6 * 1024 * 1024, // server will only accept requests of upto 6MB.
		},
	)

	// CORS middleware
	app.Use(cors.New(cors.Config{
		AllowMethods:     "GET, POST, PUT, DELETE",
		AllowOrigins:     "https://aikyum-one.vercel.app, http://127.0.0.1:3000, http://localhost:4321",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// adding validator globally to reuse later in project
	var validate = validator.New(validator.WithRequiredStructEnabled())

	// Using in the fiber middleware to initiate & validator
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("validator", validate)
		return c.Next()
	})

	// adding database middleware to reuse globally
	app.Use(databases.InjectDatabase(database))

	var redisClient *redis.Client
	config, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		panic("Invalid REDIS_URL: " + err.Error())
	}
	redisClient = redis.NewClient(config)

	// Using custom Caching solution
	middlewares.InitialiseRedisClient(redisClient)
	app.Use(middlewares.CacheRequests(0)) // 0 = Persistent TTL. We can also do 5 * time.minutes
	helpers.WipeCacheGlobalHook(
		database,
	) // utilising Gorm global lifecycle hook to wipe redis clean.

	// using Routes Grouping for a better DX (Developer Experience)
	routes.ApiRoutes(app.Group("/api"))

	// Sample Route we can remove it as well.
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"response": "Server is up!",
		})
	})

	// Initialise and listen on given port.
	return adaptor.FiberApp(app)
}
