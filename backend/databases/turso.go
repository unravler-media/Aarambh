package databases

import (
	"fmt"
	"backend/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	sqlite "github.com/ytsruh/gorm-libsql"
	"os"
	"gorm.io/gorm"
)

func TursoConnecter() *gorm.DB {
	api_host := os.Getenv("turso_api")
	db, err := gorm.Open(sqlite.New(
		sqlite.Config{
			DriverName: "libsql",
			DSN: api_host,
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

func InjectDatabase(session *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("db", session)
		return c.Next()
	}
}
