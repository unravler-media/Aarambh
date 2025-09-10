package common

import "github.com/gofiber/fiber/v2"

func InvalidRequest(ctx *fiber.Ctx, resp any) error {
	// This will Return a status 400 - bad request
	return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"response": &resp,
	})
}

func NotFound(ctx *fiber.Ctx, resp string) error {
	// this will return a status 404 - Not Found.
	return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"response": &resp,
	})
}

func IncorrectPassword(ctx *fiber.Ctx) error {
	// this will return a status 401 - UnauthorizedRequest
	return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"response": "Incorrect Password",
	})
}

func UnauthorizedRequest(ctx *fiber.Ctx, resp string) error {
	// this will return a status 401 - UnauthorizedRequest
	return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"response": &resp,
	})
}

func InternalServerError(ctx *fiber.Ctx, resp string) error {
	// this will return a status 500 - InternalServerError
	return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"response": &resp,
	})
}

func BadGateway(ctx *fiber.Ctx, resp string) error {
	// this will return 502 - BadGateway.
	return ctx.Status(fiber.StatusBadGateway).JSON(fiber.Map{
		"response": &resp,
	})
}
