package logic

import (
	"backend/models"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/go-playground/validator/v10"
)

func LoginHandler(c *fiber.Ctx) error {
	// parse the request body
	var data = make(map[string]string)
	if err := c.BodyParser(&data); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"response": "Invalid Information",
		})
	}

	// load db connection
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(500).JSON(fiber.Map{
			"response": "DB Fucked!",
		})
	}

	// fetch if user exists
	var user models.Users
	fetchUser := db.Where("username == ?", data["username"]).First(&user)
	if fetchUser.RowsAffected < 1 {
		return c.Status(404).JSON(fiber.Map{
			"response": "No users.",
		})
	}

	// if user exists then now we compare passwords
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"]))
	if err != nil {
		fmt.Println("Invalid Password: ", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"response": "Incorrect Password",
		})
	}

	// if password compare was Successfull then generate JWT claim
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": string(user.ID),
		"exp": time.Now().Add(time.Hour * 24).Unix(), // 24 Hours Validity
	})

	secretKey := os.Getenv("secretKey")
	token, err := claims.SignedString([]byte(secretKey))
	if err != nil {
		fmt.Println("Error Generating token: ", err)
		return c.Status(500).JSON(fiber.Map{
			"response": "Error Creating Tokens",
		})
	}

	// set JWT cookie from server side
	cookie := fiber.Cookie{
		Name: "jwt",
		Value: token,
		Expires: time.Now().Add(time.Hour * 24), // expires in 24 Hours
		HTTPOnly: true,
		Secure: true,
	}

	c.Cookie(&cookie)

	return c.Status(200).JSON(fiber.Map{
		"response": token,
	})
}

func RegisterHandler(c *fiber.Ctx) error {
	// load the db
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(500).JSON(fiber.Map{
			"response": "DB Fucked!",
		})
	}

	// take input from the post request and put it into data var
	var data = models.Users{}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"response": "Invalid Information Provided.",
		})
	}

	// valdiate the request body
	validation, ok := c.Locals("validator").(*validator.Validate)
	if !ok {
		return c.Status(fiber.StatusFailedDependency).JSON(fiber.Map{
			"response": "Failed to load validation",
		})
	}
	
	// do the validation of user instance
	if err := validation.Struct(&data); err != nil {
		errors_list := make(map[string]string)
		for _, err := range err.(validator.ValidationErrors) {
			errors_list[err.Field()] = fmt.Sprintf("Validation failed on tag '%s'", err.Tag())
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"response": errors_list,
		})
	}

	var user models.Users
	if err := db.Where("username = ?", &data.Username).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "User with that email already exists.",
		})
	}

	// User does not already exist. Now Hash the password.
	password_hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"response": "Failed to hash password",
		})
	}

	// Now we can create the user object
	newUser := models.Users{
		FullName: data.FullName,
		Username: data.Username,
		Password: password_hash,
	}

	if err := db.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "Unable to Register a new user.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"response": "Registration Successfull.",
	})
}
