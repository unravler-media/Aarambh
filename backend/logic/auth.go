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

// Main logic if somebody does: /api/auth/login/
func LoginHandler(c *fiber.Ctx) error {
	// parse the request body
	var data = make(map[string]string) // will make sure we have a dict in request Body
	if err := c.BodyParser(&data); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"response": "Invalid Information",
		})
	}

	// load db instance
	db, ok := c.Locals("db").(*gorm.DB)
	if !ok {
		return c.Status(500).JSON(fiber.Map{
			"response": "DB Fucked!",
		})
	}

	// fetch if user exists
	var user models.Users // create empty variable with type of our users struct from models
	
	// Gorm DB Query to check if the username in question exists.
	
	fetchUser := db.Where("username == ?", data["username"]).First(&user)
	// where: is the condition where we are matching existing users to query username.
	// first: is the condition where we limit limits to 1 only.
	// first: inside here we pass the output to the user var
	// and since user var is already of struct users type we will output based on that.

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
	// setting the token to HTTP Only server side.
	c.Cookie(&cookie)

	return c.Status(200).JSON(fiber.Map{
		"response": token,
	})
}

// here we do the register and this function handles: /api/auth/register/
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

	// automatically parse the request and fill in the fields inside the provided struct refrence
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

	// empty variable created with data of users from models.
	var user models.Users

	// query db where we look for users with username that user wants to register
	// so we can be sure that the username does not already exist.
	// store the result to the user variable & limit the db query to one result.
	if err := db.Where("username = ?", &data.Username).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "User with that email already exists.",
		})
	}

	// So if User does not already exist. Now Hash the password and use it in our new user.
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

	// create a new user instance based on the created struct called newUser
	if err := db.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"response": "Unable to Register a new user.",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"response": "Registration Successfull.",
	})
}
