package databases

import (
	"fmt"
	"backend/models"
	"github.com/gofiber/fiber/v2"

	// gonna use this custom packagr to implement Turso's LibSql in Gorm Config
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	// using custom sql version (libsql)
	sqlite "github.com/ytsruh/gorm-libsql"
	"os"
	"gorm.io/gorm"
)

func TursoConnecter() *gorm.DB {
	api_host := os.Getenv("turso_api")

	// Creating a GORM config & Passing Creds. 
	db, err := gorm.Open(sqlite.New(
		sqlite.Config{
			DriverName: "libsql",
			DSN: api_host, // URI: libsql://<uri>?authToken=authtoken from Turso Here
		},
	), &gorm.Config{})
	if err != nil {
		fmt.Println("[!] Unable to Connect to DB!")
		return db
	}
	fmt.Println("[*] Connection Established to Database.")

	// run migrations manually for all of the models
	migrations := db.AutoMigrate(
		&models.Users{},
		&models.Category{},
	)

	if migrations != nil {
		fmt.Println("[!] Error while doing migrations!", err)
		return db
	}
	fmt.Println("[*] Succesfully Ran Migrations.")	
	return db
}

// function that we can use in fiber as middleware to execute & inject db instance.
// This way we can re-use it anywhere throughout the Application.
func InjectDatabase(session *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("db", session)
		return c.Next()
	}
}
