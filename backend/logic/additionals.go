package logic

import (
	"backend/helpers"
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func HandleImage(c *fiber.Ctx) error {
	contextDemo := context.Background()
	type Payload struct {
		Image       string `json:"image"`
		Name        string `json:"name"`
		ContentType string `json:"contentType"`
	}

	var payload Payload
	if err := c.BodyParser(&payload); err != nil {
		return c.JSON(fiber.Map{
			"response": err,
		})
	}
	decode, err := helpers.HandleBase64Image(payload.Image)
	if err != nil {
		return c.JSON(fiber.Map{
			"response": "",
		})
	}
	bucket, err := helpers.BucketLoader()
	if err != nil {
		fmt.Println("Error while Loading Bucket: ", err)
		return c.JSON(fiber.Map{
			"response": "error loading bucket",
		})
	}

	resp, err := bucket.R2Uploader(contextDemo, payload.Name, decode, payload.ContentType)
	if err != nil {
		return c.JSON(fiber.Map{
			"response": "Fucked while uploading data",
		})
	}

	fmt.Println("Resp: ", resp)
	return c.JSON(fiber.Map{
		"response": resp,
	})
}
