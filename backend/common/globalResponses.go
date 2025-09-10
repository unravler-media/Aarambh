package common

import "github.com/gofiber/fiber/v2"

func Success(ctx *fiber.Ctx, resp any) error {
	return ctx.Status(200).JSON(fiber.Map{
		"response": &resp,
	})
}
